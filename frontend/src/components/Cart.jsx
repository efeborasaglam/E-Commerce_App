import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const Cart = () => {
  const {
    cartItems,
    updateCartItem,
    removeFromCart,
    clearCart,
    getCartAmount,
    getCartProduct,
    currencySymbol,
    backendUrl,
    token,
    getDoctorsData,
  } = useContext(AppContext);

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

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

  const isAddressComplete = () =>
    Object.values(address).every((v) => v.trim() !== "");

  // Legt die Bestellung an und gibt die orderGroupId zurück (oder null bei Fehler)
  const createOrder = async () => {
    if (!token) {
      toast.warn("Login to place order");
      navigate("/login");
      return null;
    }

    if (cartItems.length === 0) {
      toast.warn("Dein Warenkorb ist leer");
      return null;
    }

    if (!isAddressComplete()) {
      toast.warn("Bitte alle Adressfelder ausfüllen");
      return null;
    }

    const items = cartItems.map((item) => ({
      docId: item.docId,
      quantity: item.quantity,
      color: item.color,
    }));

    const { data } = await axios.post(
      backendUrl + "/api/user/place-cart-order",
      { items, address },
      { headers: { token } },
    );

    if (!data.success) {
      toast.error(data.message);
      return null;
    }

    return data.orderGroupId;
  };

  const orderPayLater = async () => {
    try {
      setLoading(true);
      const orderGroupId = await createOrder();
      if (!orderGroupId) return;

      clearCart();
      getDoctorsData();
      toast.success("Bestellung aufgegeben");
      navigate("/my-appointments");
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  const orderAndPay = async () => {
    try {
      setLoading(true);
      const orderGroupId = await createOrder();
      if (!orderGroupId) return;

      const { data } = await axios.post(
        backendUrl + "/api/user/payment-cart",
        { orderGroupId },
        { headers: { token } },
      );

      if (data.success) {
        clearCart();
        window.location.replace(data.session_url);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <p className={"pb-3 mt-12 font-medium text-zinc-700 border-b"}>
        Warenkorb
      </p>

      {cartItems.length === 0 ? (
        <div className={"py-16 text-center text-zinc-600"}>
          <p>Dein Warenkorb ist leer.</p>
          <button
            onClick={() => navigate("/doctors")}
            className={
              "mt-4 bg-primary text-white text-sm font-light px-10 py-3 rounded-full"
            }
          >
            Produkte ansehen
          </button>
        </div>
      ) : (
        <div>
          {cartItems.map((item, index) => {
            const product = getCartProduct(item.docId);
            if (!product) {
              return (
                <div
                  key={index}
                  className={
                    "flex items-center justify-between py-4 border-b text-sm text-zinc-600"
                  }
                >
                  <p>Produkt nicht mehr verfügbar</p>
                  <button
                    onClick={() => removeFromCart(index)}
                    className={"text-red-500"}
                  >
                    Entfernen
                  </button>
                </div>
              );
            }

            return (
              <div
                className={
                  "grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-4 border-b"
                }
                key={index}
              >
                <div>
                  <img
                    className={"w-32 bg-indigo-50 cursor-pointer"}
                    onClick={() => navigate("/appointment/" + item.docId)}
                    src={product.images?.length ? product.images[0] : product.image}
                    alt={product.name}
                  />
                </div>

                <div className={"flex-1 text-sm text-zinc-600"}>
                  <p className={"text-neutral-800 font-semibold"}>
                    {product.name}
                  </p>
                  <p>{product.speciality}</p>
                  <p className={"mt-1"}>
                    {currencySymbol}
                    {product.fees} pro Stück
                  </p>

                  <div className={"flex flex-wrap items-end gap-4 mt-3"}>
                    <div>
                      <label className={"text-xs text-gray-600"}>Menge</label>
                      <input
                        type={"number"}
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateCartItem(index, {
                            quantity: Math.max(1, Number(e.target.value) || 1),
                          })
                        }
                        className={
                          "mt-1 block w-24 border border-gray-300 rounded-md px-3 py-2 text-sm"
                        }
                      />
                    </div>

                    {product.colors && product.colors.length > 0 && (
                      <div>
                        <label className={"text-xs text-gray-600"}>Farbe</label>
                        <select
                          value={item.color}
                          onChange={(e) =>
                            updateCartItem(index, { color: e.target.value })
                          }
                          className={
                            "mt-1 block w-40 border border-gray-300 rounded-md px-3 py-2 text-sm"
                          }
                        >
                          {product.colors.map((color, i) => (
                            <option key={i} value={color}>
                              {color}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                <div className={"flex flex-col gap-2 justify-end items-end"}>
                  <p className={"text-sm font-medium text-neutral-800"}>
                    {currencySymbol}
                    {product.fees * item.quantity}
                  </p>
                  <button
                    onClick={() => removeFromCart(index)}
                    className={
                      "text-sm text-stone-500 text-center sm:min-w-48 py-2 border hover:bg-red-600 hover:text-white transition-all duration-300"
                    }
                  >
                    Entfernen
                  </button>
                </div>
              </div>
            );
          })}

          {/* Lieferadresse für die gesamte Bestellung */}
          <div className={"mt-8 max-w-xl"}>
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
                placeholder={"Strasse und Nummer"}
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
                placeholder={"Telefonnummer"}
                value={address.phone}
                onChange={handleAddressChange("phone")}
                className={"border border-gray-300 rounded-md px-3 py-2 text-sm"}
              />
            </div>
          </div>

          {/* Summe + Aktionen */}
          <div className={"mt-8 mb-16 max-w-xl"}>
            <div
              className={
                "flex items-center justify-between border-t pt-4 text-neutral-800 font-medium"
              }
            >
              <p>Gesamt</p>
              <p>
                {currencySymbol}
                {getCartAmount()}
              </p>
            </div>

            <div className={"flex flex-col sm:flex-row gap-3 mt-5"}>
              <button
                disabled={loading}
                onClick={orderAndPay}
                className={
                  "bg-white text-black border-black border-1 hover:bg-accent hover:text-white text-sm font-light px-14 py-3 rounded-full disabled:opacity-60"
                }
              >
                Order and Pay
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;