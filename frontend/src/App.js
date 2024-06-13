
import './App.css';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StudentDashboard from '../src/pages/Student/StudentDashboard';
import MyInternships from './pages/Student/MyInternship'
import Explore from './pages/Student/Explore';
import Login from './pages/Login';
import Setting from './pages/Student/Setting';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import MyInternship from './pages/Faculty/MyInternships';
import InternshipDetail from './pages/Faculty/InternshipDetail';
import FacultyProfile from './pages/Faculty/FacultyProfile';
import StudentProfile from './pages/Student/StudentProfile';
import { UserProvider } from './UserContext';
function App() {
  return (
    <UserProvider>
    <Router>
      <Routes>
          <Route path="/" element={<Login />} />        
          <Route path="/Student" element={<StudentDashboard />} />
          <Route path="/Student/myinternships" element={<MyInternships/>} />
          <Route path='/Student/explore' element={<Explore/>}/>
          <Route path='/Student/setting' element={<Setting/>}/>
          <Route path="/Student/internship" element={<InternshipDetail />} />
          <Route path='/Student/profile' element={<StudentProfile/>}/>
          {/* Faculty routes */}
          <Route path='/Faculty' element={<FacultyDashboard/>}/>
          <Route path='/Faculty/myinternships' element={<MyInternship/>}/>
          <Route path="/Faculty/internship" element={<InternshipDetail />} />
          <Route path='/Faculty/profile' element={<FacultyProfile/>}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
