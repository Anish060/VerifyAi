const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const detectRoutes = require('./routes/detect');
const cookieParserMiddleware = require('./middleware/cookieparser.js');
const userRoutes = require('./routes/user.js');
const auth = require('./routes/auth.js');

dotenv.config();
const app = express();
const port = process.env.PORT || 8080;

// ✅ 1. Allowed Origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://verify-ai-lake.vercel.app',
];

// ✅ 2. CORS + Preflight Handler FIRST (before multer)
app.set("trust proxy", 1);

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin) || !origin) {
    res.header("Access-Control-Allow-Origin", origin || "*");
  }

  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});

// ✅ 3. Middlewares
app.use(express.json());
app.use(cookieParserMiddleware);

// ✅ 4. Multer setup (AFTER CORS)
const upload = multer({ dest: 'uploads/' });

// ✅ 5. Routes
app.use('/api/detect', upload.single('file'), detectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', auth);

// ✅ 6. Health route
app.get('/', (req, res) => {
  res.send('VerifyAI backend is running ✅');
});

// ✅ 7. Start Server
app.listen(port, () => {
  console.log(`🚀 Server live on port ${port}`);
});
