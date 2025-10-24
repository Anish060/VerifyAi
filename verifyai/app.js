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
const corsOptions = {
    // 2. Specify the exact origin of your React frontend
    origin: 'http://localhost:5173', 
    
    // 3. IMPORTANT: Allow cookies/credentials to be sent (needed for JWT cookie)
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
