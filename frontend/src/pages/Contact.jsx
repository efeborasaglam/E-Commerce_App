import React from "react";
import { assets } from "../assets/assets.js";

const Contact = () => {
  return (
    <div>
      <div className="text-center text-3xl pt-10 font-extrabold uppercase italic">
        <p>
          Contact <span className="text-[#8DB600]">Us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm">
        <img
          className="w-full md:max-w-[360px] rounded-2xl"
          src={assets.contact_image}
          alt="img"
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-extrabold uppercase italic text-lg text-gray-900">
            Our Office
          </p>
          <p className="text-gray-600">
            9014 St. Gallen <br />
            Lehnstrasse 73
          </p>
          <p className="text-gray-600">
            Tel: 078 730 46 45 <br />
            Email: efebora.saglam@hotmail.com
          </p>
          <p className="font-extrabold uppercase italic text-lg text-gray-900">
            Careers at Efshop
          </p>
          <p className="text-gray-500">
            Learn about our teams and job openings
          </p>
          <button className="rounded-full bg-neutral-950 px-8 py-3 text-xs font-bold uppercase tracking-wide text-[#C6FF00] hover:bg-[#C6FF00] hover:text-black transition-all duration-300">
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};
export default Contact;
