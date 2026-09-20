import validator from "validator";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// API to register user
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !password || !email) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Invalid Email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Short Password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userData = {
      name,
      email,
      password: hashedPassword,
    };

    const newUser = new userModel(userData);
    const user = await newUser.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

    res.json({ success: true, token });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API for user login
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
      res.json({ success: true, token });
    } else {
      res.json({ success: false, message: "Invalid credantials" });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to get user profile data
const getProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const userData = await userModel.findById(userId).select("-password");

    res.json({ success: true, userData });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// update userprofile
const updateProfile = async (req, res) => {
  try {
    const { userId, name, phone, address, dob, gender } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !address || !dob || !gender) {
      return res.json({ success: false, message: "Missing Details" });
    }

    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob,
      gender,
    });

    if (imageFile) {
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;

      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }

    res.json({ success: true, message: "Profile Updated" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to book appointment
const bookAppointment = async (req, res) => {
  try {
    const { userId, docId, slotDate, slotTime } = req.body;

    const docDataDoc = await doctorModel.findById(docId).select("-password");

    if (!docDataDoc.available) {
      return res.json({ success: false, message: "Doctor not available" });
    }

    let slots_booked = docDataDoc.slots_booked;

    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({ success: false, message: "Slot already booked" });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime);
    }

    const userDataDoc = await userModel.findById(userId).select("-password");

    const docData = docDataDoc.toObject();
    const userData = userDataDoc.toObject();

    delete docData.slots_booked;

    const appointmentData = {
      userId,
      docId,
      userData,
      docData,
      amount: docData.fees,
      slotTime,
      slotDate,
      date: Date.now(),
    };

    const newAppointment = new appointmentModel(appointmentData);
    await newAppointment.save();

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });

    res.json({ success: true, message: "Appointment Booked" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to get user appointments for frontend my-appointment page
const listAppointment = async (req, res) => {
  try {
    const { userId } = req.body;
    const appointments = await appointmentModel.find({ userId });

    res.json({ success: true, appointments });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const { userId, appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (appointmentData.userId !== userId) {
      return res.json({ success: false, message: "Unauthorized action" });
    }

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to make payment of a single order using Stripe Checkout
const paymentStripe = async (req, res) => {
  try {
    const { appointmentId } = req.body;
    const { origin } = req.headers;

    const appointmentData = await appointmentModel.findById(appointmentId);

    if (!appointmentData || appointmentData.cancel) {
      return res.json({
        success: false,
        message: "Appointment Cancelled or not found",
      });
    }

    const currency = process.env.CURRENCY.toLowerCase();

    const quantity = appointmentData.quantity || 1;
    const unitAmount = Math.round((appointmentData.amount / quantity) * 100);

    const line_items = [
      {
        price_data: {
          currency,
          product_data: {
            name: appointmentData.color
              ? `${appointmentData.docData.name} (${appointmentData.color})`
              : appointmentData.docData.name,
          },
          unit_amount: unitAmount,
        },
        quantity,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
      cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to pay a whole cart order (all items of one orderGroupId) in ONE Stripe session
const paymentStripeCart = async (req, res) => {
  try {
    const { userId, orderGroupId } = req.body;
    const { origin } = req.headers;

    if (!orderGroupId) {
      return res.json({ success: false, message: "orderGroupId missing" });
    }

    const orders = await appointmentModel.find({
      orderGroupId,
      userId,
      cancel: false,
      payment: false,
    });

    if (orders.length === 0) {
      return res.json({ success: false, message: "No open orders found" });
    }

    const currency = process.env.CURRENCY.toLowerCase();

    const line_items = orders.map((order) => {
      const quantity = order.quantity || 1;
      return {
        price_data: {
          currency,
          product_data: {
            name: order.color
              ? `${order.docData.name} (${order.color})`
              : order.docData.name,
          },
          unit_amount: Math.round((order.amount / quantity) * 100),
        },
        quantity,
      };
    });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${origin}/verify?success=true&orderGroupId=${orderGroupId}`,
      cancel_url: `${origin}/verify?success=false&orderGroupId=${orderGroupId}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to verify Stripe payment after redirect (single order OR whole cart order)
const verifyStripe = async (req, res) => {
  try {
    const { userId, appointmentId, orderGroupId, success } = req.body;

    if (success !== "true") {
      return res.json({ success: false, message: "Payment failed" });
    }

    if (orderGroupId) {
      await appointmentModel.updateMany(
        { orderGroupId, userId, cancel: false },
        { payment: true },
      );
      return res.json({ success: true, message: "Payment Successful" });
    }

    if (appointmentId) {
      await appointmentModel.findByIdAndUpdate(appointmentId, {
        payment: true,
      });
      return res.json({ success: true, message: "Payment Successful" });
    }

    return res.json({ success: false, message: "Payment failed" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Payment Failed" });
  }
};

// API to place a single order (Direktkauf über "Order Now")
const placeOrder = async (req, res) => {
  try {
    const { userId, docId, quantity, address } = req.body;

    const productDataDoc = await doctorModel.findById(docId).select("-password");
    const userDataDoc = await userModel.findById(userId).select("-password");

    if (!productDataDoc) {
      return res.json({ success: false, message: "Product not found" });
    }

    const productData = productDataDoc.toObject();
    const userData = userDataDoc.toObject();

    delete productData.slots_booked;

    const orderQuantity = Math.max(1, Number(quantity) || 1);

    const orderData = {
      userId,
      docId,
      userData,
      docData: productData,
      amount: productData.fees * orderQuantity,
      quantity: orderQuantity,
      address,
      slotTime: "Not Applicable",
      slotDate: "Not Applicable",
      color: req.body.color,
      date: Date.now(),
    };

    const newOrder = new appointmentModel(orderData);
    await newOrder.save();

    res.json({ success: true, message: "Order Placed Successfully" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + " Something went wrong" });
  }
};

// API to place a cart order: ein Dokument pro Artikel, alle mit derselben orderGroupId
const placeCartOrder = async (req, res) => {
  try {
    const { userId, items, address } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.json({ success: false, message: "Cart is empty" });
    }

    const userDataDoc = await userModel.findById(userId).select("-password");
    if (!userDataDoc) {
      return res.json({ success: false, message: "User not found" });
    }
    const userData = userDataDoc.toObject();

    const orderGroupId = new mongoose.Types.ObjectId().toString();
    const date = Date.now();

    const ordersToCreate = [];

    for (const item of items) {
      const productDataDoc = await doctorModel
        .findById(item.docId)
        .select("-password");

      if (!productDataDoc) {
        return res.json({
          success: false,
          message: "Product not found: " + item.docId,
        });
      }

      const productData = productDataDoc.toObject();
      delete productData.slots_booked;

      const quantity = Math.max(1, Number(item.quantity) || 1);

      ordersToCreate.push({
        userId,
        docId: item.docId,
        userData,
        docData: productData,
        amount: productData.fees * quantity,
        quantity,
        color: item.color || "",
        address,
        slotTime: "Not Applicable",
        slotDate: "Not Applicable",
        orderGroupId,
        date,
      });
    }

    const createdOrders = await appointmentModel.insertMany(ordersToCreate);

    res.json({
      success: true,
      message: "Order Placed Successfully",
      orderGroupId,
      appointmentIds: createdOrders.map((order) => order._id),
    });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + " Something went wrong" });
  }
};

export {
  registerUser,
  loginUser,
  getProfile,
  updateProfile,
  bookAppointment,
  listAppointment,
  deleteAppointment,
  paymentStripe,
  paymentStripeCart,
  verifyStripe,
  placeOrder,
  placeCartOrder,
};