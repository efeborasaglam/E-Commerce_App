import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";

const NavBar = () => {
  const navigate = useNavigate();

  const { token, setToken, userData, cartCount, clearCart } =
    useContext(AppContext);

  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    setToken(false);
    localStorage.removeItem("token");
    clearCart();
  };

  return (
    <div
      className={
        "flex item-center justify-between text-sm py-4 mb-5 border-b border-b-gray-400"
      }
    >
      <img
        onClick={() => {
          navigate("/");
        }}
        className={"w-40 cursor-pointer"}
        src={assets.Efshop}
        alt={"logo"}
      />

      <ul className={"hidden md:flex items-start gap-5 font-medium"}>
        <NavLink to={"/"}>
          <li className={"py-1"}>HOME</li>
          <hr
            className={
              "border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"
            }
          />
        </NavLink>
        <NavLink to={"/products"}>
          <li className={"py-1"}>ALL PRODUCTS</li>
          <hr
            className={
              "border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"
            }
          />
        </NavLink>
        <NavLink to={"/about"}>
          <li className={"py-1"}>ABOUT</li>
          <hr
            className={
              "border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"
            }
          />
        </NavLink>
        <NavLink to={"/contact"}>
          <li className={"py-1"}>CONTACT</li>
          <hr
            className={
              "border-none outline-none h-0.5 bg-primary w-3/5 m-auto hidden"
            }
          />
        </NavLink>
      </ul>
      <div className={"flex items-center gap-4"}>
        {/* Warenkorb */}
        <button
          onClick={() => navigate("/cart")}
          className={"relative p-1"}
          aria-label={"Warenkorb"}
          title={"Warenkorb"}
        >
          <svg
            xmlns={"http://www.w3.org/2000/svg"}
            className={"w-6 h-6 text-gray-700"}
            fill={"none"}
            viewBox={"0 0 24 24"}
            stroke={"currentColor"}
            strokeWidth={1.7}
          >
            <path
              strokeLinecap={"round"}
              strokeLinejoin={"round"}
              d={
                "M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M6.106 5.272l1.94 7.28a1.125 1.125 0 0 0 1.087.835h7.98a1.125 1.125 0 0 0 1.09-.848l1.32-5.28a.75.75 0 0 0-.728-.932H6.106Z"
              }
            />
            <circle cx={"9.5"} cy={"19"} r={"1.5"} />
            <circle cx={"17"} cy={"19"} r={"1.5"} />
          </svg>
          {cartCount > 0 && (
            <span
              className={
                "absolute -top-1 -right-1 bg-primary text-white text-[10px] leading-none rounded-full w-4 h-4 flex items-center justify-center"
              }
            >
              {cartCount}
            </span>
          )}
        </button>

        {token && userData ? (
          <div
            className={"flex items-center gap-2 cursor-pointer group relative"}
          >
            <img
              src={userData.image}
              alt={"user"}
              className={"w-8 cursor-pointer"}
            />
            <img src={assets.dropdown_icon} alt={"arrow"} className={"w-2.5"} />
            <div
              className={
                "absolute top-0 right-0 pt-14 text-base font-medium text-gray-600 z-20 hidden group-hover:block"
              }
            >
              <div
                className={
                  "min-w-48 bg-stone-100 rounded flex flex-col gap-4 p-4"
                }
              >
                <NavLink to={"/my-profile"}>
                  <p className={"hover:text-black cursor-pointer"}>
                    MY PROFILE
                  </p>
                </NavLink>
                <NavLink to={"/cart"}>
                  <p className={"hover:text-black cursor-pointer"}>CART</p>
                </NavLink>
                <NavLink to={"/my-appointments"}>
                  <p className={"hover:text-black cursor-pointer"}>MY ORDERS</p>
                </NavLink>
                <NavLink to={"/"} onClick={logout}>
                  <p className={"hover:text-black cursor-pointer"}>LOGOUT</p>
                </NavLink>
              </div>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className={
              "bg-primary text-white px-8 py-3 rounded-full font-light hidden md:block"
            }
          >
            Create account
          </button>
        )}
        <img
          onClick={() => setShowMenu(true)}
          className={"w-6 md:hidden"}
          alt={"menu"}
          src={assets.menu_icon}
        />
        {/*    Mobile Menu  */}
        <div
          className={` ${showMenu ? "fixed w-full" : "h-0 w-0"} md:hidden right-0 top-0 bottom-0 z-20 overflow-hidden bg-white transition-all`}
        >
          <div className={"flex items-center justify-between px-5 py-6"}>
            <img className={"w-36"} src={assets.logo} alt={"logo"} />
            <img
              className={"w-7"}
              onClick={() => setShowMenu(false)}
              src={assets.cross_icon}
              alt={"logo"}
            />
          </div>
          <ul
            className={
              "flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium"
            }
          >
            <NavLink onClick={() => setShowMenu(false)} to={"/"}>
              <p className={"px-4 py-2 rounded inline-block"}>HOME</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/products"}>
              <p className={"px-4 py-2 rounded inline-block"}> ALL PRODUCTS</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/cart"}>
              <p className={"px-4 py-2 rounded inline-block"}>
                WARENKORB{cartCount > 0 ? ` (${cartCount})` : ""}
              </p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/about"}>
              <p className={"px-4 py-2 rounded inline-block"}>ABOUT</p>
            </NavLink>
            <NavLink onClick={() => setShowMenu(false)} to={"/contact"}>
              <p className={"px-4 py-2 rounded inline-block"}>CONTACT</p>
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};
export default NavBar;