import React from "react";
import { assets } from "../assets/assets.js";
import Efshop from "../assets/logo_efshop.png";

const Header = () => {
  return (
    <div
      className={
        "flex flex-col md:flex-row flex-wrap bg-primary rounded-lg md:px-8 lg:px-40"
      }
    >
      {/*    LEft side*/}
      <div
        className={
          "md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw]"
        }
      >
        <p
          className={
            "text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight lg:leading-tight"
          }
        >
            <span className={'text-black'}>NEW</span> ENERGY
          <br />
          NEW <span className={'text-black'}>PRODUCTS</span>
        </p>
        <div
          className={
            "flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light"
          }
        >
          <img className={"w-30"} src={assets.group_profiles} alt={"group"} />
          <p>
            Simply browse through our extensive list of Fitness Products,
            <br className={"hidden sm:block"} /> get your item and start TRAINING
          </p>
        </div>
        <a
          className={
            "flex items-center gap-2 bg-white px-8 py-3 rounded-full text-gray-600 text-sm m-auto md:m-0 hover:scale-105 transition-all duration-300"
          }
          href={"doctors"}
        >
          Look Into{" "}
          <img src={assets.arrow_icon} className={"w-3"} alt={"arrow"} />
        </a>
      </div>
      {/*    Right side*/}
      <div className={"md:w-1/2 relative"}>
        <img
          className={"w-full md:absolute bottom-0 h-auto rounded-lg"}
          src={assets.header_image}
          alt={"header"}
        />
      </div>
    </div>
  );
};
export default Header;
