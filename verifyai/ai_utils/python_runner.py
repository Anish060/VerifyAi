import sys
import json
import subprocess
import pdfplumber
import docx2txt
from PIL import Image
from transformers import pipeline
import cv2
import numpy as np
import torch
import gc

# Reduce CPU threads to avoid Render crash
torch.set_num_threads(1)

# -------- Model Cache (load once) --------
MODEL_IMAGE = None
MODEL_DEEPFAKE = None

# ✅ Use Lightweight models (stable for free tier)
IMAGE_MODEL_NAME = "microsoft/resnet-18"  # small lightweight CNN
DEEPFAKE_MODEL_NAME = "melfm/dfdc_deepfake_detection"

# -------- Text Extraction --------

def extract_text_from_pdf(path):
    try:
        with pdfplumber.open(path) as pdf:
            text = ''.join([page.extract_text() or '' for page in pdf.pages])
        return text.strip()
    except Exception as e:
        return f"[PDF extraction error: {str(e)}]"

def extract_text_from_docx(path):
    try:
        return docx2txt.process(path).strip()
    except Exception as e:
        return f"[DOCX extraction error: {str(e)}]"

def extract_text_from_txt(path):
    try:
        with open(path, 'r', encoding='utf-8') as f:
            return f.read().strip()
    except Exception as e:
        return f"[TXT extraction error: {str(e)}]"

# -------- Gemini Text AI Detection --------
def detect_ai_text_probability_gemini(text):
    try:
        result = subprocess.run(
            ["node", "Gemini.js", text[:2000]],
            capture_output=True,
            text=True
        )
        output = result.stdout.strip()
        if not output:
            return "[Gemini API error: no output]"
        return json.loads(output)
    except Exception as e:
        return f"[Gemini API error: {str(e)}]"

# -------- Image AI Detection --------
def classify_image(image_path):
    global MODEL_IMAGE
    try:
        # Load model only once
        if MODEL_IMAGE is None:
            MODEL_IMAGE = pipeline("image-classification", model=IMAGE_MODEL_NAME)

        img = Image.open(image_path).convert("RGB")
        result = MODEL_IMAGE(img)[0]
        return f"{result['label']} ({result['score']*100:.2f}%)"
    except Exception as e:
        return f"[Image classification error: {str(e)}]"

# -------- Deepfake Detection for Image --------
def detect_deepfake_image(path):
    global MODEL_DEEPFAKE
    try:
        if MODEL_DEEPFAKE is None:
            MODEL_DEEPFAKE = pipeline("image-classification", model=DEEPFAKE_MODEL_NAME)

        img = Image.open(path).convert("RGB")
        result = MODEL_DEEPFAKE(img)[0]
        label = result["label"].lower()
        score = result["score"] * 100

        if "fake" in label:
            return round(score, 2)
        return round(100 - score, 2)
    except Exception as e:
        return f"[Deepfake detection error: {str(e)}]"

# -------- Deepfake Detection for Video --------
def detect_deepfake_video(path, max_frames=5):
    global MODEL_DEEPFAKE
    try:
        if MODEL_DEEPFAKE is None:
            MODEL_DEEPFAKE = pipeline("image-classification", model=DEEPFAKE_MODEL_NAME)

        cap = cv2.VideoCapture(path)
        total = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frames = np.linspace(0, total-1, max_frames, dtype=int)

        scores = []
        for i in frames:
            cap.set(cv2.CAP_PROP_POS_FRAMES, i)
            ret, frame = cap.read()
            if not ret: continue
            img = Image.fromarray(cv2.cvtColor(frame, cv2.COLOR_BGR2RGB))
            result = MODEL_DEEPFAKE(img)[0]
            label = result["label"].lower()
            score = result["score"] * 100
            if "fake" in label:
                scores.append(score)
            else:
                scores.append(100 - score)

        cap.release()
        if not scores:
            return "[Video deepfake detection error]"
        return round(float(np.mean(scores)), 2)
    except Exception as e:
        return f"[Video deepfake detection error: {str(e)}]"

# -------- Main --------
def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python python_runner.py <filepath> <ext>"}))
        return

    path, ext = sys.argv[1], sys.argv[2].lower()
    result = {"text": None, "ai_score": None, "image": None, "deepfake": None}

    try:
        if ext == "pdf":
            text = extract_text_from_pdf(path); result["text"]=text
            result["ai_score"]=detect_ai_text_probability_gemini(text)

        elif ext == "docx":
            text = extract_text_from_docx(path); result["text"]=text
            result["ai_score"]=detect_ai_text_probability_gemini(text)

        elif ext == "txt":
            text = extract_text_from_txt(path); result["text"]=text
            result["ai_score"]=detect_ai_text_probability_gemini(text)

        elif ext in ["jpg","jpeg","png"]:
            result["text"] = "[Image File]"
            result["image"] = classify_image(path)
            result["deepfake"] = detect_deepfake_image(path)

        elif ext in ["mp4","mov","avi","mkv"]:
            result["text"] = "[Video File]"
            result["deepfake"] = detect_deepfake_video(path)

        else:
            result["text"]="[Unsupported file type]"

        print(json.dumps(result))

    except Exception as e:
        print(json.dumps({"error": str(e)}))

    # ✅ Free RAM
    gc.collect()

if __name__ == "__main__":
    main()
