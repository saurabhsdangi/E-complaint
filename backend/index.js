const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require("./routes/authRoutes");
const postRoutes = require('./routes/postRoutes');

const app = express();

// ✅ Configure CORS for your Vercel frontend
app.use(cors({
  origin: "https://e-complaint-delta.vercel.app", // ✅ your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: false
}));

app.use(express.json());

app.use("/auth", authRoutes); // ✅ Auth route
app.use('/posts', postRoutes); // Public post access

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => console.log(err));
