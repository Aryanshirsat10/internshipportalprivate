import {React , useState,useEffect} from 'react'
import Sidebar from '../../components/Sidebar'
import FilterDropdown from '../../components/FilterDropdown';
import { MdOutlineLocationOn } from "react-icons/md";
import FacultySidebar from '../../components/FacultySidebar';
import InternshipCard from '../../components/InternshipsCard';
import { useUser } from '../../UserContext';
import TopfacultySidebar from '../../components/TopfacultySidebar';
const FacultyDashboard = () => {
  const {setUser} = useUser();
  const [existingData, setExistingData] = useState([]);
  const [filterCriteria, setFilterCriteria] = useState({
    title: '',
    startDate: '',
    duration: '',
    location: '',
  });

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
      } catch (error) {
        console.error('Error fetching existing data:', error);
      }
    };

    fetchExistingData();
  }, []);

  useEffect(()=>{
    const userData = 'Faculty';
    setUser(userData);
  },[])
  // const handleFilterChange = (field, value) => {
  //   setFilterCriteria({ ...filterCriteria, [field]: value });
  // };
  
  const uniqueTitles = Array.from(new Set(existingData.map((internship) => internship.title)));
  const uniqueStartDates = Array.from(new Set(existingData.map((internship) => internship.startDate)));
  // const uniqueDurations = Array.from(new Set(existingData.map((internship) => internship.duration)));
  const uniqueLocations = Array.from(new Set(existingData.map((internship) => internship.location)));

  return (
    <div className='min-[990px]:flex w-full h-screen'>
      <div className='min-[990px]:flex min-[990px]:flex-col bg-red-50 p-5 w-[20%] hidden'>
        <FacultySidebar/>
      </div>
      <div className='flex flex-col bg-red-50 h-fit min-[990px]:p-5 p-2 min-[990px]:hidden items-center'>
      <h3 className='text-xl font-semibold'>Internship Portal</h3>
      <div className='overflow-x-scroll w-screen pt-5'>
        <TopfacultySidebar/>
      </div>
      </div>
      <div className='rounded-lg bg-slate-100 min-[990px]:w-[80%] p-5 overflow-y-auto h-full'>
        <h1 className="flex flex-col text-3xl font-bold items-start">Welcome back</h1>
        <div>
        <div className='flex flex-row pt-5 justify-between lg:w-[95%] w-[95%]'>
          <h2 className='text-xl font-semibold text-slate-600'>
            "{filterCriteria != null  ? `${filterCriteria.title || filterCriteria.startDate || filterCriteria.location || "All"}` : "All"}" Internships
          </h2>
          <div className='flex '>
              {/* Updated FilterDropdown with a button */}
              <FilterDropdown
                filterCriteria={filterCriteria}
                options={{
                  title: uniqueTitles,
                  startDate: uniqueStartDates,
                  // duration: uniqueDurations,
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
                  (filterCriteria.duration === '' || internship.duration.includes(filterCriteria.duration)) &&
                  (filterCriteria.location === '' || internship.location.includes(filterCriteria.location))
                );
              })
              .map((internship) => (
                <InternshipCard key={internship._id} internship={internship} />
              ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default FacultyDashboard