import React from "react";
import { assets } from "../assets/assets.js";

const Footer = () => {
  return (
    <div>
      <div
        className={
          "flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10  mt-40 text-sm"
        }
      >
        {/*    left*/}
        <div>
          <img className={"mb-5 w-40"} src={assets.Efshop} alt={"logo"} />
          <p className={"w-full md:w-2/3 text-gray-600 leading-6"}>
            We sell high-quality gym and fitness products for your workouts at home and in the gym.
            All items have been carefully tested and inspected before sale.
          </p>
        </div>
        {/*    center*/}
        <div>
          <p className={"text-xl font-medium mb-5"}>COMPANY</p>
          <ul className={"flex flex-col gap-2 text-gray-600"}>
            <li>Home</li>
            <li>About Us</li>
            <li>Contact us</li>
            <li>Privacy Policy</li>
          </ul>
        </div>
        {/*    right*/}
        <div>
          <p className={"text-xl font-medium mb-5"}>Get in Touch</p>
          <ul className={"flex flex-col gap-2 text-gray-600"}>
            <li>+41 78 730 46 45</li>
            <li>efebora.saglam@gmail.com</li>
          </ul>
        </div>
      </div>
      <div>
        {/*  copy right  */}
        <hr />
        <p className={"py-5 text-sm text-center text-gray-500"}>
          Copyright 2026@ efshop - All Right Reserved.
        </p>
      </div>
    </div>
  );
};
export default Footer;
