const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const InternshipRoutes = require('./routes/InternshipRoutes');
const Facultyroutes = require('./routes/facultyroutes');
dotenv.config();

const app = express();
const PORT = 5000;
const uri = process.env.MONGODB_URI;
const corsOptions = {
  origin: 'http://localhost:3000',
  // Other CORS options if needed
};
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

app.use('/api',InternshipRoutes);
app.use('/api',Facultyroutes);
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });