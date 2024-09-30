const express = require('express');
const router = express.Router();
const Student = require('../models/Students');
const Session = require("../models/sessionModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
const Internships = require("../models/Internship");
const uuid = require("uuid");


//signup
router.post("/students/signup", async (req, res) => {
    try {
      const { name, email, password, department } = req.body;
      console.log(req.body);
      const existingUser = await Student.findOne({ email });
      if (existingUser){
        return res.status(400).json({ message: "User already exists" });
      }
      
      const hashedPassword = await bcrypt.hash(password, 12);
      const student = new Student({ 
        name, 
        email, 
        password: hashedPassword, 
        department, 
      });  
      await student.save();
  
      // Send a success response back to the client
      res.status(200).json({ message: "Signup successful" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

//login
router.post("/student/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      console.log(emailId,password);
      console.log(`Received emailId: ${emailId}`);
      const student = await Student.findOne({ email:emailId });
      if (!student)
        return res
          .status(400)
          .json({ message: "Invalid email or password email not found" });
  
      console.log("student found");
  
      const isPasswordValid = await bcrypt.compare(password, student.password);
  
      if (!isPasswordValid)
        return res
          .status(400)
          .json({ message: "Invalid email or password password doesnt match" });
  
      console.log("password matched");
  
      const token = jwt.sign({ userId: student._id }, "your_secret_key");
      const sessionId = uuid.v4();
  
      const newSession = new Session({
        userId: student._id,
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

  //Logout
router.get("/students/logout", auth, async (req, res) => {
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
router.post("/getstudent",async (req,res)=>{
  try {
    const studentId = req.body;
    const student = await Student.findById(studentId);
    res.status(200).json(student);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: error.message});
  }
})

router.put('/students/updateInternshipStatus', auth, async (req, res) => {
  const { internshipId, status } = req.body;

  try {
    const student = await Student.findById(req.user.userId);
    console.log(student);

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

router.get('/student/myinternships', auth, async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const internships = await Internships.find({ studentsworking: { $elemMatch: { studentId: studentId } } });

    res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships for student:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

router.get('/student/applyforcertificate', auth, async (req, res) => {
  try {
    const studentId = req.user.userId;
    
    const internships = await Internships.find({
      studentsworking: { $elemMatch: { studentId: studentId, status: 'complete' } }
    });

    res.status(200).json(internships);
  } catch (error) {
    console.error('Error fetching internships for student:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


router.put('/student/updateDetails', auth, async (req, res) => {
  try {
    const studentId = req.user.userId; // Assuming userId is stored in req.user
    const {
      gender, phone, yearOfStudy, cgpa, skills: newSkills,
      subTitle, bio, resumeUrl, education: newEducation,
      internshipApplications: newInternshipApplications
    } = req.body;

    // Fetch the student by ID
    const student = await Student.findById(studentId);

    if (!student) {
      return res.status(404).json({ msg: 'Student not found' });
    }

    // Update student fields
    if (gender) student.gender = gender;
    if (phone) student.phone = phone;
    if (yearOfStudy) student.yearOfStudy = yearOfStudy;
    if (cgpa) student.cgpa = cgpa;
    if (subTitle) student.subTitle = subTitle;
    if (bio) student.bio = bio;
    if (resumeUrl) student.resumeUrl = resumeUrl;

    // Update skills array
    if (newSkills && newSkills.length > 0) {
      const updatedSkills = [...student.skills, ...newSkills];
      student.skills = [...new Set(updatedSkills)];
    }

    // Update education array
    if (newEducation && newEducation.length > 0) {
      student.education = newEducation; // Overwrites the entire education array
    }

    // Update internship applications array
    if (newInternshipApplications && newInternshipApplications.length > 0) {
      student.internshipApplications = newInternshipApplications; // Overwrites the entire internshipApplications array
    }

    // Save updated student data
    await student.save();

    res.json({ msg: 'Student details updated successfully', student });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});


// Protected route example
router.get("/students/me", auth, async (req, res) => {
    try {
      const student = await Student.findById(req.user.userId);
      if (!student) return res.status(404).json({ message: "Student not found" });
      res.json(student);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
module.exports = router;
