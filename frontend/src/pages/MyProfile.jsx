import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext.jsx";
import { assets } from "../assets/assets.js";
import axios from "axios";
import { toast } from "react-toastify";

const MyProfile = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } =
    useContext(AppContext);

  const [isEdit, setIsEdit] = useState(false);
  const [image, setImage] = useState(false);

  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();
      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } },
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
    }
  };

  const field =
    "bg-gray-50 border border-gray-300 rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#8DB600]";

  return (
    userData && (
      <div className="max-w-lg flex flex-col gap-2 text-sm rounded-2xl border border-gray-200 p-8 shadow-sm">
        {isEdit ? (
          <label htmlFor="image">
            <div className="inline-block relative cursor-pointer">
              <img
                className="w-36 h-36 object-cover rounded-2xl opacity-75"
                src={image ? URL.createObjectURL(image) : userData.image}
              />
              <img
                className="w-10 absolute bottom-12 right-12"
                src={image ? "" : assets.upload_icon}
              />
            </div>
            <input
              onChange={(e) => setImage(e.target.files[0])}
              type="file"
              id="image"
              hidden
            />
          </label>
        ) : (
          <img
            src={userData.image}
            alt="profile"
            className="w-32 h-32 rounded-2xl object-cover ring-4 ring-[#C6FF00]"
          />
        )}

        {isEdit ? (
          <input
            className={`${field} text-2xl font-semibold max-w-60 mt-4`}
            type="text"
            value={userData.name}
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        ) : (
          <p className="font-extrabold text-3xl text-neutral-900 mt-4">
            {userData.name}
          </p>
        )}
        <hr className="bg-zinc-300 h-[1px] border-none" />

        <div>
          <p className="text-neutral-500 font-semibold uppercase tracking-wide text-xs mt-3">
            Contact information
          </p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">
            <p className="font-medium">Email id:</p>
            <p className="text-gray-600">{userData.email}</p>
            <p className="font-medium">Phone:</p>
            {isEdit ? (
              <input
                type="text"
                className={`${field} max-w-52`}
                value={userData.phone}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-600">{userData.phone}</p>
            )}
            <p className="font-medium">Address:</p>
            {isEdit ? (
              <div className="flex flex-col gap-2">
                <input
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line1: e.target.value },
                    }))
                  }
                  className={field}
                  value={userData.address?.line1 || ""}
                  type="text"
                />
                <input
                  onChange={(e) =>
                    setUserData((prev) => ({
                      ...prev,
                      address: { ...prev.address, line2: e.target.value },
                    }))
                  }
                  className={field}
                  value={userData.address?.line2 || ""}
                  type="text"
                />
              </div>
            ) : (
              <p className="text-gray-600">
                {userData.address?.line1}
                <br />
                {userData.address?.line2}
              </p>
            )}
          </div>
        </div>

        <div>
          <p className="text-neutral-500 font-semibold uppercase tracking-wide text-xs mt-4">
            Basic information
          </p>
          <div className="grid grid-cols-[1fr_3fr] gap-y-3 mt-3 text-neutral-700">
            <p className="font-medium">Gender:</p>
            {isEdit ? (
              <select
                className={`${field} max-w-24`}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, gender: e.target.value }))
                }
                value={userData.gender}
              >
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            ) : (
              <p className="text-gray-600">{userData.gender}</p>
            )}
            <p className="font-medium">Birthday:</p>
            {isEdit ? (
              <input
                type="date"
                className={`${field} max-w-36`}
                value={userData.dob}
                onChange={(e) =>
                  setUserData((prev) => ({ ...prev, dob: e.target.value }))
                }
              />
            ) : (
              <p className="text-gray-600">{userData.dob}</p>
            )}
          </div>
        </div>

        <div className="mt-10">
          {isEdit ? (
            <button
              onClick={updateUserProfileData}
              className="rounded-full bg-[#C6FF00] px-8 py-2.5 text-xs font-bold uppercase tracking-wide text-black hover:scale-105 transition-all duration-300"
            >
              Save Information
            </button>
          ) : (
            <button
              className="rounded-full border-2 border-neutral-900 px-8 py-2.5 text-xs font-bold uppercase tracking-wide hover:bg-neutral-900 hover:text-[#C6FF00] transition-all duration-300"
              onClick={() => setIsEdit(true)}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    )
  );
};
export default MyProfile;
