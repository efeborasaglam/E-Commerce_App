import express from "express";
import {
  addDoctor,
  adminDashboard,
  allDoctors,
  appointmentCancel,
  appointmentComplete,
  appointmentsAdmin,
  loginAdmin,
  updateDoctor, // ← neu
} from "../controllers/adminController.js";
import upload from "../middlewares/multer.js";
import authAdmin from "../middlewares/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router();

adminRouter.post("/add-doctor", authAdmin, upload.array("images", 5), addDoctor);
adminRouter.post("/login", loginAdmin);
adminRouter.post("/all-doctors", authAdmin, allDoctors);
adminRouter.post("/change-availability", authAdmin, changeAvailability);
adminRouter.get("/appointments", authAdmin, appointmentsAdmin);
adminRouter.post("/cancel-appointment", authAdmin, appointmentCancel);
adminRouter.post("/complete-appointment", authAdmin, appointmentComplete);
adminRouter.get("/dashboard", authAdmin, adminDashboard);
adminRouter.post(
  "/update-doctor",
  authAdmin,
  upload.array("images", 5),
  updateDoctor,
); // ← neu

export default adminRouter;