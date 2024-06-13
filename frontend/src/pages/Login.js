import React, { useEffect } from 'react'
import { useState } from 'react'
import Cookies from "js-cookie";
import Checkbox from "../components/ui/Checkbox";
const Login = () => {
  const [emailId ,setEmailId] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [role, setRole] = useState('');
  const handleSubmit = async(e)=>{
    e.preventDefault();
    if(role == "Faculty"){
      try {
        const response = await fetch("http://localhost:5000/api/faculty/login",{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ emailId, password }),
        })
        if(response.ok){
          const data = await response.json();
          const token = data["x-auth-token"];
          const sessionId = data["x-session-id"];
  
          Cookies.set("token", token, { expires: 365 }); // Token expires after 365 days
          // If the user opts to be remembered, store the token persistently
          if (rememberMe) {
            Cookies.set("sessionId", sessionId, { expires: 30 });
          } else {
            Cookies.set("sessionId", sessionId, { expires: 3 / 24 }); // Session ID expires after 3 hour
          }
          window.location.href = "/Faculty";
        }
        else{
          const error = await response.json();
          console.error(error.message);
        }
      } catch (error) {
        console.log(error);
      }
    }
  }
  
    return (
        <div className='flex w-full h-[100vh] justify-center items-center'>
        <div className="h-96 flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
        <div className="relative">
          <div className="absolute -top-2 -left-2 -right-2 -bottom-2 rounded-lg bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 shadow-lg animate-pulse"></div>
          <div id="form-container" className="bg-white p-16 rounded-lg shadow-2xl w-80 relative z-10 transform transition duration-500 ease-in-out">
            <h2 id="form-title" className="text-center text-3xl font-bold mb-10 text-gray-800">Login</h2>
            <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="flex flex-col justify-center items-center space-x-2">
          <label className="text-sm font-medium">Role</label>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <input
                className="h-4 w-4"
                id="student"
                name="role"
                type="radio"
                value="student"
                checked={role === "student"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="text-sm font-medium" htmlFor="student">
                Student
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                className="h-4 w-4"
                id="Faculty"
                name="role"
                type="radio"
                value="Faculty"
                checked={role === "Faculty"}
                onChange={(e) => setRole(e.target.value)}
              />
              <label className="text-sm font-medium" htmlFor="Faculty">
                Faculty
              </label>
            </div>
          </div>
        </div>
              <input className="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Email" id="email" name="" type="text" value={emailId} 
              required
              onChange={(e)=> setEmailId(e.target.value)}
              />
              <input className="w-full h-12 border border-gray-800 px-3 rounded-lg" placeholder="Password" id="password" name="" type="password" value={password}
              required
              onChange={(e)=> setPassword(e.target.value)}/>
              <button className="w-full h-12 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Sign in</button>
              <div className="flex items-center justify-center">
                <Checkbox
                  id="remember-me"
                  label="Keep me signed in with this device"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
              </div>
              <a className="text-blue-500 hover:text-blue-800 text-sm" href="#">Forgot Password?</a>
            </form>
          </div>
        </div>
      </div>  
    </div>
    )
}


export default Login