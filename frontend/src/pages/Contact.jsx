import React from "react";
import { assets } from "../assets/assets.js";

const Contact = () => {
  return (
    <div>
      <div className={"text-center text-2xl pt-10 text-gray-500"}>
        <p>
          CONTACT <span className={"text-gray-700 font-semibold"}>US</span>
        </p>
      </div>

      <div
        className={
          "my-10 flex flex-col justify-center md:flex-row gap-10 mb-28 text-sm"
        }
      >
        <img
          className={"w-full md:max-w-[360px]"}
          src={assets.contact_image}
          alt={"img"}
        />
        <div className={"flex flex-col justify-center items-start gap-6"}>
          <p className={"font-semibold text-lg text-gray-600"}>OUR OFFICE</p>
          <p className={"text-gray-600"}>
            9014 St. Gallen <br />
            Lehnstrasse 73
          </p>
          <p className={"text-gray-600"}>
            Tel: 078 730 46 45 <br />
            Email: efebora.saglam@hotmail.com
          </p>
          <p className={"font-semibold text-lg text-gray-600"}>
            CAREERS AT Efshop
          </p>
          <p className={"text-gray-500"}>
            Learn about our teams and job openings
          </p>
          <button
            className={
              "border border-black px-8 py-4 text-sm hover:bg-black hover:text-white transation-all duration-500"
            }
          >
            Explore Jobs
          </button>
        </div>
      </div>
    </div>
  );
};
export default Contact;
