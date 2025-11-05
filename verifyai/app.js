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

// ✅ TRUST PROXY (for Render cookies)
app.set("trust proxy", 1);

// ✅ UNIVERSAL CORS FIX — allow any origin (works for demo day)
app.use((req, res, next) => {

  const origin = req.headers.origin || "*";
  res.setHeader("Access-Control-Allow-Origin", origin);
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

  // ✅ Preflight fast exit
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// ✅ Body + Cookies
app.use(express.json());
app.use(cookieParserMiddleware);

// ✅ Multer AFTER CORS
const upload = multer({ dest: 'uploads/' });

// ✅ ROUTES (MUST COME AFTER CORS + MULTER)
app.use('/api/detect', upload.single('file'), detectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', auth);

// ✅ Health route
app.get('/', (req, res) => {
  res.send('✅ VerifyAI backend live');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
