
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import StudentDashboard from '../src/pages/Student/StudentDashboard';
import MyInternships from './pages/Student/MyInternship'
import Explore from './pages/Student/Explore';
function App() {
  return (
    <Router>
      <Routes>
          <Route path="/Student" element={<StudentDashboard />} />
          <Route path="/Student/myinternships" element={<MyInternships/>} />
          <Route path='/Student/explore' element={<Explore/>}/>
          {/* <Route path="/expense" element={<Expense />} />
          <Route path="/investments" element={<Investments />} />
          <Route path="/savings" element={<Savings />} /> */}
        </Routes>
    </Router>
    
  );
}

export default App;
