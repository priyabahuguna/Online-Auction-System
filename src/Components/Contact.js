import React from 'react';

function Contact() {
  return (
    <div className="container mx-auto mt-24 max-w-4xl p-4">
      <h1 className="text-5xl font-extrabold text-gray-800 mb-12 text-center">Feel Free to Contact Us</h1>
      
      <div className="bg-white rounded-lg p-6 mb-8 shadow-md hover:shadow-2xl transition-shadow duration-300">
        <div className="mb-4">
          <h4 className="text-2xl font-semibold text-gray-700 mb-1">Email:</h4>
          <p className="text-lg text-gray-600">priyabahuguna220@gmail.com</p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-8 shadow-md hover:shadow-2xl transition-shadow duration-300">
        <div className="mb-4">
          <h4 className="text-2xl font-semibold text-gray-700 mb-1">LinkedIn Handle:</h4>
          <p className="text-lg text-gray-600">
            <a href="https://www.linkedin.com/in/priya-bahuguna-942431256/" 
               rel="noreferrer" 
               target="_blank" 
               className="text-blue-500 no-underline hover:underline transition-colors duration-300">
              https://www.linkedin.com/in/priya-bahuguna-942431256/
            </a>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-8 shadow-md hover:shadow-2xl transition-shadow duration-300">
        <div className="mb-4">
          <h4 className="text-2xl font-semibold text-gray-700 mb-1">Twitter Handle:</h4>
          <p className="text-lg text-gray-600">
            <a href=" https://x.com/PriyaBahuguna18" 
               rel="noreferrer" 
               target="_blank" 
               className="text-blue-500 no-underline hover:underline transition-colors duration-300">
               https://x.com/PriyaBahuguna18
            </a>
          </p>
        </div>
      </div>

      <div className="bg-white rounded-lg p-6 mb-8 shadow-md hover:shadow-2xl transition-shadow duration-300">
        <div className="mb-4">
          <h4 className="text-2xl font-semibold text-gray-700 mb-1">Mobile Number:</h4>
          <p className="text-lg text-gray-600">8193911254</p>
        </div>
      </div>

      <div className="bg-blue-50 max-w-md mx-auto rounded-lg p-8 text-center shadow-md mt-8">
        <h5 className="text-lg text-blue-800 mb-4">For any queries, kindly email us at our provided email id.</h5>
        <h5 className="text-lg text-blue-800">Thank you for visiting us!</h5>
      </div>
      
      <div className="h-5"></div>
    </div>
  );
}

export default Contact;
