import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext.jsx";
import { AppContext } from "../../context/AppContext.jsx";
import { assets } from "../../assets/assets.js";

const AllApointments = () => {
  const {
    aToken,
    appointments,
    getAllAppointments,
    cancelAppointment,
    completeAppointment,
  } = useContext(AdminContext);
  const { currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <div className={"w-full max-w-6xl m-5"}>
      <p className={"mb-3 text-lg font-medium"}>All Appointments</p>
      <div
        className={
          "bg-white border rounded text-sm max-h-[80vh] min-h-[60vh] overflow-y-scroll"
        }
      >
        <div
          className={
            "hidden sm:grid grid-cols-[0.4fr_2fr_2fr_1fr_1fr_2.5fr_2.5fr_1fr_1fr] grid-flow-col py-3 px-6 border-b"
          }
        >
          <p>#</p>
          <p>Kunde</p>
          <p>Produkt</p>
          <p>Menge</p>
          <p>Farbe</p>
          <p>Lieferadresse</p>
          <p>Telefon</p>
          <p>Preis</p>
          <p>Aktion</p>
        </div>
        {appointments.map((item, index) => (
          <div
            className={
              "flex flex-wrap justify-between max-sm:gap-2 sm:grid sm:grid-cols-[0.4fr_2fr_2fr_1fr_1fr_2.5fr_2.5fr_1fr_1fr] items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50"
            }
            key={index}
          >
            <p className={"max-sm:hidden"}>{index + 1}</p>

            {/* Kunde */}
            <div className={"flex items-center gap-2"}>
              <img
                className={"w-8 rounded-full"}
                src={item.userData.image}
                alt={"image"}
              />
              <p>{item.userData.name}</p>
            </div>

            {/* Produkt */}
            <div className={"flex items-center gap-2"}>
              <img
                className={"w-8 rounded-full bg-gray-200"}
                src={item.docData.image}
                alt={"image"}
              />
              <p>{item.docData.name}</p>
            </div>

            {/* Menge */}
            <p>{item.quantity ?? "-"}</p>

            {/* Farbe */}
            <p>{item.color || "-"}</p>

            {/* Lieferadresse (aus der Bestellung, nicht aus dem User-Profil) */}
            <p className={"max-sm:hidden text-xs"}>
              {item.address
                ? `${item.address.street}, ${item.address.zip} ${item.address.city}, ${item.address.country}`
                : "-"}
            </p>

            {/* Telefon */}
            <p className={"max-sm:hidden text-xs"}>
              {item.address?.phone || "-"}
            </p>

            <p>
              {currency} {item.amount}
            </p>

            {item.cancel ? (
              <p className={"text-red-400 text-xs font-medium"}>cancelled</p>
            ) : item.isCompleted ? (
              <p className={"text-green-500 text-xs font-medium"}>Completed</p>
            ) : (
              <div className={"flex items-center gap-2"}>
                <img
                  onClick={() => completeAppointment(item._id)}
                  src={assets.tick_icon}
                  alt={"complete icon"}
                  className={"w-10 cursor-pointer"}
                  title={"Als abgeschlossen markieren"}
                />
                <img
                  onClick={() => cancelAppointment(item._id)}
                  src={assets.cancel_icon}
                  alt={"cancel icon"}
                  className={"w-10 cursor-pointer"}
                  title={"Stornieren"}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
export default AllApointments;