import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
  const currencySymbol = "CHF ";
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [doctors, setDoctors] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : false,
  );
  const [userData, setUserData] = useState(false);

  // ---------- Warenkorb ----------
  // Ein Eintrag: { docId, quantity, color }
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem("cartItems");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
  }, [cartItems]);

  // Gleiches Produkt + gleiche Farbe => Menge wird erhöht statt neuer Zeile
  const addToCart = (docId, quantity = 1, color = "") => {
    if (!token) {
      toast.warn("Bitte einloggen, um Produkte in den Warenkorb zu legen");
      return false;
    }

    const amount = Math.max(1, Number(quantity) || 1);

    setCartItems((prev) => {
      const index = prev.findIndex(
        (item) => item.docId === docId && item.color === color,
      );
      if (index > -1) {
        const copy = [...prev];
        copy[index] = { ...copy[index], quantity: copy[index].quantity + amount };
        return copy;
      }
      return [...prev, { docId, quantity: amount, color }];
    });

    return true;
  };

  const updateCartItem = (index, changes) => {
    setCartItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, ...changes } : item)),
    );
  };

  const removeFromCart = (index) => {
    setCartItems((prev) => prev.filter((item, i) => i !== index));
  };

  const clearCart = () => setCartItems([]);

  const getCartProduct = (docId) => doctors.find((doc) => doc._id === docId);

  const cartCount = cartItems.reduce(
    (sum, item) => sum + (Number(item.quantity) || 0),
    0,
  );

  const getCartAmount = () =>
    cartItems.reduce((sum, item) => {
      const product = getCartProduct(item.docId);
      if (!product) return sum;
      return sum + product.fees * (Number(item.quantity) || 0);
    }, 0);
  // ---------- /Warenkorb ----------

  const getDoctorsData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/doctor/list");
      if (data.success) {
        setDoctors(data.doctors);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e + "AYRIII");
      toast.error(e.message);
    }
  };

  const loadUserProfileData = async () => {
    try {
      const { data } = await axios.get(backendUrl + "/api/user/get-profile", {
        headers: { token },
      });
      if (data.success) {
        setUserData(data.userData);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e + "AYRIII");
      toast.error(e.message);
    }
  };

  const value = {
    doctors,
    getDoctorsData,
    currencySymbol,
    token,
    setToken,
    backendUrl,
    userData,
    setUserData,
    loadUserProfileData,
    cartItems,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    cartCount,
    getCartAmount,
    getCartProduct,
  };

  useEffect(() => {
    getDoctorsData();
  }, []);

  useEffect(() => {
    if (token) {
      loadUserProfileData();
    } else {
      setUserData(false);
    }
  }, [token]);

  return (
    <AppContext.Provider value={value}>{props.children}</AppContext.Provider>
  );
};

export default AppContextProvider;