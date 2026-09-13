import upload from "../middlewares/multer.js";
import validator from "validator";
import bcrypt from "bcrypt";
import { v2 as cloudinary } from "cloudinary";
import doctorModel from "../models/doctorModel.js";
import jwt from "jsonwebtoken";
import appointmentModel from "../models/appointmentModel.js";
import userModel from "../models/userModel.js";

// API for adding doctor
const addDoctor = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      colors
    } = req.body;
    const imageFiles = req.files; // jetzt ein Array statt req.file

    if (
      !name ||
      !email ||
      !password ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    if (!imageFiles || imageFiles.length === 0) {
      return res.json({ success: false, message: "At least one image is required" });
    }

    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Shit Email" });
    }

    if (password.length < 8) {
      return res.json({ success: false, message: "Shit Password" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Alle Bilder parallel zu Cloudinary hochladen
    const uploadResults = await Promise.all(
      imageFiles.map((file) =>
        cloudinary.uploader.upload(file.path, {
          resource_type: "image",
          folder: "doctors",
        }),
      ),
    );
    const imageUrls = uploadResults.map((result) => result.secure_url);

    const doctorData = {
      name,
      email,
      image: imageUrls[0], // Hauptbild bleibt kompatibel zu bestehendem Code (Karten, Listen etc.)
      images: imageUrls, // alle Bilder für die Galerie
      password: hashedPassword,
      speciality,
      degree,
      experience,
      about,
      fees,
      address: JSON.parse(address),
      date: Date.now(),
      colors: colors ? JSON.parse(colors) : [],
    };

    const newDoctor = new doctorModel(doctorData);
    await newDoctor.save();

    res.json({ success: true, message: "Doctor added" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message + "Something went wrong",
    });
  }
};

// API For admin Login
const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({ success: true, message: "Login Successful", token });
    } else {
      res.json({ success: false, message: "Invalid Credentials" });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message + "Something went wrong",
    });
  }
};

// API to get all doctors list for admin panel
const allDoctors = async (req, res) => {
  try {
    const doctors = await doctorModel.find({}).select("-password");
    res.json({ success: true, message: "Doctors List", doctors });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message + "Something went wrong",
    });
  }
};

//  API to get all appointments list
const appointmentsAdmin = async (req, res) => {
  try {
    const appointments = await appointmentModel.find({});
    res.json({ success: true, message: "Appointments List", appointments });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API for appointment cancellation
const appointmentCancel = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointmentData = await appointmentModel.findById(appointmentId);

    await appointmentModel.findByIdAndUpdate(appointmentId, { cancel: true });

    const { docId, slotDate, slotTime } = appointmentData;

    // Bei Bestellungen (kein echter Termin) gibt es keinen Slot, der freigegeben werden müsste
    if (slotDate !== "Not Applicable") {
      const doctorData = await doctorModel.findById(docId);
      let slots_booked = doctorData.slots_booked;

      if (slots_booked[slotDate]) {
        slots_booked[slotDate] = slots_booked[slotDate].filter(
          (e) => e !== slotTime,
        );
        await doctorModel.findByIdAndUpdate(docId, { slots_booked });
      }
    }

    res.json({ success: true, message: "Appointment Cancelled" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API for appointment completion (admin)
const appointmentComplete = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    await appointmentModel.findByIdAndUpdate(appointmentId, {
      isCompleted: true,
    });

    res.json({ success: true, message: "Appointment Completed" });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
  try {
    const doctors = await doctorModel.find({});
    const users = await userModel.find({});
    const appointments = await appointmentModel.find({});

    const dashData = {
      doctors: doctors.length,
      appointments: appointments.length,
      patient: users.length,
      latestAppointments: appointments.reverse().slice(),
    };

    res.json({ success: true, message: "Dashboard Data", dashData });
  } catch (e) {
    console.log(e);
    res.json({ success: false, message: e.message + "Something went wrong" });
  }
};

// API to update a doctor (admin)
const updateDoctor = async (req, res) => {
  try {
    const {
      docId,
      name,
      speciality,
      degree,
      experience,
      about,
      fees,
      address,
      available,
      existingImages,
      colors
    } = req.body;
    const imageFiles = req.files;

    if (!docId) {
      return res.json({ success: false, message: "Doctor Id missing" });
    }

    if (
      !name ||
      !speciality ||
      !degree ||
      !experience ||
      !about ||
      !fees ||
      !address
    ) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Bilder, die im Frontend behalten wurden
    const keptImages = existingImages ? JSON.parse(existingImages) : [];

    // Neue Bilder hochladen, falls welche mitgeschickt wurden
    let newImageUrls = [];
    if (imageFiles && imageFiles.length > 0) {
      const uploadResults = await Promise.all(
        imageFiles.map((file) =>
          cloudinary.uploader.upload(file.path, {
            resource_type: "image",
            folder: "doctors",
          }),
        ),
      );
      newImageUrls = uploadResults.map((result) => result.secure_url);
    }

    const finalImages = [...keptImages, ...newImageUrls];

    if (finalImages.length === 0) {
      return res.json({
        success: false,
        message: "At least one image is required",
      });
    }

    const updateData = {
      name,
      speciality,
      degree,
      experience,
      about,
      fees: Number(fees),
      address: JSON.parse(address),
      available: available === "true" || available === true,
      images: finalImages,
      image: finalImages[0], // Hauptbild bleibt das erste in der Reihenfolge
      colors: colors ? JSON.parse(colors) : [],
    };

    await doctorModel.findByIdAndUpdate(docId, updateData);

    res.json({ success: true, message: "Doctor updated" });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message + "Something went wrong",
    });
  }
};

export {
  addDoctor,
  loginAdmin,
  allDoctors,
  appointmentsAdmin,
  appointmentCancel,
  appointmentComplete,
  adminDashboard,
  updateDoctor
};