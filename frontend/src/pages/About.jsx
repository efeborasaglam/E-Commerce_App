import React from "react";
import { assets } from "../assets/assets.js";

const About = () => {
  const cards = [
    [
      "EFFICIENCY",
      "We keep our catalog focused and our process simple, so you can find what you need and get it delivered quickly, without wading through endless options.",
    ],
    [
      "CONVENIENCE",
      "Shopping with us is straightforward from start to finish, with clear product information and a smooth ordering experience, all from wherever you are in Switzerland.",
    ],
    [
      "PERSONALIZATION",
      "We help you find the products that actually fit your training goals and experience level, rather than pushing a one-size-fits-all selection.",
    ],
  ];

  return (
    <div>
      <div className="text-center text-3xl pt-10 font-extrabold uppercase italic">
        <p>
          About <span className="text-[#8DB600]">Us</span>
        </p>
      </div>

      <div className="my-10 flex flex-col md:flex-row gap-12">
        <img
          className="w-full md:max-w-[360px] rounded-2xl"
          src={assets.about_image}
          alt="img"
        />
        <div className="flex flex-col justify-center gap-6 md:w-2/4 text-sm text-gray-600 leading-relaxed">
          <p>
            We are a Switzerland-based fitness shop dedicated to bringing you
            high-quality gym and fitness products for every level of training.
            Our items are carefully sourced and each one is tested before it
            reaches our shelves, so you can trust what you're getting. From home
            workout essentials to gear for serious athletes, we've built our
            range around one simple goal: helping you train better, safer, and
            smarter.
          </p>
          <p>
            Since day one, we've focused on quality over quantity. Every product
            in our catalog goes through a testing process to make sure it holds
            up to real use, not just marketing claims. We believe fitness
            equipment should work as hard as you do, and we're not satisfied
            until it does.
          </p>
          <b className="text-gray-900 uppercase tracking-wide">Our Vision</b>
          <p>
            Our vision is to make reliable, tested fitness equipment accessible
            to everyone in Switzerland, whether you're just starting your
            fitness journey or training at a competitive level. We want to be
            the shop people trust when they need gear that actually performs.
          </p>
        </div>
      </div>

      <div className="text-2xl my-6 font-extrabold uppercase italic">
        <p>
          Why <span className="text-[#8DB600]">Choose Us</span>
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-4 mb-20">
        {cards.map(([title, text]) => (
          <div
            key={title}
            className="flex-1 rounded-2xl border border-gray-200 px-10 md:px-12 py-8 sm:py-14 flex flex-col gap-5 text-[15px] text-gray-600 cursor-pointer
                       hover:bg-neutral-950 hover:text-gray-300 hover:-translate-y-1 transition-all duration-300 group"
          >
            <b className="uppercase tracking-wide text-gray-900 group-hover:text-[#C6FF00] transition-colors">
              {title}
            </b>
            <p>{text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
export default About;
