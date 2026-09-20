import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import RelatedDoctors from "../components/RelatedDoctors.jsx";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const {
    doctors,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
    addToCart,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Menge statt Terminslot
  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState("");

  // Lieferadresse (nur für diese Bestellung, nicht gespeichert)
  const [address, setAddress] = useState({
    name: "",
    street: "",
    zip: "",
    city: "",
    country: "",
    phone: "",
  });

  const handleAddressChange = (field) => (e) => {
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const isAddressComplete = () => {
    return Object.values(address).every((v) => v.trim() !== "");
  };

  // In den Warenkorb legen: keine Adresse nötig, die kommt erst beim Checkout
  const handleAddToCart = () => {
    if (!token) {
      toast.warn("Login to add products to cart");
      return navigate("/login");
    }

    if (!quantity || quantity < 1) {
      toast.warn("Bitte eine gültige Anzahl angeben");
      return;
    }

    if (docInfo.colors && docInfo.colors.length > 0 && !selectedColor) {
      toast.warn("Bitte wähle eine Farbe aus");
      return;
    }

    const added = addToCart(docId, quantity, selectedColor);
    if (added) {
      toast.success("Zum Warenkorb hinzugefügt");
    }
  };

  const placeOrder = async () => {
    if (!token) {
      toast.warn("Login to place order");
      return navigate("/login");
    }

    if (!isAddressComplete()) {
      toast.warn("Bitte alle Adressfelder ausfüllen");
      return;
    }

    if (!quantity || quantity < 1) {
      toast.warn("Bitte eine gültige Anzahl angeben");
      return;
    }

    if (docInfo.colors && docInfo.colors.length > 0 && !selectedColor) {
      toast.warn("Bitte wähle eine Farbe aus");
      return;
    }

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/place-order",
        { docId, quantity, address, color: selectedColor },
        {
          headers: {
            token,
          },
        },
      );

      if (data.success) {
        toast.success(data.message);
        getDoctorsData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    fetchDocInfo();
  }, [doctors, docId]);

  useEffect(() => {
    setSelectedImage(0);
    if (docInfo?.colors?.length > 0) {
      setSelectedColor(docInfo.colors[0]);
    } else {
      setSelectedColor("");
    }
  }, [docInfo]);

  return (
    docInfo && (
      <div>
        {/*   Produkt Details */}
        <div className={"flex flex-col sm:flex-row gap-4"}>
          <div className={"flex flex-col gap-3 sm:max-w-72 w-full"}>
            {/* Hauptbild */}
            <img
              className={"bg-primary w-full sm:max-w-72 rounded-lg"}
              src={
                docInfo.images?.length
                  ? docInfo.images[selectedImage]
                  : docInfo.image
              }
              alt={"image"}
            />
            {/* Thumbnails */}
            {docInfo.images?.length > 1 && (
              <div className={"flex gap-2 overflow-x-auto mb-25 sm:mb-0"}>
                {docInfo.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setSelectedImage(index)}
                    className={`w-14 h-14 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                      selectedImage === index
                        ? "border-primary"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    alt={`thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>
          <div
            className={
              "flex-1 border border-gray-400 rounded-lg p-8 py-7 bg-white mx-2 sm:mx-0 mt-[-80px] sm:mt-0"
            }
          >
            {/*  Produkt Info: Name, Kategorie  */}
            <p
              className={
                "flex items-center gap-2 text-2xl font-medium text-gray-900"
              }
            >
              {docInfo.name}{" "}
              <img
                className={"w-5"}
                src={assets.verified_icon}
                alt={"verify"}
              />
            </p>
            <div
              className={"flex items-center gap-2 text-sm text-gray-600 mt-1"}
            >
              <p>
                {docInfo.degree} - {docInfo.speciality}
              </p>
            </div>
            {/*  Beschreibung  */}
            <div>
              <p
                className={
                  "flex items-center gap-1 text-sm font-medium text-gray-900 mt-3"
                }
              >
                About
                <img src={assets.info_icon} alt={"info"} />
              </p>
              <div className="text-sm text-gray-600 mt-1 prose prose-sm prose-headings:font-medium prose-headings:text-gray-800 prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 max-w-none">
                <ReactMarkdown>{docInfo.about}</ReactMarkdown>
              </div>
            </div>
            <p className={"text-gray-500 font-medium mt-5"}>
              Preis :{" "}
              <span className={"text-gray-600"}>
                {currencySymbol}
                {docInfo.fees}
              </span>
            </p>
          </div>
        </div>

        {/*  Bestellung: Menge + Lieferadresse  */}

        <div className={"sm:ml-72 sm:pl-4 mt-4 font-medium text-gray-700"}>
          <p className={"text-lg"}>Order</p>

          {/* Menge */}
          <div className={"mt-4 max-w-xs"}>
            <label className={"text-sm text-gray-600"}>Amount</label>
            <input
              type={"number"}
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={
                "mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
              }
            />
            {/* Farbenauswahl */}
            {docInfo.colors && docInfo.colors.length > 0 && (
              <div className={"mt-4 max-w-xs"}>
                <label className={"text-sm text-gray-600"}>Farbe</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className={
                    "mt-1 w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  }
                >
                  {docInfo.colors.map((color, index) => (
                    <option key={index} value={color}>
                      {color}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* In den Warenkorb: braucht keine Adresse */}
          <button
            onClick={handleAddToCart}
            className={
              "flex items-center gap-2 mt-5 text-sm text-stone-600 border px-8 py-3 rounded-full hover:bg-primary hover:text-white transition-all duration-300"
            }
          >
            <svg
              xmlns={"http://www.w3.org/2000/svg"}
              className={"w-5 h-5"}
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
            In den Warenkorb
          </button>

          {/* Lieferadresse (nur für den Direktkauf unten) */}
          <div className={"mt-6 max-w-xl"}>
            <p className={"text-sm text-gray-900 font-medium mb-2"}>
              delivery address
            </p>
            <div className={"grid grid-cols-1 sm:grid-cols-2 gap-3"}>
              <input
                type={"text"}
                placeholder={"Name"}
                value={address.name}
                onChange={handleAddressChange("name")}
                className={
                  "border border-gray-300 rounded-md px-3 py-2 text-sm sm:col-span-2"
                }
              />
              <input
                type={"text"}
                placeholder={"Address"}
                value={address.street}
                onChange={handleAddressChange("street")}
                className={
                  "border border-gray-300 rounded-md px-3 py-2 text-sm sm:col-span-2"
                }
              />
              <input
                type={"text"}
                placeholder={"Postalcode"}
                value={address.zip}
                onChange={handleAddressChange("zip")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
              <input
                type={"text"}
                placeholder={"City"}
                value={address.city}
                onChange={handleAddressChange("city")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
              <input
                type={"text"}
                placeholder={"Country"}
                value={address.country}
                onChange={handleAddressChange("country")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
              <input
                type={"tel"}
                placeholder={"Telefonnumber"}
                value={address.phone}
                onChange={handleAddressChange("phone")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
            </div>
          </div>

          <button
            onClick={placeOrder}
            className={
              "bg-primary text-white text-sm font-light px-14 py-3 rounded-full my-6"
            }
          >
            Order Now
          </button>
        </div>
        {/*    Listing verwandter Produkte */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;