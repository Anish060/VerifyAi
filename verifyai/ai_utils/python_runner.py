import sys
import json
import subprocess
import pdfplumber
import docx2txt
from PIL import Image
from transformers import pipeline
import cv2
import numpy as np
import tempfile
import os


# TEXT EXTRACTION FUNCTIONS

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


# AI TEXT DETECTION VIA GEMINI.JS

def detect_ai_text_probability_gemini(text):
    try:
        # Call Gemini.js via Node.js
        result = subprocess.run(
            ["node", "Gemini.js", text[:2000]],  # limit text length
            capture_output=True,
            text=True
        )
        output = result.stdout.strip()
        if not output:
            return "[Gemini API error: no output]"
        return json.loads(output)
    except Exception as e:
        return f"[Gemini API error: {str(e)}]"


# IMAGE CLASSIFICATION

def classify_image(image_path):
    try:
        classifier = pipeline("image-classification", model="google/vit-base-patch16-224")
        img = Image.open(image_path).convert("RGB")
        result = classifier(img)[0]
        return f"{result['label']} ({result['score'] * 100:.2f}%)"
    except Exception as e:
        return f"[Image classification error: {str(e)}]"


# DEEPFAKE DETECTION (IMAGE)

def detect_deepfake_image(path):
    try:
        classifier = pipeline("image-classification", model="dima806/deepfake_vs_real_image_detection")
        img = Image.open(path).convert("RGB")
        result = classifier(img)[0]
        label = result["label"].lower()
        score = result["score"] * 100
        if "fake" in label:
            return round(score, 2)
        elif "real" in label:
            return round(100 - score, 2)
        else:
            return round(score, 2)
    except Exception as e:
        return f"[Deepfake detection error: {str(e)}]"


# DEEPFAKE DETECTION (VIDEO)

def detect_deepfake_video(video_path, frame_sample_rate=10, max_frames=30):
    """
    Extract frames from video, classify them as deepfake or real,
    and return average deepfake probability.
    """
    try:
        classifier = pipeline("image-classification", model="dima806/deepfake_vs_real_image_detection")
        cap = cv2.VideoCapture(video_path)
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        frame_indices = np.linspace(0, total_frames-1, min(max_frames, total_frames), dtype=int)

        scores = []
        for idx in frame_indices:
            cap.set(cv2.CAP_PROP_POS_FRAMES, idx)
            ret, frame = cap.read()
            if not ret:
                continue
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            img_pil = Image.fromarray(frame_rgb)
            result = classifier(img_pil)[0]
            label = result["label"].lower()
            score = result["score"] * 100
            if "fake" in label:
                scores.append(score)
            elif "real" in label:
                scores.append(100 - score)
            else:
                scores.append(score)
        cap.release()
        if not scores:
            return "[Video deepfake detection error: no frames processed]"
        return round(float(np.mean(scores)), 2)
    except Exception as e:
        return f"[Video deepfake detection error: {str(e)}]"

def main():
    if len(sys.argv) != 3:
        print(json.dumps({"error": "Usage: python python_runner.py <filepath> <extension>"}))
        return

    path = sys.argv[1]
    ext = sys.argv[2].lower()

    result = {
        "text": None,
        "ai_score": None,
        "image": None,
        "deepfake": None
    }

    try:
        if ext == "pdf":
            text = extract_text_from_pdf(path)
            result["text"] = text
            result["ai_score"] = detect_ai_text_probability_gemini(text)
        elif ext == "docx":
            text = extract_text_from_docx(path)
            result["text"] = text
            result["ai_score"] = detect_ai_text_probability_gemini(text)
        elif ext == "txt":
            text = extract_text_from_txt(path)
            result["text"] = text
            result["ai_score"] = detect_ai_text_probability_gemini(text)
        elif ext in ["jpg", "jpeg", "png"]:
            result["text"] = "[Image File]"
            result["image"] = classify_image(path)
            result["deepfake"] = detect_deepfake_image(path)
        elif ext in ["mp4", "mov", "avi", "mkv"]:
            result["text"] = "[Video File]"
            result["deepfake"] = detect_deepfake_video(path)
        else:
            result["text"] = "[Unsupported file type]"

        print(json.dumps(result))
    except Exception as e:
        print(json.dumps({"error": str(e)}))

if __name__ == "__main__":
    main()
