const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const facultyauth = require('../middleware/facultyauth');
const auth = require('../middleware/auth');
const ApplicationForCertificate = require('../models/applicationforcertificate');

router.get('/getInternship',async (req,res) => {
  try{
    const internships = await Internship.find();
    res.status(200).json(internships);
  }
  catch(error){
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
})

router.post('/getsingleinternship',async(req,res)=>{
  try {
    const internshipId = req.body;
    const response = await Internship.findById(internshipId);
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({message: 'Internal Server Error'})
  }
})
router.post('/addInternship',facultyauth, async (req, res) => {
  const userId = req.user.userId;
  try {
    // Extract data from the request body
    const {
      title,
      company,
      location,
      description,
      skillsRequired,
      startDate,
      endDate,
      applicationDeadline,
      eligibilityCriteria,
      maxApplicants,
    } = req.body;

    // Save the new internship directly to the database
    const newInternship = await Internship.create({
      title,
      company,
      location,
      description,
      skillsRequired,
      startDate,
      endDate,
      applicationDeadline,
      eligibilityCriteria,
      maxApplicants,
      postedby: userId,
    });

    res.status(201).json({ message: 'Internship added successfully', internship: newInternship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

router.put('/internships/updateCurrentApplicants/:internshipId',facultyauth, async (req, res) => {
  const { internshipId } = req.params;
  const { currentApplicants } = req.body;

  try {
    const updatedInternship = await Internship.findByIdAndUpdate(
      internshipId,
      { currentApplicants },
      { new: true } // To return the updated document
    );

    if (!updatedInternship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json({ message: 'Current applicants updated successfully', internship: updatedInternship });
  } catch (error) {
    console.error('Error updating current applicants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
router.put('/updateCurrentApplicants/:internshipId',auth, async (req, res) => {
  const { internshipId } = req.params;
  const { currentApplicants } = req.body;

  try {
    const updatedInternship = await Internship.findByIdAndUpdate(
      internshipId,
      { currentApplicants },
      { new: true } // To return the updated document
    );

    if (!updatedInternship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json({ message: 'Current applicants updated successfully', internship: updatedInternship });
  } catch (error) {
    console.error('Error updating current applicants:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// PUT to update studentsworking field of an internship
router.put('/internships/updateStudentsWorking/:internshipId',facultyauth, async (req, res) => {
  const { internshipId } = req.params;
  const { studentsworking } = req.body;

  try {
    const updatedInternship = await Internship.findByIdAndUpdate(
      internshipId,
      { studentsworking },
      { new: true } // To return the updated document
    );

    if (!updatedInternship) {
      return res.status(404).json({ message: 'Internship not found' });
    }

    res.status(200).json({ message: 'Students working updated successfully', internship: updatedInternship });
  } catch (error) {
    console.error('Error updating students working:', error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});


router.put('/internships/:internshipId/students/:studentId',facultyauth, async (req, res) => {
  const { internshipId, studentId } = req.params;
  const { status, credits, noofhours } = req.body;
  try {
    const internship = await Internship.findById(internshipId);
    if (!internship) {
      return res.status(404).send('Internship not found');
    }
    
    const student = internship.studentsworking.find(s => s.studentId.toString() == studentId);
    if (!student) {
      return res.status(404).send('Student not found in this internship');
    }

    // Update the fields
    if (status) student.status = status;
    if (credits) student.credits = credits;
    if (noofhours) student.noofhours = noofhours;
    await internship.save();
    res.status(200).json({ message: 'Students working updated successfully', student: student });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

router.post('/student/applyForCertificate',auth, async (req, res) => {
  try {
    const {internshipId } = req.body;
    const studentId = req.user.userId;
    // Validate inputs (you can add more validation as needed)

    // Create new application for certificate
    const application = new ApplicationForCertificate({
      student: studentId,
      internship: internshipId
    });

    // Save the application to MongoDB
    const savedApplication = await application.save();

    res.status(201).json(savedApplication); // Return the saved application
  } catch (error) {
    console.error('Error applying for certificate:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});


router.get('/student/applyForCertificatestatus/:internshipId', auth, async (req, res) => {
  try {
    const { internshipId } = req.params;
    const studentId = req.user.userId;

    // Fetch application for certificate
    const application = await ApplicationForCertificate.findOne({
      student: studentId,
      internship: internshipId
    });

    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }

    res.status(200).json(application); // Return the application if found
  } catch (error) {
    console.error('Error fetching application for certificate:', error);
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
});

// Add more routes and functionality as needed

module.exports = router;
