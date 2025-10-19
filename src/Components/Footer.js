import React from 'react';
import { Link } from 'react-router-dom';
import facebook from './Icons/facebook.png';
import instagram from './Icons/instagram.png';
import twitter from './Icons/twitter.png';
import youtube from './Icons/youtube.png';
import linkedin from './Icons/linkedin.png';
import gmail from './Icons/gmail.png';
import contact from './Icons/phone.png';

function Footer() {
  return (
    <footer className="bg-blue-900 text-white py-8">
      <div className="container mx-auto flex justify-between items-center">
        <div className="mx-auto text-left">
          <h4 className="text-lg font-bold mb-2">Contact Us</h4>
          <ul className="space-y-2">
            <li><img src={gmail} alt="Gmail" className="inline-block w-6 h-6" />  Email: priyabahuguna220@gmail.com</li>
            <li><Link to="https://www.linkedin.com/in/priya-bahuguna-942431256/" target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-400"><img src={linkedin} alt="LinkedIn" className="inline-block w-6 h-6" /></Link>  LinkedIn</li>
            <li><Link to=" https://x.com/PriyaBahuguna18" target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-400"><img src={twitter} alt="Twitter" className="inline-block w-6 h-6" /></Link> Twitter</li>
            <li><img src={contact} alt="Contact" className='inline-block w-6 h-6'/>  Mobile Number: 9837902661</li>
          </ul>
        </div>
        <div className="text-left mx-auto my-auto">
          <h4 className="text-lg font-bold mb-2">Follow Us</h4>
          <ul className="space-y-2 space-x-3">
            <Link to="//" target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-400"><img src={facebook} alt="Facebook" className="inline-block w-6 h-6" /></Link>
            <Link to="https://www.instagram.com/_priyaa___16/" target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-400"><img src={instagram} alt="Instagram" className="inline-block w-6 h-6" /></Link>
            <Link to="//" target="_blank" rel="noreferrer" className="text-blue-300 hover:text-blue-400"><img src={youtube} alt="YouTube" className="inline-block w-6 h-6" /></Link></ul>
        </div>
      </div>
      <div className="container mx-auto mt-4 text-center">
        <p>&copy; {new Date().getFullYear()} BidMaster. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
