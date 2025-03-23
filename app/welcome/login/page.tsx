'use client';

import React from 'react';

const WelcomeLoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="max-w-4xl w-full bg-white p-8 rounded-lg shadow-md flex">
        <div className="w-1/2 p-8">
        <button className="gsi-material-button" style={{ width: '371px' }}>
          <div className="gsi-material-button-state"></div>
          <div className="gsi-material-button-content-wrapper">
            <div className="gsi-material-button-icon">
              <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: 'block' }}>
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
                <path fill="none" d="M0 0h48v48H0z"></path>
              </svg>
            </div>
            <span className="gsi-material-button-contents">Sign in with Google</span>
            <span style={{ display: 'none' }}>Sign in with Google</span>
          </div>
        </button>          
        <div className="relative mb-4">
            <input
              type="email"
              placeholder="Enter your work email address"
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
            />
            <button className="mt-2 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
              Continue
            </button>
          </div>
        </div>
        <div className="w-1/2 p-8 bg-gray-50 rounded-lg">
          <h2 className="text-3xl font-extrabold text-gray-900">Welcome to Marin Jobs</h2>
          <p className="mt-4 text-gray-600">
            Find a job in Marin County.  Marin Jobs is your place to find jobs throughout Marin County. 
          </p>
          <p className="mt-4 text-gray-600">
            Local jobs, remote jobs, and everything in between. 
          </p>
          <p className="mt-4 text-gray-600">Let's begin.</p>
        </div>
      </div>
    </div>
  );
};

export default WelcomeLoginPage;