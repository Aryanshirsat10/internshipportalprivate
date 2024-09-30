const express = require('express');
const router = express.Router();
const xlsx = require('xlsx');
const Internship = require('../models/Internship');
const facultyauth = require('../middleware/facultyauth');
const auth = require('../middleware/auth');
const ApplicationForCertificate = require('../models/applicationforcertificate');
const fs = require('fs');
const Certificate = require('../models/certificateModel');
const path = require('path');
const Student = require('../models/Students');
const PDFDocument = require('pdfkit');

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

router.post('/getsingleinternship',facultyauth,async(req,res)=>{
  try {
    const {internshipId} = req.body;
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

//download certificate for student route
router.post('/downloadcertificate', auth, async (req, res) => {
  const { studentId,internshipId} = req.body;
  // console.log(req.body);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();  
  
  
    return `${day}/${month}/${year}`; 
  
  }
  try {
    const certificate = await Certificate.findOne({ studentId });

    if (!certificate) {
      return res.status(404).send('Certificate not found');
    }
    const { studentName, facultyName, startDate, endDate, internshipTitle } = certificate;
  
    const formattedStartDate = formatDate(startDate);
    const formattedEndDate = formatDate(endDate);
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${studentName}_${internshipTitle}_certificate.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Load the certificate template
    const templatePath = path.join(__dirname, '../certificate_format_1.png');
    doc.image(templatePath, 0, 0, {width: doc.page.width, height: doc.page.height});

    // Set font and color
    doc.font('Times-Roman')
       .fontSize(24)
       .fillColor('#800000');  // Maroon color

    // Add text to the PDF
    const yOffset = 315;  // Adjust this value to match your template
    doc.text(studentName, 200, doc.page.height - yOffset);
    doc.text(facultyName, 160, doc.page.height - (yOffset - 60));
    doc.text(formattedStartDate, 300, doc.page.height - (yOffset - 90));
    doc.text(formattedEndDate, 550, doc.page.height - (yOffset - 90));
    doc.text(internshipTitle, 260, doc.page.height - (yOffset - 125));
    doc.text(certificate._id, 320, doc.page.height - (yOffset - 160));

    // Finalize the PDF and end the stream
    doc.font('Times-Bold')
      .fontSize(20).fillColor('#b7202e')
      .text(certificate.icKjsceInternshipCell,100,doc.page.height - (yOffset - 210));
    doc.on('end', () => {
    console.log('PDF generation completed');
  });
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).send('Error generating PDF');
  }
});
//generate certificate
router.post('/generate-certificate', facultyauth, async (req, res) => {
  const { name,studentId, facultyName, startDate, endDate, title,internshipId,icKjsceInternshipCell} = req.body;
  // console.log(req.body);

  function formatDate(isoString) {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();  
  
  
    return `${day}/${month}/${year}`; 
  
  }
  
  const formattedStartDate = formatDate(startDate);
  const formattedEndDate = formatDate(endDate);

  try {
    const existingCertificate = await Certificate.findOne({ studentId, internshipTitle: title });
    if (existingCertificate) {
      return res.status(401).send('Certificate already generated for this student and internship');
    }

    const newCertificate = await Certificate.create({
      studentName: name,
      studentId,
      facultyName,
      startDate,
      endDate,
      internshipTitle: title,
      icKjsceInternshipCell,
    });
    console.log("certificate data successfully entered");
    //updating application status;
    const updatedApplication = await ApplicationForCertificate.findOneAndUpdate(
      { internship: internshipId, student: studentId },
      { certificateIssued: 'yes' }, 
      { new: true } 
    );

    if (updatedApplication) {
      console.log('Application status updated:', updatedApplication);
    } else {
      console.log('Application not found');
    }
    // Create a new PDF document
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape'
    });

    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=${name}_certificate.pdf`);

    // Pipe the PDF document to the response
    doc.pipe(res);

    // Load the certificate template
    const templatePath = path.join(__dirname, '../certificate_format_1.png');
    doc.image(templatePath, 0, 0, {width: doc.page.width, height: doc.page.height});

    // Set font and color
    doc.font('Times-Roman')
       .fontSize(24)
       .fillColor('#800000');  // Maroon color

    // Add text to the PDF
    const yOffset = 315;  // Adjust this value to match your template
    doc.text(name, 200, doc.page.height - yOffset);
    doc.text(facultyName, 160, doc.page.height - (yOffset - 60));
    doc.text(formattedStartDate, 300, doc.page.height - (yOffset - 90));
    doc.text(formattedEndDate, 550, doc.page.height - (yOffset - 90));
    doc.text(title, 260, doc.page.height - (yOffset - 125));

    // Finalize the PDF and end the stream
    doc.on('end', () => {
    console.log('PDF generation completed');
  });
    doc.end();

  } catch (error) {
    console.error('Error generating PDF:', error.message);
    res.status(500).send('Error generating PDF');
  }
});

router.post('/download-report', async (req, res) => {
  try {
    const { startDate, endDate, selectedColumns } = req.body;
    console.log(req.body);

    // Define filters for date range
    const dateFilter = {};
  if (startDate || endDate) {
    dateFilter.$or = [];
    
    if (startDate && endDate) {
      // Internships that start, end, or span within the range
      dateFilter.$or.push(
        { startDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { endDate: { $gte: new Date(startDate), $lte: new Date(endDate) } },
        { $and: [{ startDate: { $lte: new Date(startDate) } }, { endDate: { $gte: new Date(endDate) } }] }
      );
    } else if (startDate) {
      // Internships that start after or end after the start date
      dateFilter.$or.push(
        { startDate: { $gte: new Date(startDate) } },
        { endDate: { $gte: new Date(startDate) } }
      );
    } else if (endDate) {
      // Internships that start before or end before the end date
      dateFilter.$or.push(
        { startDate: { $lte: new Date(endDate) } },
        { endDate: { $lte: new Date(endDate) } }
      );
    }
  }

    // Fetch internships data filtered by date range
    const internships = await Internship.find(dateFilter)
      .populate('postedby') // Populate mentor details from faculties model
      .populate({
        path: 'studentsworking.studentId',
        model: Student
      }).exec();
      if (!internships) {
        throw new Error('No internships found');
      }     
    console.log(internships);
    // Prepare the headers dynamically based on selected columns
    const allColumns = {
      'Project Title': 'Project Title',
      'Mentor Name': 'Mentor Name',
      'Mentor Email': 'Mentor Email',
      'Name of Students': 'Name of Students',
      'Branch': 'Branch',
      'Class': 'Class',
      'Student Email': 'Student Email',
      'Mobile No': 'Mobile No',
      'Status': 'Status',
      'Duration in hrs': 'Duration in hrs',
      'Starting Date': 'Starting Date',
      'Completion Date': 'Completion Date',
      'Remark': 'Remark'
    };

    // Filter columns based on selectedColumns
    const headers = selectedColumns.map(col => allColumns[col]);

    const data = [];
    data.push(headers); // Push selected headers

    // Iterate over each internship
    for (const internship of internships) {
      const mentor = internship.postedby; // Mentor details from faculties model

      for (const studentData of internship.studentsworking) {
        const student = studentData.studentId; // Student details

        const row = [];

        // Build row dynamically based on selected columns
        if (selectedColumns.includes('Project Title')) row.push(internship.title);
        if (selectedColumns.includes('Mentor Name')) row.push(mentor.name);
        if (selectedColumns.includes('Mentor Email')) row.push(mentor.emailId);
        if (selectedColumns.includes('Name of Students')) row.push(student.name);
        if (selectedColumns.includes('Branch')) row.push(student.department);
        if (selectedColumns.includes('Class')) row.push(student.class);
        if (selectedColumns.includes('Student Email')) row.push(student.email);
        if (selectedColumns.includes('Mobile No')) row.push(student.mobile);
        if (selectedColumns.includes('Status')) row.push(studentData.status);
        if (selectedColumns.includes('Duration in hrs')) row.push(studentData.noofhours);
        if (selectedColumns.includes('Starting Date')) row.push(internship.startDate.toLocaleDateString());
        if (selectedColumns.includes('Completion Date')) row.push(internship.endDate.toLocaleDateString());
        if (selectedColumns.includes('Remark')) row.push(internship.remark || '');

        data.push(row); // Push row data
      }
    }

    // Create a new workbook and add the data
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.aoa_to_sheet(data);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Reports');

    // Create a buffer and send the file
    const buffer = xlsx.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    res.setHeader('Content-Disposition', 'attachment; filename="reports.xlsx"');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.send(buffer);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).send('Error generating report');
  }
});


module.exports = router;
