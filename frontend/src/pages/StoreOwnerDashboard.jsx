import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";
import { toast } from "react-toastify";
import { FaLock, FaEnvelope, FaUser, FaStar } from "react-icons/fa";

const StoreOwnerDashboard = () => {
  const { user, fetchStoreRatings, storeRatings, updatePassword } =
    useUserStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    const id = localStorage.getItem("userId");
    if (id) fetchStoreRatings(id);
  }, [fetchStoreRatings]);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }

    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    } else {
      toast.error("Failed to update password");
    }
  };

  return (
    <div className="min-h-screen pt-24 px-6 md:px-6 bg-gradient-to-r from-indigo-100 to-blue-100">
      <div className="flex justify-between items-center mb-10 bg-white/70 backdrop-blur-md shadow-md px-6 py-4 rounded-xl">
        <h2 className="text-3xl font-extrabold text-gray-900 tracking-wide">
          Welcome, <span className="text-blue-700">{user?.name}</span>
        </h2>
        <button
          onClick={() => setShowPasswordForm((prev) => !prev)}
          className="bg-gradient-to-tr from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200"
        >
          {showPasswordForm ? "Cancel" : "Change Password"}
        </button>
      </div>

      {showPasswordForm && (
        <form
          onSubmit={handlePasswordUpdate}
          className="bg-white/60 backdrop-blur-md border shadow-lg p-6 rounded-2xl mb-10 w-full max-w-md mx-auto space-y-5"
        >
          <h3 className="text-2xl font-bold text-center text-gray-700">
            <FaLock className="inline mr-2 text-blue-600" />
            Update Password
          </h3>
          <input
            type="password"
            placeholder="Current Password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
          />
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-inner"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 rounded-xl shadow-md transition duration-150"
          >
            Submit
          </button>
        </form>
      )}
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-8">
          ⭐ Store Ratings Overview
        </h3>

        {Object.entries(
          storeRatings.reduce((acc, rating) => {
            const storeId = rating.storeId;
            if (!acc[storeId]) {
              acc[storeId] = {
                storeName: `Store ${storeId}`,
                ratings: [],
              };
            }
            acc[storeId].ratings.push(rating);
            return acc;
          }, {})
        ).map(([storeId, data]) => (
          <div
            key={storeId}
            className="mb-10 bg-white hover:shadow-xl transition duration-300 border border-gray-200 p-6 rounded-2xl"
          >
            <h4 className="text-2xl font-bold text-indigo-700 mb-2 tracking-wide">
              🏪 {data.storeName}
            </h4>
            <p className="text-gray-700 mb-4 text-lg">
              <strong>Average Rating:</strong>{" "}
              {data.ratings.length > 0
                ? (
                    data.ratings.reduce((sum, r) => sum + r.rating, 0) /
                    data.ratings.length
                  ).toFixed(2) + " ⭐"
                : "N/A"}
            </p>

            <ul className="space-y-4">
              {data.ratings.map((rating) => (
                <li
                  key={rating.id}
                  className="p-4 bg-gray-100 rounded-lg border border-gray-200 shadow-sm"
                >
                  <p className="text-gray-800 flex items-center">
                    <FaUser className="mr-2 text-blue-500" />
                    <strong>User:</strong> {rating.userName}
                  </p>
                  <p className="text-gray-800 flex items-center">
                    <FaEnvelope className="mr-2 text-green-600" />
                    <strong>Email:</strong> {rating.userEmail}
                  </p>
                  <p className="text-gray-800 flex items-center">
                    <FaStar className="mr-2 text-yellow-500" />
                    <strong>Rating:</strong> {rating.rating} ⭐
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
