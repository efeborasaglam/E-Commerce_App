import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import RelatedDoctors from "../components/RelatedDoctors.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctorsData } =
    useContext(AppContext);

  const navigate = useNavigate();

  const [docInfo, setDocInfo] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  // Menge statt Terminslot
  const [quantity, setQuantity] = useState(1);

  // HIER HAT DER STATE GEFEHLT:
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
        navigate("/my-orders");
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
              <button className={"py-0.5 px-2 border text-xs rounded-full"}>
                {docInfo.experience}
              </button>
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
              <p className={"text-sm text-gray-600 max-w-[700px] mt-1 whitespace-pre-line"}>
                {docInfo.about}
              </p>
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
          <p className={"text-lg"}>Bestellung</p>

          {/* Menge */}
          <div className={"mt-4 max-w-xs"}>
            <label className={"text-sm text-gray-600"}>Anzahl</label>
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

          {/* Lieferadresse */}
          <div className={"mt-6 max-w-xl"}>
            <p className={"text-sm text-gray-900 font-medium mb-2"}>
              Lieferadresse
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
                placeholder={"Straße und Hausnummer"}
                value={address.street}
                onChange={handleAddressChange("street")}
                className={
                  "border border-gray-300 rounded-md px-3 py-2 text-sm sm:col-span-2"
                }
              />
              <input
                type={"text"}
                placeholder={"PLZ"}
                value={address.zip}
                onChange={handleAddressChange("zip")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
              <input
                type={"text"}
                placeholder={"Ort"}
                value={address.city}
                onChange={handleAddressChange("city")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
              <input
                type={"text"}
                placeholder={"Land"}
                value={address.country}
                onChange={handleAddressChange("country")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
              <input
                type={"tel"}
                placeholder={"Telefon"}
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
            Jetzt bestellen
          </button>
        </div>
        {/*    Listing verwandter Produkte */}
        <RelatedDoctors docId={docId} speciality={docInfo.speciality} />
      </div>
    )
  );
};

export default Appointment;