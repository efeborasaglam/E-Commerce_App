import React from "react";
import { assets } from "../assets/assets.js";

const About = () => {
  return (
    <div>
      <div className={"text-center text-2xl pt-10 text-gray-5"}>
        <p>
          ABOUT <span className={"text-gray-700 font-medium"}>US</span>
        </p>
      </div>

      <div className={"my-10 flex flex-col md:flex-row gap-12"}>
        <img
          className={"w-full md:max-w-[360px]"}
          src={assets.about_image}
          alt={"img"}
        />
        <div
          className={
            "flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600"
          }
        >
          <p>
            We are a Switzerland-based fitness shop dedicated to bringing you high-quality gym and fitness products for every level of training. Our items are carefully sourced and each one is tested before it reaches our shelves, so you can trust what you're getting. From home workout essentials to gear for serious athletes, we've built our range around one simple goal: helping you train better, safer, and smarter.
          </p>
          <p>
            Since day one, we've focused on quality over quantity. Every product in our catalog goes through a testing process to make sure it holds up to real use, not just marketing claims. We believe fitness equipment should work as hard as you do, and we're not satisfied until it does.
          </p>
          <b className={"text-gray-800"}>Our Vision</b>
          <p>
            Our vision is to make reliable, tested fitness equipment accessible to everyone in Switzerland, whether you're just starting your fitness journey or training at a competitive level. We want to be the shop people trust when they need gear that actually performs.
          </p>
        </div>
      </div>
      <div className={"text-xl my-4"}>
        <p>
          WHY <span className={"text-gray-700 font-semibold"}>CHOSE US</span>
        </p>
      </div>
      <div className={"flex flex-col md:flex-row mb-20"}>
        <div
          className={
            "border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transation-all duration-300 text-gray-600 cursor-pointer"
          }
        >
          <b>EFFICIENCY:</b>
          <p>
            We keep our catalog focused and our process simple, so you can find what you need and get it delivered quickly, without wading through endless options.
          </p>
        </div>
        <div
          className={
            "border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transation-all duration-300 text-gray-600 cursor-pointer"
          }
        >
          <b>CONVIENCE:</b>
          <p>
            Shopping with us is straightforward from start to finish, with clear product information and a smooth ordering experience, all from wherever you are in Switzerland.
          </p>
        </div>
        <div
          className={
            "border px-10 md:px-16 py-8 sm:py-16 flex flex-col gap-5 text-[15px] hover:bg-primary hover:text-white transation-all duration-300 text-gray-600 cursor-pointer"
          }
        >
          <b>PERSONILATION</b>
          <p>
            We help you find the products that actually fit your training goals and experience level, rather than pushing a one-size-fits-all selection.
          </p>
        </div>
      </div>
    </div>
  );
};
export default About;
