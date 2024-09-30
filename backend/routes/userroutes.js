const express = require('express');
const router = express.Router();
const Users = require('../models/Users');
const Session = require('../models/sessionModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const Student = require('../models/Students');
const Faculty = require('../models/faculties');
const facultyauth = require('../middleware/facultyauth');
//login
router.post("/user/login", async (req, res) => {
    try {
      const { emailId, password } = req.body;
      console.log(emailId,password);
      // console.log(`Received emailId: ${emailId}`);
      const user = await Users.findOne({ email: emailId });
      if (!user)
        return res
          .status(400)
          .json({ message: "Invalid email or password email not found" });
  
      console.log("user found");
  
      const isPasswordValid = await bcrypt.compare(password, user.password);
  
      if (!isPasswordValid)
        return res
          .status(400)
          .json({ message: "Invalid email or password password doesnt match" });
  
      console.log("password matched");
  
      const token = jwt.sign({ userId: user.userId }, "your_secret_key");
      const sessionId = uuid.v4();
  
      const newSession = new Session({
        userId: user.userId,
        sessionId,
      });
      await newSession.save();
  
      const responseBody = {
        "x-auth-token": token, // Include the token
        "x-session-id": sessionId, // Include the session ID
        role: Array.isArray(user.role) ? user.role : [user.role] 
      };
  
      res.status(200).json(responseBody);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
router.get('/getusers',facultyauth,async(req,res)=>{
  try {
    const users = await Users.find(); // Retrieve all users from the database
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({message : error.message});
  }
});

router.post('/adduser', facultyauth, async (req, res) => {
  const { name, email, password, role, department } = req.body;

  try {
    // Validate request data
    if (!name || !email || !password || !Array.isArray(role) || role.length==0) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    let userEntry;

    if (role.includes('Student')) {
      // Create a new student entry
      userEntry = new Student({
        name,
        email,
        password: hashedPassword,
        department
      });

      await userEntry.save();
    } else if (role.includes('Faculty')) {
      // Create a new faculty entry
      userEntry = new Faculty({
        name,
        email,
        password: hashedPassword,
      });

      await userEntry.save();
    } else {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Create a new user entry
    const newUser = new Users({
      name,
      userId: userEntry._id,
      email,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: 'User added successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//update user status
router.put('/users/:id',facultyauth, async (req, res) => {
  const  id = req.params.id;
  const  {status}  = req.body;
  console.log(id);
  console.log(status);
  if (!['Active', 'Inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {

    const user = await Users.findOneAndUpdate(
      {userId: id},
      { status },
      { new: true } // Return the updated document
    );


    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }


    res.status(200).json({ message: 'User status updated successfully.', user });
  } catch (error) {
    console.error('Error updating user status:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.put('/edituser/:id', facultyauth, async (req, res) => {
  const id = req.params.id;
  const { name, email, role, status } = req.body;

  if (status && !['Active', 'Inactive'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status value.' });
  }

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (email) updateFields.email = email;
    if (role) updateFields.role = role;
    if (status) updateFields.status = status;

    const user = await Users.findOneAndUpdate(
      { userId: id },
      updateFields,
      { new: true } // Return the updated document
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const studentOrFacultyFields = {};
    if (name) studentOrFacultyFields.name = name;
    if (email) studentOrFacultyFields.email = email;

    if (role.includes('Student')) {
      await Student.findByIdAndUpdate(
        id,
        studentOrFacultyFields,
        { new: true }
      );
    } else {
      await Faculty.findByIdAndUpdate(
        id,
        studentOrFacultyFields,
        { new: true }
      );
    }

    res.status(200).json({ message: 'User updated successfully.', user });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


module.exports = router;