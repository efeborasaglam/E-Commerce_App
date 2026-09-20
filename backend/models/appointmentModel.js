import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  docId: { type: String, required: true },
  slotDate: { type: String, required: true },
  slotTime: { type: String, required: true },
  userData: { type: Object, required: true },
  docData: { type: Object, required: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, default: 1 }, // <-- hat vorher gefehlt, deshalb wurde die Menge nie gespeichert
  color: { type: String, default: "" },
  address: { type: Object },
  orderGroupId: { type: String, default: "" }, // <-- alle Artikel einer Warenkorb-Bestellung teilen sich diese ID
  date: { type: Number, required: true },
  cancel: { type: Boolean, default: false },
  payment: { type: Boolean, default: false },
  isCompleted: { type: Boolean, default: false },
});

const appointmentModel =
  mongoose.models.appointment ||
  mongoose.model("appointment", appointmentSchema);

export default appointmentModel;