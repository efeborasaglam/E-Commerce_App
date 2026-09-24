import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const TopDoctors = () => {
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-900 md:mx-10">
      <h1 className="text-3xl md:text-4xl font-extrabold uppercase italic">
        Top Products <span className="text-[#8DB600]">to Buy</span>
      </h1>
      <p className="sm:w-1/3 text-center text-sm text-gray-500">
        Simply browse through our extensive list of Fitness Products.
      </p>
      <div className="w-full grid grid-cols-auto gap-5 pt-5 gap-y-8 px-3 sm:px-0">
        {doctors.slice(0, 10).map((item, index) => (
          <div
            className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 bg-white
                       hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
            key={index}
            onClick={() => {
              navigate(`/appointment/${item._id}`);
              scrollTo(0, 0);
            }}
          >
            {/* Status-Badge */}
            <span
              className={`absolute top-3 left-3 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wide ${
                item.available
                  ? "bg-[#C6FF00] text-black"
                  : "bg-gray-800 text-gray-300"
              }`}
            >
              {item.available ? "In Stock" : "Sold Out"}
            </span>

            <div className="overflow-hidden bg-neutral-100">
              <img
                className="w-full group-hover:scale-110 transition-transform duration-500"
                src={item.image}
                alt={item.name}
              />
            </div>

            <div className="p-4">
              <p className="text-[11px] uppercase tracking-widest text-gray-400">
                {item.speciality}
              </p>
              <p className="mt-1 text-gray-900 text-lg font-semibold">
                {item.name}
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-900">
                  {item.fees ? `${item.fees}` : ""}
                </span>
                <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-[#C6FF00] group-hover:bg-[#C6FF00] group-hover:text-black transition-colors">
                  View
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="mt-10 rounded-full bg-neutral-900 px-12 py-3 text-sm font-bold uppercase tracking-wide text-white hover:bg-[#C6FF00] hover:text-black transition-all duration-300"
      >
        Show all products
      </button>
    </div>
  );
};
export default TopDoctors;
