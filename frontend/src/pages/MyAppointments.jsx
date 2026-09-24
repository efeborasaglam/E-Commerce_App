import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const MyAppointments = () => {
  const { backendUrl, token, getDoctorsData } = useContext(AppContext);

  const navigate = useNavigate(); // Bugfix: useNavigate() gibt die Funktion direkt zurück, kein { navigate }

  const [appointments, setAppointments] = useState([]);

  const orderDateFormate = (timestamp) => {
    if (!timestamp) return "-";
    return new Date(timestamp).toLocaleDateString("de-DE", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getUserAppointments = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/appointments", {
        headers: { token },
      });
      if (data.success) {
        setAppointments(data.appointments.reverse());
        console.log(data.appointments);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const cancelAppointment = async (appointmentId) => {
    try {
      console.log(appointmentId);
      const { data } = await axios.post(
        backendUrl + "/api/user/cancel-appointment",
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        toast.success(data.message);
        getUserAppointments();
        getDoctorsData();
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  // Stripe: statt Popup wird der User auf die von Stripe gehostete Checkout-Seite weitergeleitet
  const AppointmentStripe = async (appointmentId) => {
    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/payment-razorpay", // Route-Pfad bleibt laut Tutorial gleich
        { appointmentId },
        { headers: { token } },
      );
      if (data.success) {
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  useEffect(() => {
    if (token) {
      getUserAppointments();
    }
  }, [token]);

  return (
    <div>
      <p className="pb-3 mt-12 text-2xl font-extrabold uppercase italic border-b">
        Meine <span className="text-[#8DB600]">Bestellungen</span>
      </p>
      <div className="flex flex-col gap-4 mt-6">
        {appointments.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 p-4 rounded-2xl border border-gray-200 bg-white shadow-sm"
            key={index}
          >
            <div>
              <img
                className="w-32 rounded-xl bg-neutral-100"
                src={item.docData.image}
                alt="produkt"
              />
            </div>
            <div className="flex-1 text-sm text-zinc-600">
              <p className="text-neutral-900 text-lg font-semibold">
                {item.docData.name}
              </p>
              <p className="text-[11px] uppercase tracking-widest text-gray-400">
                {item.docData.speciality}
              </p>

              <p className="text-xs mt-2">
                <span className="text-sm text-neutral-700 font-medium">
                  Menge:
                </span>{" "}
                {item.quantity ?? "-"}
                {item.color && (
                  <>
                    {" "}
                    <span className="text-sm text-neutral-700 font-medium">
                      | Farbe:
                    </span>{" "}
                    {item.color}
                  </>
                )}
              </p>

              <p className="text-zinc-700 font-medium mt-2">Lieferadresse:</p>
              {item.address ? (
                <>
                  <p className="text-xs">{item.address.name}</p>
                  <p className="text-xs">{item.address.street}</p>
                  <p className="text-xs">
                    {item.address.zip} {item.address.city},{" "}
                    {item.address.country}
                  </p>
                  <p className="text-xs">{item.address.phone}</p>
                </>
              ) : (
                <p className="text-xs">-</p>
              )}

              <p className="text-xs mt-2">
                <span className="text-sm text-neutral-700 font-medium">
                  Bestelldatum:
                </span>{" "}
                {orderDateFormate(item.date)}
              </p>
            </div>

            <div className="flex flex-col gap-2 justify-end">
              {!item.cancel && item.payment && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 rounded-full bg-[#C6FF00] text-black text-sm font-bold uppercase tracking-wide">
                  Paid
                </button>
              )}
              {!item.cancel && !item.payment && !item.isCompleted && (
                <button
                  className="text-sm font-semibold text-center sm:min-w-48 py-2 rounded-full bg-neutral-950 text-[#C6FF00] hover:bg-[#C6FF00] hover:text-black transition-all duration-300"
                  onClick={() => AppointmentStripe(item._id)}
                >
                  Pay Online
                </button>
              )}
              {!item.cancel && !item.isCompleted && (
                <button
                  className="text-sm text-stone-500 text-center sm:min-w-48 py-2 rounded-full border hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300"
                  onClick={() => cancelAppointment(item._id)}
                >
                  Cancel Order
                </button>
              )}
              {item.cancel && !item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-red-500 rounded-full text-red-500 text-sm">
                  Order cancelled
                </button>
              )}
              {item.isCompleted && (
                <button className="sm:min-w-48 py-2 border border-green-500 rounded-full text-green-600 text-sm">
                  Completed
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyAppointments;