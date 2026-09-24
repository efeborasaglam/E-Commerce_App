import React from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <div>
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 pt-10 border-t-4 border-[#C6FF00] text-sm">
        {/* left */}
        <div>
          <img className="mb-5 w-40" src={assets.Efshop} alt="logo" />
          <p className="w-full md:w-2/3 text-gray-600 leading-6">
            We sell high-quality gym and fitness products for your workouts at
            home and in the gym. All items have been carefully tested and
            inspected before sale.
          </p>
        </div>
        {/* center */}
        <div>
          <p className="text-lg font-extrabold uppercase italic mb-5">
            Company
          </p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>
              <Link
                className="hover:text-[#8DB600] transition-colors"
                to="/"
                onClick={() => scrollTo(0, 0)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-[#8DB600] transition-colors"
                to="/about"
                onClick={() => scrollTo(0, 0)}
              >
                About Us
              </Link>
            </li>
            <li>
              <Link
                className="hover:text-[#8DB600] transition-colors"
                to="/contact"
                onClick={() => scrollTo(0, 0)}
              >
                Contact us
              </Link>
            </li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/* right */}
        <div>
          <p className="text-lg font-extrabold uppercase italic mb-5">
            Get in Touch
          </p>
          <ul className="flex flex-col gap-2 text-gray-600">
            <li>+41 78 730 46 45</li>
            <li>efebora.saglam@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        <hr />
        <p className="py-5 text-sm text-center text-gray-500">
          Copyright {new Date().getFullYear()} © efshop - All Rights Reserved.
        </p>
      </div>
    </div>
  );
};
export default Footer;
