import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AdminContext } from "../../context/AdminContext.jsx";
import { toast } from "react-toastify";
import axios from "axios";

const EditDoctor = () => {
  const { docId } = useParams();
  const navigate = useNavigate();
  const { aToken, backendUrl, doctors, getAllDoctors } =
    useContext(AdminContext);

  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("General physician");
  const [degree, setDegree] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [about, setAbout] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [available, setAvailable] = useState(true);
  const [colors, setColors] = useState("");
  const [selectedColor, setSelectedColor] = useState("");

  const [existingImages, setExistingImages] = useState([]); // URLs, die behalten werden
  const [newImages, setNewImages] = useState([]); // neue File-Objekte

  useEffect(() => {
    if (aToken && doctors.length === 0) {
      getAllDoctors();
    }
  }, [aToken]);

  useEffect(() => {
    const doc = doctors.find((d) => d._id === docId);
    if (doc) {
      setName(doc.name);
      setSpeciality(doc.speciality);
      setDegree(doc.degree);
      setExperience(doc.experience);
      setFees(doc.fees);
      setAbout(doc.about);
      setAddress1(doc.address?.line1 || "");
      setAddress2(doc.address?.line2 || "");
      setColors(doc.colors ? doc.colors.join(", ") : "");
      setAvailable(doc.available);
      setExistingImages(doc.images?.length ? doc.images : [doc.image]);
      setLoading(false);
    }
  }, [doctors, docId]);

  const onNewImagesChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prev) => [...prev, ...files]);
    e.target.value = "";
  };

  const removeExistingImage = (index) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (existingImages.length === 0 && newImages.length === 0) {
      return toast.error("At least one image is required");
    }

    try {
      const formData = new FormData();
      formData.append("docId", docId);
      formData.append("name", name);
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("about", about);
      formData.append("available", available);
      formData.append(
        "address",
        JSON.stringify({ line1: address1, line2: address2 }),
      );
      formData.append(
        "colors",
        JSON.stringify(
          colors
            ? colors
                .split(",")
                .map((c) => c.trim())
                .filter(Boolean)
            : [],
        ),
      );
      formData.append("existingImages", JSON.stringify(existingImages));
      newImages.forEach((file) => formData.append("images", file));

      const { data } = await axios.post(
        backendUrl + "/api/admin/update-doctor",
        formData,
        { headers: { aToken } },
      );

      if (data.success) {
        toast.success(data.message);
        getAllDoctors();
        navigate("/doctor-list");
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      toast.error(e.message);
      console.log(e);
    }
  };

  if (loading) {
    return <p className={"m-5"}>Loading...</p>;
  }

  return (
    <form onSubmit={onSubmitHandler} className={"m-5 w-full"}>
      <p className={"mb-3 text-lg font-medium"}>Edit Doctor</p>
      <div
        className={
          "bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll"
        }
      >
        {/* Bilder */}
        <div className={"flex flex-col gap-4 mb-8 text-gray-500"}>
          <p>Images</p>
          <div className={"flex flex-wrap gap-3"}>
            {existingImages.map((img, index) => (
              <div key={`existing-${index}`} className={"relative w-20 h-20"}>
                <img
                  className={"w-20 h-20 object-cover rounded border"}
                  src={img}
                  alt={`existing-${index}`}
                />
                <button
                  type={"button"}
                  onClick={() => removeExistingImage(index)}
                  className={
                    "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  }
                >
                  ×
                </button>
              </div>
            ))}
            {newImages.map((file, index) => (
              <div key={`new-${index}`} className={"relative w-20 h-20"}>
                <img
                  className={
                    "w-20 h-20 object-cover rounded border border-primary"
                  }
                  src={URL.createObjectURL(file)}
                  alt={`new-${index}`}
                />
                <button
                  type={"button"}
                  onClick={() => removeNewImage(index)}
                  className={
                    "absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                  }
                >
                  ×
                </button>
              </div>
            ))}
            <label
              htmlFor={"doc-img"}
              className={
                "w-20 h-20 flex items-center justify-center border-2 border-dashed rounded cursor-pointer text-2xl text-gray-400 hover:border-primary hover:text-primary"
              }
            >
              +
            </label>
            <input
              onChange={onNewImagesChange}
              type={"file"}
              id={"doc-img"}
              accept={"image/*"}
              multiple
              hidden
            />
          </div>
        </div>

        <div
          className={
            "flex flex-col lg:flex-row items-start gap-10 text-gray-600"
          }
        >
          <div className={"w-full lg:flex-1 flex flex-col gap-4"}>
            <div className={"flex-1 flex flex-col gap-1"}>
              <p>Doctor Name</p>
              <input
                onChange={(e) => setName(e.target.value)}
                value={name}
                className={"border rounded px-3 py-2"}
                type={"text"}
                placeholder={"Name"}
                required
              />
            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
              <p>Speciality</p>
              <select
                onChange={(e) => setSpeciality(e.target.value)}
                value={speciality}
                className={"border rounded px-3 py-2"}
              >
                <option value={"General physician"}>General physician</option>
                <option value={"Gynecologist"}>Gynecologist</option>
                <option value={"Dermatologist"}>Dermatologist</option>
                <option value={"Pediatricians"}>Pediatricians</option>
                <option value={"Neurologist"}>Neurologist</option>
                <option value={"Gastroenterologist"}>Gastroenterologist</option>
              </select>
            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
              <p>Education</p>
              <input
                onChange={(e) => setDegree(e.target.value)}
                value={degree}
                className={"border rounded px-3 py-2"}
                type={"text"}
                placeholder={"Education"}
                required
              />
            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
              <p>Experience</p>
              <select
                onChange={(e) => setExperience(e.target.value)}
                value={experience}
                className={"border rounded px-3 py-2"}
              >
                <option value={"1 Year"}>1 Year</option>
                <option value={"2 Year"}>2 Year</option>
                <option value={"3 Year"}>3 Year</option>
                <option value={"4 Year"}>4 Year</option>
                <option value={"5 Year"}>5 Year</option>
                <option value={"6 Year"}>6 Year</option>
                <option value={"7 Year"}>7 Year</option>
                <option value={"8 Year"}>8 Year</option>
                <option value={"9 Year"}>9 Year</option>
                <option value={"10 Year"}>+10 Year</option>
              </select>
            </div>
            <div className={"flex-1 flex flex-col gap-1"}>
              <p>Fees</p>
              <input
                onChange={(e) => setFees(e.target.value)}
                value={fees}
                className={"border rounded px-3 py-2"}
                type={"number"}
                placeholder={"Fees"}
                required
              />
            </div>
          </div>

          <div className={"w-full lg:flex-1 flex flex-col gap-4"}>
            <div className={"flex-1 flex flex-col gap-1"}>
              <p>Address</p>
              <input
                onChange={(e) => setAddress1(e.target.value)}
                value={address1}
                className={"border rounded px-3 py-2"}
                type={"text"}
                placeholder={"Address 1"}
                required
              />
              <input
                onChange={(e) => setAddress2(e.target.value)}
                value={address2}
                className={"border rounded px-3 py-2"}
                type={"text"}
                placeholder={"Address 2"}
                required
              />
            </div>
            <div className={"flex-1 flex flex-col gap-1 mt-4"}>
              <p>Verfügbare Farben (kommagetrennt, z.B. Rot, Blau, Schwarz)</p>
              <input
                onChange={(e) => setColors(e.target.value)}
                value={colors}
                className={"border rounded px-3 py-2"}
                type={"text"}
                placeholder={"Rot, Blau, Schwarz"}
              />
            </div>
            <div className={"flex items-center gap-2 pt-2"}>
              <input
                checked={available}
                onChange={() => setAvailable((prev) => !prev)}
                type={"checkbox"}
                id={"available"}
              />
              <label htmlFor={"available"}>Available</label>
            </div>
          </div>
        </div>

        <div>
          <p className={"mt-4 mb-2"}>About Doctor</p>
          <textarea
            onChange={(e) => setAbout(e.target.value)}
            value={about}
            className={"w-full px-4 pt-2 border rounded"}
            placeholder={"write about doctor"}
            rows={5}
            required
          />
        </div>

        <div className={"flex gap-3 mt-4"}>
          <button
            type={"submit"}
            className={"bg-primary text-white text-sm px-10 py-2 rounded-full"}
          >
            Save Changes
          </button>
          <button
            type={"button"}
            onClick={() => navigate("/doctor-list")}
            className={"border text-sm px-10 py-2 rounded-full"}
          >
            Cancel
          </button>
        </div>
      </div>
    </form>
  );
};

export default EditDoctor;
