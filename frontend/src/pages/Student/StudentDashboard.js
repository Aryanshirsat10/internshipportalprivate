import {React , useState,useEffect} from 'react'
import Sidebar from '../../components/Sidebar'
import FilterDropdown from '../../components/FilterDropdown';
import InternshipCard from '../../components/InternshipsCard';
import { useUser } from '../../UserContext';
import Topsidebar from '../../components/Topsidebar';
import Cookies from 'js-cookie';

// Skeleton loader component
const SkeletonLoader = () => (
  <div className="animate-pulse flex space-x-4">
    <div className="rounded-lg bg-gray-300 h-40 w-80"></div> {/* Placeholder for image */}
    <div className="flex-1 space-y-4 py-1">
      <div className="h-4 bg-gray-300 rounded w-3/4"></div> {/* Placeholder for title */}
      <div className="h-4 bg-gray-300 rounded"></div> {/* Placeholder for company */}
      <div className="h-4 bg-gray-300 rounded w-1/2"></div> {/* Placeholder for location */}
      <div className="flex space-x-4">
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for start date */}
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for duration */}
        <div className="h-4 bg-gray-300 rounded w-1/4"></div> {/* Placeholder for apply by */}
      </div>
    </div>
  </div>
);


const StudentDashboard = () => {
  const {setUser} = useUser();
  const [existingData, setExistingData] = useState([]);
  const [studentName, setStudentName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [filterCriteria, setFilterCriteria] = useState({
    title: '',
    startDate: '',
    duration: '',
    location: '',
  });
  useEffect(()=>{
    const userData = 'student';
    setUser(userData);
  },[])

  useEffect(() => {
    // Fetch existing data from the database when the component mounts
    const fetchExistingData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/getInternship', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await response.json();
        console.log(data);
        setExistingData(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching existing data:', error);
        setIsLoading(false);
      }
    };

    fetchExistingData();
  }, []);
  useEffect(()=>{
    const fetchstudentdetails=async()=>{
      try {
        const response = await fetch('http://localhost:5000/api/students/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': Cookies.get('token'),
            'x-session-id': Cookies.get('sessionId'),
          },
        });
        const data = await response.json();
        // console.log(data);
        const firstName = data.name?.split(' ')[0]; 
        // console.log(firstName);
          setStudentName(firstName);
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
    }
    fetchstudentdetails();
    },[])
  // const handleFilterChange = (field, value) => {
  //   setFilterCriteria({ ...filterCriteria, [field]: value });
  // };
  
  const uniqueTitles = Array.from(new Set(existingData.map((internship) => internship.title)));
  const uniqueStartDates = Array.from(new Set(existingData.map((internship) => internship.startDate)));
  const uniqueLocations = Array.from(new Set(existingData.map((internship) => internship.location)));

  return (
    <div className='min-[990px]:flex w-screen h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <Sidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <Topsidebar/>
      </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto overscroll-x-none h-full'>
        <h1 className="flex flex-col text-3xl font-bold items-start">Welcome back {studentName}</h1>
        {isLoading ? (
          // Display skeleton loader while loading
          <>
            <SkeletonLoader />
            <SkeletonLoader />
            <SkeletonLoader />
          </>
        ) : (
        <div>
        <div className='flex flex-row pt-5 justify-between lg:w-[95%] w-[95%]'>
          <h2 className='text-xl font-semibold text-slate-600'>
            "{filterCriteria != null  ? `${filterCriteria.title || filterCriteria.startDate || filterCriteria.location || "All"}` : "All"}" Internships
          </h2>
          <div className='flex'>
              {/* Updated FilterDropdown with a button */}
              <FilterDropdown
                filterCriteria={filterCriteria}
                options={{
                  title: uniqueTitles,
                  startDate: uniqueStartDates,
                  location: uniqueLocations,
                }}
                onChange={(values) => setFilterCriteria(values)}
              />
            </div>
        </div>
        
        <div className='flex flex-row flex-wrap '>
          {/* Map through existingData and render InternshipCard for each internship */}
          {existingData
              .filter((internship) => {
                return (
                  (filterCriteria.title === '' || internship.title.includes(filterCriteria.title)) &&
                  (filterCriteria.startDate === '' || internship.startDate.includes(filterCriteria.startDate)) &&
                  (filterCriteria.location === '' || internship.location.includes(filterCriteria.location))
                );
              })
              .map((internship) => (
                <InternshipCard key={internship._id} internship={internship} />
              ))}
        </div>
        </div>
      )}
      </div>
    </div>
  )
}

export default StudentDashboard