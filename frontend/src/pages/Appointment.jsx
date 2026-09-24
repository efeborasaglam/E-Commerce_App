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
        {/* Produkt Details */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-3 sm:max-w-72 w-full">
            <img
              className="w-full sm:max-w-72 rounded-2xl bg-neutral-100 border border-gray-200"
              src={
                docInfo.images?.length
                  ? docInfo.images[selectedImage]
                  : docInfo.image
              }
              alt="image"
            />
            {docInfo.images?.length > 1 && (
              <div className="flex gap-2 overflow-x-auto mb-25 sm:mb-0">
                {docInfo.images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    onClick={() => setSelectedImage(index)}
                    className={`w-14 h-14 object-cover rounded-lg cursor-pointer border-2 flex-shrink-0 transition-all ${
                      selectedImage === index
                        ? "border-[#C6FF00]"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    alt={`thumbnail-${index}`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex-1 border border-gray-200 rounded-2xl p-8 py-7 bg-white shadow-sm mx-2 sm:mx-0 mt-[-80px] sm:mt-0">
            <p className="text-[11px] uppercase tracking-widest text-gray-400">
              {docInfo.speciality}
            </p>
            <p className="flex items-center gap-2 text-3xl font-extrabold text-gray-900 mt-1">
              {docInfo.name}
              <img className="w-5" src={assets.verified_icon} alt="verify" />
            </p>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              {docInfo.degree && <p>{docInfo.degree}</p>}
              <span
                className={`rounded-full px-3 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  docInfo.available
                    ? "bg-[#C6FF00] text-black"
                    : "bg-gray-800 text-gray-300"
                }`}
              >
                {docInfo.available ? "In Stock" : "Sold Out"}
              </span>
            </div>

            <p className="mt-5 text-3xl font-extrabold text-gray-900">
              {currencySymbol}
              {docInfo.fees}
            </p>

            <div className="mt-5">
              <p className="flex items-center gap-1 text-sm font-semibold uppercase tracking-wide text-gray-900">
                About
                <img src={assets.info_icon} alt="info" />
              </p>
              <div className="text-sm text-gray-600 mt-1 prose prose-sm prose-headings:font-semibold prose-headings:text-gray-800 prose-headings:mt-3 prose-headings:mb-1 prose-p:my-1 max-w-none">
                <ReactMarkdown>{docInfo.about}</ReactMarkdown>
              </div>
            </div>
          </div>
        </div>

        {/* Bestellung: Menge + Lieferadresse */}
        <div className="sm:ml-72 sm:pl-4 mt-6 font-medium text-gray-700">
          <p className="text-xl font-extrabold uppercase italic">Order</p>

          <div className="mt-4 max-w-xs">
            <label className="text-sm text-gray-600">Amount</label>
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8DB600]"
            />
            {docInfo.colors && docInfo.colors.length > 0 && (
              <div className="mt-4 max-w-xs">
                <label className="text-sm text-gray-600">Farbe</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  className="mt-1 w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8DB600]"
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

          {/* In den Warenkorb */}
          <button
            onClick={handleAddToCart}
            className="flex items-center gap-2 mt-5 text-sm font-semibold uppercase tracking-wide text-neutral-900 border-2 border-neutral-900 px-8 py-3 rounded-full hover:bg-neutral-900 hover:text-[#C6FF00] transition-all duration-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.7}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M6.106 5.272l1.94 7.28a1.125 1.125 0 0 0 1.087.835h7.98a1.125 1.125 0 0 0 1.09-.848l1.32-5.28a.75.75 0 0 0-.728-.932H6.106Z"
              />
              <circle cx="9.5" cy="19" r="1.5" />
              <circle cx="17" cy="19" r="1.5" />
            </svg>
            In den Warenkorb
          </button>

          {/* Lieferadresse (Direktkauf) */}
          <div className="mt-8 max-w-xl rounded-2xl border border-gray-200 p-5">
            <p className="text-sm text-gray-900 font-semibold uppercase tracking-wide mb-3">
              Delivery address
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                ["name", "Name", "text", "sm:col-span-2"],
                ["street", "Address", "text", "sm:col-span-2"],
                ["zip", "Postalcode", "text", ""],
                ["city", "City", "text", ""],
                ["country", "Country", "text", ""],
                ["phone", "Telefonnumber", "tel", ""],
              ].map(([field, placeholder, type, span]) => (
                <input
                  key={field}
                  type={type}
                  placeholder={placeholder}
                  value={address[field]}
                  onChange={handleAddressChange(field)}
                  className={`border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-[#8DB600] ${span}`}
                />
              ))}
            </div>
          </div>

          <button
            onClick={placeOrder}
            className="bg-[#C6FF00] text-black text-sm font-bold uppercase tracking-wide px-14 py-3.5 rounded-full my-6 hover:scale-105 hover:shadow-[0_0_25px_rgba(198,255,0,0.5)] transition-all duration-300"
          >
            Order Now
          </button>
        </div>

        {/* Verwandte Produkte */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;