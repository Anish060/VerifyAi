const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const detectRoutes = require('./routes/detect');
const cookieParserMiddleware = require('./middleware/cookieparser.js');
const userRoutes = require('./routes/user.js');
const auth = require('./routes/auth.js');
const cors = require('cors');

dotenv.config();

const app = express();
const port = process.env.PORT || 8080;

// ✅ Allowed frontend origins
const allowedOrigins = [
  'http://localhost:5173',
  'https://verify-ai-lake.vercel.app',
];

// ✅ Preflight Middleware (fixes the CORS login issue)
app.set("trust proxy", 1);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Credentials", "true");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(200);
  next();
});


// ✅ Trust Render proxy (for secure cookies)
app.set('trust proxy', 1);

// ✅ Parsing middlewares
app.use(express.json());
app.use(cookieParserMiddleware);

// ✅ Multer upload
const upload = multer({ dest: 'uploads/' });

// ✅ Routes
app.use('/api/detect', upload.single('file'), detectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', auth);

// ✅ Health route
app.get('/', (req, res) => {
  res.send('VerifyAI backend is running ✅');
});

// ✅ Start server
app.listen(port, () => {
  console.log(`🚀 Server live on port ${port}`);
});
