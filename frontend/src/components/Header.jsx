import React from "react";
import { assets } from "../assets/assets.js";

const Header = () => {
  return (
    <div className="relative overflow-hidden flex flex-col md:flex-row bg-neutral-950 rounded-2xl md:px-8 lg:px-16">
      {/* Glow-Effekt */}
      <div className="pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full bg-[#C6FF00]/20 blur-3xl" />

      {/* Left side */}
      <div className="relative md:w-1/2 flex flex-col items-start justify-center gap-5 py-12 px-6 md:px-0 md:py-[8vw]">
        <span className="rounded-full border border-[#C6FF00]/50 px-4 py-1 text-xs tracking-widest text-[#C6FF00] uppercase">
          Fitness Shop
        </span>
        <p className="text-4xl md:text-5xl lg:text-7xl font-extrabold italic uppercase leading-[0.95] text-white">
          New <span className="text-[#C6FF00]">Energy</span>
          <br />
          New <span className="text-[#C6FF00]">Products</span>
        </p>
        <p className="max-w-md text-sm md:text-base font-light text-gray-300">
          Simply browse through our extensive list of Fitness Products, get your
          item and start TRAINING.
        </p>
        <div className="flex items-center gap-4">
          <a
            href={"doctors"}
            className="flex items-center gap-2 rounded-full bg-[#C6FF00] px-8 py-3 text-sm font-bold uppercase tracking-wide text-black hover:scale-105 hover:shadow-[0_0_25px_rgba(198,255,0,0.5)] transition-all duration-300"
          >
            Shop Now
            <img src={assets.arrow_icon} className="w-3" alt="arrow" />
          </a>
          <a
            href="#speciality"
            className="text-sm text-white underline underline-offset-4 hover:text-[#C6FF00] transition-colors"
          >
            Categories
          </a>
        </div>
        <div className="flex items-center gap-3 pt-2">
          <img className="w-24" src={assets.group_profiles} alt="group" />
          <p className="text-xs text-gray-400">Join our training community</p>
        </div>
      </div>

      {/* Right side */}
      <div className="relative md:w-1/2">
        <img
          className="w-full md:absolute bottom-0 h-auto rounded-2xl"
          src={assets.header_image}
          alt="header"
        />
      </div>
    </div>
  );
};
export default Header;
