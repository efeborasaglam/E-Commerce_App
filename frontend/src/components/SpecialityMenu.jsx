import React from "react";
import { specialityData } from "../assets/assets.js";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      className="flex flex-col items-center gap-4 py-16 text-gray-800"
      id="speciality"
    >
      <h1 className="text-3xl md:text-4xl font-extrabold uppercase italic">
        Shop by <span className="text-[#8DB600]">Category</span>
      </h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-500">
        Browse our wide range of fitness products
      </p>
      <div className="flex sm:justify-center gap-5 pt-5 w-full overflow-x-auto px-3">
        {specialityData.map((item, index) => (
          <Link
            className="group flex flex-col items-center text-xs font-semibold uppercase tracking-wide cursor-pointer flex-shrink-0"
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              className="w-16 h-16 sm:w-24 sm:h-24 mb-3 p-4 rounded-2xl bg-neutral-900 object-contain
                         group-hover:bg-[#C6FF00] group-hover:-translate-y-2 group-hover:shadow-lg transition-all duration-300"
              src={item.image}
              alt={item.speciality}
            />
            <p className="group-hover:text-[#8DB600] transition-colors">
              {item.speciality}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default SpecialityMenu;
