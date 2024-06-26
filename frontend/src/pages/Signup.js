import React, { useEffect } from 'react'
import { useState } from 'react'
import Cookies from "js-cookie";
import Checkbox from "../components/ui/Checkbox";
const Signup = () => {
  const [email ,setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const handleSubmit = async(e)=>{
    e.preventDefault();
      try {
        const response = await fetch("http://localhost:5000/api/students/signup",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name,email, password,department }),
        })
        if(response.ok){
          const data = await response.json();
          window.location.href = "/";
        }
        else{
          const error = await response.json();
          console.error(error.message);
        }
      } catch (error) {
        console.log(error);
      }
  }
  
    return (
      <div className='flex flex-col lg:flex-row w-screen h-[100vh] relative'>
      <div className='absolute top-0 flex w-full lg:w-1/5 h-14 bg-[#ed1c24]'></div>
      <div className='absolute top-0 right-0 flex w-full lg:w-4/5 h-14 bg-[#b7202e]'></div>
      <div className="hidden lg:block lg:w-3/5 h-full">
        <img src="/assets/login.png" alt="Login Image" className="w-full h-full object-cover" />
      </div>
      <div className="w-full lg:w-2/5 h-full flex items-center justify-center bg-white flex-col">
        <div className='flex w-[70%] flex-row px-10 justify-center gap-x-7 items-center'>
          <img src='/assets/somaiya-university-logo.svg' className='w-24 h-24 lg:w-36 lg:h-36' alt="Somaiya University Logo" />
          <img src='/assets/somaiya-vidyavihar-brand.svg' className='w-24 h-24 lg:w-36 lg:h-36' alt="Somaiya Vidyavihar Brand" />
        </div>
        <div className="relative w-full px-4 sm:px-8 lg:px-0 flex justify-center">
          <div id="form-container" className="bg-white p-5 sm:p-10 rounded-lg shadow-2xl w-full max-w-md relative z-10 transform transition duration-500 ease-in-out">
            <h2 id="form-title" className="text-center text-2xl lg:text-3xl font-bold mb-7 text-gray-800">Signup</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
            <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Name"
                id="name"
                type="text"
                value={name}
                required
                onChange={(e) => setName(e.target.value)}
              />
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Department"
                id="department"
                type="text"
                value={department}
                required
                onChange={(e) => setDepartment(e.target.value)}
              />
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Email"
                id="email"
                type="email"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                className="w-full h-12 border border-gray-800 px-3 rounded-lg"
                placeholder="Password"
                id="password"
                type="password"
                value={password}
                required
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember-me"
                    className="mr-2"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="remember-me" className="text-sm font-medium">Remember Me</label>
                </div>
                <a className="text-blue-500 hover:text-blue-800 text-sm" href="#">Forgot Password?</a>
              </div>
              <button
                className="w-full h-12 bg-[#58595b] hover:bg-[#b7202e] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    )
}


export default Signup