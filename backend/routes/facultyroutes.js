const express = require('express');
const router = express.Router();
const Faculties = require('../models/faculties');
const Session = require("../models/sessionModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const facultyauth = require("../middleware/facultyauth");
const Internships = require("../models/Internship");
const uuid = require("uuid");
//login
router.post("/faculty/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    console.log(emailId,password);
    // console.log(`Received emailId: ${emailId}`);
    const faculty = await Faculties.findOne({ emailId });
    if (!faculty)
      return res
        .status(400)
        .json({ message: "Invalid email or password email not found" });

    console.log("faculty found");

    const isPasswordValid = await bcrypt.compare(password, faculty.password);

    if (!isPasswordValid)
      return res
        .status(400)
        .json({ message: "Invalid email or password password doesnt match" });

    console.log("password matched");

    const token = jwt.sign({ userId: faculty._id }, "your_secret_key");
    const sessionId = uuid.v4();

    const newSession = new Session({
      userId: faculty._id,
      sessionId,
    });
    await newSession.save();

    const responseBody = {
      "x-auth-token": token, // Include the token
      "x-session-id": sessionId, // Include the session ID
    };

    res.status(200).json(responseBody);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/faculty/:facultyId", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res
      .status(400)
      .json({ error: "Email and password are required fields" });
  }

  const updateFields = { password };

  Faculties.findByIdAndUpdate(req.params.facultyId, updateFields, { new: true })
    .then((faculty) => {
      if (!faculty) {
        return res.status(404).json({ error: "faculty not found" });
      }
      res.status(200).json(faculty);
    })
    .catch((err) => res.status(400).json({ error: "Error: " + err }));
});



router.get('/getfaculties',async (req,res) => {
    try{
      const faculties = await Faculties.find();
      res.status(200).json(faculties);
    }
    catch(error){
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  })

  router.get('/faculty/myinternships', facultyauth, async (req, res) => {
    try {
      const facultyId = req.user.userId;
      // console.log(facultyId);
      const internships = await Internships.find({ postedby: facultyId });
      // console.log(internships);
      res.status(200).json(internships);
    } catch (error) {
      res.status(500).json({ message: 'Server Error', error: error.message });
    }
  });
  

module.exports = router;
