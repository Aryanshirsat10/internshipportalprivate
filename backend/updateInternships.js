const mongoose = require('mongoose');
const Internship = require('./models/Internship'); // Adjust the path to your model file

// Connect to your MongoDB database
mongoose.connect('', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const updateInternships = async () => {
  try {
    // Fetch all existing internships
    const internships = await Internship.find({});

    // Iterate over each internship and update it
    for (const internship of internships) {
      // Check if studentsworking is an array of ObjectIds, and not already in the new format
      if (Array.isArray(internship.studentsworking) && internship.studentsworking.length > 0 && mongoose.Types.ObjectId.isValid(internship.studentsworking[0])) {
        // Convert each ObjectId to the new structure
        internship.studentsworking = internship.studentsworking.map(studentId => ({
          studentId,
          status: 'incomplete', // Default status, adjust as needed
          credits: 0,           // Default credits, adjust as needed
          noofhours: 0          // Default hours, adjust as needed
        }));

        // Save the updated internship back to the database
        await internship.save();
      }
    }

    console.log('Internships updated successfully.');
  } catch (error) {
    console.error('Error updating internships:', error);
  } finally {
    // Close the database connection
    mongoose.connection.close();
  }
};

// Run the update function
updateInternships();
