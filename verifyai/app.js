const express = require('express');
const multer = require('multer');
const dotenv = require('dotenv');
const detectRoutes = require('./routes/detect');
const cookieParserMiddleware = require('./middleware/cookieparser.js');
const userRoutes=require('./routes/user.js');
const auth=require('./routes/auth.js');
const cors = require('cors');
dotenv.config();
const app = express();
const port = process.env.PORT || 8080;
const allowedOrigins = [
  'http://localhost:5173',
  'https://verify-ai-lake.vercel.app'
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (for tools like Postman)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};


app.use(cors(corsOptions)); 

const upload = multer({ dest: 'uploads/' });

app.use(express.json());
app.use(cookieParserMiddleware);
app.use('/api/detect', upload.single('file'), detectRoutes);
app.use("/api/user",userRoutes);
app.use("/api/auth",auth);
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
