import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const Doctors = () => {
  const { speciality } = useParams();

  const { doctors, currencySymbol } = useContext(AppContext);
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);

  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  console.log(speciality);

  const categories = ["Supplements", "Gym Products", "Rest"];

  return (
    <div>
      <p className="text-gray-500">
        Browse through the Products by different categories.
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-6 mt-5">
        <button
          className={`py-1.5 px-4 border rounded-full text-sm transition-all sm:hidden ${showFilter ? "bg-neutral-950 text-[#C6FF00]" : ""}`}
          onClick={() => setShowFilter((prev) => !prev)}
        >
          Filters
        </button>

        <div
          className={`flex-col gap-3 text-sm ${showFilter ? "flex" : "hidden sm:flex"}`}
        >
          {categories.map((cat) => (
            <p
              key={cat}
              onClick={() =>
                speciality === cat
                  ? navigate("/doctors")
                  : navigate(`/doctors/${cat}`)
              }
              className={`w-[94vw] sm:w-auto pl-4 py-2 pr-16 rounded-full border font-semibold uppercase tracking-wide text-xs cursor-pointer transition-all duration-300 ${
                speciality === cat
                  ? "bg-[#C6FF00] border-[#C6FF00] text-black"
                  : "border-gray-300 text-gray-600 hover:border-neutral-950"
              }`}
            >
              {cat}
            </p>
          ))}
        </div>

        <div className="w-full grid grid-cols-auto gap-5 gap-y-8">
          {filterDoc.map((item, index) => (
            <div
              className="group relative rounded-2xl overflow-hidden cursor-pointer border border-gray-200 bg-white hover:-translate-y-2 hover:shadow-xl transition-all duration-500"
              key={index}
              onClick={() => navigate(`/appointment/${item._id}`)}
            >
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
                    {item.fees ? item.fees : ""} {currencySymbol}
                  </span>
                  <span className="rounded-full bg-neutral-900 px-4 py-1.5 text-xs font-semibold text-[#C6FF00] group-hover:bg-[#C6FF00] group-hover:text-black transition-colors">
                    View
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Doctors;
