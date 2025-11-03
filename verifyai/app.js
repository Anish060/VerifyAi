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

// ✅ 1. Allow multiple frontend origins (Vercel + local)
const corsOptions = {
  origin: [
    'http://localhost:5173',
    'https://verify-ai-lake.vercel.app',
  ],
  credentials: true, // ✅ Important for cookies (JWTs)
};

// ✅ 2. Apply CORS before routes
app.use(cors(corsOptions));

// ✅ 3. Allow Express to trust Render’s proxy (needed for HTTPS cookies)
app.set('trust proxy', 1);

// ✅ 4. Middleware setup
app.use(express.json());
app.use(cookieParserMiddleware);

// ✅ 5. Multer file uploads
const upload = multer({ dest: 'uploads/' });

// ✅ 6. API routes
app.use('/api/detect', upload.single('file'), detectRoutes);
app.use('/api/user', userRoutes);
app.use('/api/auth', auth);

// ✅ 7. Default route
app.get('/', (req, res) => {
  res.send('VerifyAI backend is running 🚀');
});

// ✅ 8. Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
