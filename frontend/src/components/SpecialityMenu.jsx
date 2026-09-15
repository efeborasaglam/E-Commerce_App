import React from "react";
import { specialityData } from "../assets/assets.js";
import { Link } from "react-router-dom";

const SpecialityMenu = () => {
  return (
    <div
      className={"flex flex-col items-center gap-4 py-16 text-gray-800"}
      id={"speciality"}
    >
      <h1 className={"text-3xl font-medium"}>Shop by Category</h1>
      <p className={"sm:w-1/3 text-center text-sm"}>
        Browse our wide range of fitness products
      </p>
      <div
        className={"flex sm:justify-center gap-4 pt-5 w-full overflow-scroll"}
      >
        {specialityData.map((item, index) => (
          <Link
            className={
              "flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500"
            }
            key={index}
            to={`/products/${item.speciality}`}
            onClick={() => window.scrollTo(0, 0)}
          >
            <img
              className={
                "w-16 h-16 sm:w-24 sm:h-24 mb-2 p-3 rounded-full " +
                "bg-[#C8D7EB] object-contain"
              }
              src={item.image}
              alt={item.speciality}
            />
            <p>{item.speciality}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default SpecialityMenu;
