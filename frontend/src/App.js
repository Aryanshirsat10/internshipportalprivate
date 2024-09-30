
import {React, useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import StudentDashboard from '../src/pages/Student/StudentDashboard';
import MyInternships from './pages/Student/MyInternship'
import Login from './pages/Login';
import FacultyDashboard from './pages/Faculty/FacultyDashboard';
import MyInternship from './pages/Faculty/MyInternships';
import InternshipDetail from './pages/Faculty/InternshipDetail';
import SInternshipDetails from './pages/Student/SInternshipDetails'
import FacultyProfile from './pages/Faculty/FacultyProfile';
import StudentProfile from './pages/Student/StudentProfile';
import { UserProvider } from './UserContext';
import Cookies from "js-cookie";
import FSetting from './pages/Faculty/FSetting';
import Settings from './pages/Student/Settings';
import Signup from './pages/Signup';
import Applyforcertificate from './pages/Student/Applyforcertificate';
import InternshipCoordinatorDashboard from './pages/InternshipCoordinator/InternshipCoordinatorDashboard';
import Applications from './pages/InternshipCoordinator/Applications';
import ApplicationDetail from './pages/InternshipCoordinator/ApplicationDetail';
import SuperAdminDasboard from './pages/SuperAdmin/SuperAdminDashboard';
import Reports from './pages/InternshipCoordinator/Reports';
import ManageUsers from './pages/SuperAdmin/ManageUsers';
import SuperReports from './pages/SuperAdmin/SuperReport';
function App() {
  // const [loggedIn, setLoggedIn] = useState(
  //   Cookies.get("sessionId") && Cookies.get("token") ? true : false
  // );
  // const [loginStatus, setLoginStatus] = useState(false);
  // const [checkLoginURL, setCheckLoginURL] = useState();
  // setCheckLoginURL(`http://localhost:5000/api/students/me`);
  // const checkLog = async () => {
  //   const response = await fetch(checkLoginURL, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       "x-auth-token": Cookies.get("token"), // Replace with the actual token
  //       "x-session-id": Cookies.get("sessionId"), // Replace with the actual session ID
  //     },
  //   });
  //   if (response.status === 404) {
  //     setLoggedIn(false);
  //   } else if (response.ok) {
  //     setLoggedIn(true);
  //     setLoginStatus(true);
  //   }
  // };

  // useEffect(() => {
  //   if (loggedIn && checkLoginURL) {
  //     checkLog();
  //     // checkSub();
  //   } else if (!loggedIn) {
  //     Cookies.remove("sessionId");
  //     Cookies.remove("token");
  //     Cookies.remove("role");
  //   }
  // }, [checkLoginURL]);

  return (
    <UserProvider>
    <Router>
      <Routes>
          <Route path="/" element={<Login />} />
          <Route path='/signup' element={<Signup/>}/>
          <Route path="/Student" element={<StudentDashboard />} />
          <Route path="/Student/myinternships" element={<MyInternships/>} />
          <Route path='/Student/applyforcertificate' element={<Applyforcertificate/>}/>
          <Route path='/Student/settings' element={<Settings/>}/>
          <Route path="/Student/internship" element={<SInternshipDetails />} />
          <Route path='/Student/profile' element={<StudentProfile/>}/>
          {/* Faculty routes */}
          <Route path='/Faculty' element={<FacultyDashboard/>}/>
          <Route path='/Faculty/myinternships' element={<MyInternship/>}/>
          <Route path="/Faculty/internship" element={<InternshipDetail />} />
          <Route path='/Faculty/profile' element={<FacultyProfile/>}/>
          <Route path='/Faculty/settings' element={<FSetting/>}/>
          {/*Internship Coordinator routes*/}
          <Route path='/InternshipCoordinator' element={<InternshipCoordinatorDashboard/>}/>
          <Route path='/InternshipCoordinator/applications' element={<Applications/>}/>
          <Route path='/InternshipCoordinator/applicationDetail' element={<ApplicationDetail/>}/>
          <Route path='/InternshipCoordinator/reports' element={<Reports/>}/>
          {/*Super admin routes*/}
          <Route path='/SuperAdmin' element={<SuperAdminDasboard />}/>
          <Route path='/SuperAdmin/manageUser' element={<ManageUsers />}/>
          <Route path='/SuperAdmin/reports' element={<SuperReports />}/>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </Router>
    </UserProvider>
  );
}

export default App;
