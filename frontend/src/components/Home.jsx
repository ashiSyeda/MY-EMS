import React from 'react';
import { useNavigate } from 'react-router-dom';
import backgroundImage from '../assets/images/offic.jpg'; // Replace with your image

const Home = () => {
  const navigate = useNavigate();

  console.log('backgroundImage:', backgroundImage);

  return (
    <div 
      className="relative min-h-screen flex flex-col justify-center items-center bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Dark overlay for better contrast */} 
      {/* <div className="absolute inset-0 bg- bg-opacity-40"></div> */}

      {/* Debug image display */}
      <img src={backgroundImage} alt="background" className="hidden" />

      {/* Content */} 
      <div className="z-10 text-center p-8 max-w-md mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">Welcome to My App</h1>
        
        {/* Buttons - Both in Blue Variants */} 
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {/* Login Button (Primary Blue) */} 
          <button
            onClick={() => navigate('/login')}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Login
          </button>
          
          {/* Signup Button (Lighter Blue) */} 
          <button
            onClick={() => navigate('/signup')}
            className="px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-md transition-all hover:scale-105 active:scale-95"
          >
            Sign Up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;
