const express = require('express');
const router = express.Router();
const Faculties = require('../models/faculties');
const Session = require("../models/sessionModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const facultyauth = require("../middleware/facultyauth");
const Internships = require("../models/Internship");
const uuid = require("uuid");
const Students = require('../models/Students');
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
  
  router.get('/internships/getStudents/:internshipId', facultyauth, async (req, res) => {
    const { internshipId } = req.params;
  
    try {
      const internship = await Internships.findById(internshipId);
  
      if (!internship) {
        return res.status(404).json({ message: 'Internship not found' });
      }
      // console.log(internship.currentApplicants);
      // Send response with studentsworking field
      res.status(200).json(internship.currentApplicants);
    } catch (error) {
      console.error('Error fetching internship:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.put('/faculty/updateInternshipStatus/:studentId', facultyauth, async (req, res) => {
    const { studentId } = req.params;
    const { internshipId, status } = req.body;
  
    try {
      const student = await Students.findById(studentId);
  
      if (!student) {
        return res.status(404).json({ message: 'Student not found' });
      }
  
      const existingApplicationIndex = student.internshipApplications.findIndex(app => app.internshipId.equals(internshipId));
  
      if (existingApplicationIndex !== -1) {
        student.internshipApplications[existingApplicationIndex].status = status;
      } else {
        student.internshipApplications.push({
          internshipId,
          status
        });
      }
  
      const updatedStudent = await student.save();
  
      res.status(200).json({ message: 'Internship application status updated successfully', student: updatedStudent });
    } catch (error) {
      console.error('Error updating internship application status:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  router.get('/internships/getworkingStudents/:internshipId', facultyauth, async (req, res) => {
    const { internshipId } = req.params;
  
    try {
      const internship = await Internships.findById(internshipId);
  
      if (!internship) {
        return res.status(404).json({ message: 'Internship not found' });
      }
      // console.log(internship.currentApplicants);
      // Send response with studentsworking field
      res.status(200).json(internship.studentsworking);
    } catch (error) {
      console.error('Error fetching internship:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  //Logout
router.get("/faculty/logout", facultyauth, async (req, res) => {
  try {
    const existingSession = await Session.deleteOne({
      userId: req.user.userId,
    });
    res.status(200);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//get student by id
router.post("/faculty/getstudent",facultyauth,async (req,res)=>{
  try {
    const {studentId} = req.body;
    const student = await Students.findById(studentId);
    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
})

router.put('/faculty/updateApplicationStatus/:studentId', facultyauth, async (req, res) => {
  const { studentId } = req.params;
  const { internshipId, status } = req.body;

  try {
    const student = await Students.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }

    const existingApplication = student.internshipApplications.find(app => app.internshipId.equals(internshipId));

    if (existingApplication) {
      existingApplication.status = status;
    } else {
      // If the internship application does not exist, return an error
      return res.status(404).json({ message: 'Internship application not found for the student' });
    }

    const updatedStudent = await student.save();

    res.status(200).json({ message: 'Internship application status updated successfully', student: updatedStudent });
  } catch (error) {
    console.error('Error updating internship application status:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});



// Protected route example
router.get("/faculty/me", facultyauth, async (req, res) => {
  try {
    const faculty = await Faculties.findById(req.user.userId);
    if (!faculty) return res.status(404).json({ message: "Faculty not found" });
    res.json(faculty._id);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
