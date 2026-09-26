import React from "react";
import Header from "../components/Header.jsx";
import SpecialityMenu from "../components/SpecialityMenu.jsx";
import TopDoctors from "../components/TopDoctors.jsx";
import Banner from "../components/Banner.jsx";

const perks = [
  { icon: "💪", title: "Tested Quality", text: "Only products we trust" },
  { icon: "🚚", title: "Fast Delivery", text: "Straight to your door" },
  { icon: "🔒", title: "Secure Checkout", text: "Safe payment options" },
  { icon: "🔥", title: "Made to Perform", text: "Gear for every goal" },
];

const Home = () => {
  return (
    <div>
      <Header />
      {/* Perks-Leiste */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-8 md:mx-10 px-3 sm:px-0">
        {perks.map((p) => (
          <div
            key={p.title}
            className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white p-4"
          >
            <span className="text-2xl">{p.icon}</span>
            <div>
              <p className="text-sm font-semibold text-gray-900">{p.title}</p>
              <p className="text-xs text-gray-500">{p.text}</p>
            </div>
          </div>
        ))}
      </div>
      <SpecialityMenu />
      <TopDoctors />
      <Banner />
    </div>
  );
};
export default Home;
