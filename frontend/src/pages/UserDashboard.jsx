import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa";
import { toast } from "react-toastify";

const renderStars = (rating) => {
  const stars = [];
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <FaStar key={`full-${i}`} className="text-yellow-400 text-lg" />
    );
  }
  if (hasHalfStar) {
    stars.push(
      <FaStarHalfAlt key="half" className="text-yellow-400 text-lg" />
    );
  }
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <FaRegStar key={`empty-${i}`} className="text-yellow-400 text-lg" />
    );
  }
  return stars;
};

const UserDashboard = () => {
  const {
    user,
    stores,
    userRatings,
    fetchStores,
    fetchAverageRatings,
    averageRatings,
    submitRating,
    updatePassword,
  } = useUserStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [tempRatings, setTempRatings] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchStores().then(() => fetchAverageRatings());
    }
  }, [user?.id]);

  useEffect(() => {
    setTempRatings(userRatings);
  }, [userRatings]);

  const handleInputChange = (storeId, value) => {
    const val = parseFloat(value);
    if (val >= 0 && val <= 5) {
      setTempRatings((prev) => ({ ...prev, [storeId]: val }));
    }
  };

  const handleSubmitRating = async (storeId) => {
    const rating = tempRatings[storeId];
    if (rating >= 0 && rating <= 5) {
      await submitRating({ storeId, rating });
      fetchAverageRatings();
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast.error("Both fields are required");
      return;
    }
    const result = await updatePassword(currentPassword, newPassword);
    if (result.success) {
      setCurrentPassword("");
      setNewPassword("");
      setShowPasswordForm(false);
    }
  };

  const filteredStores = Array.isArray(stores)
    ? stores.filter(
        (store) =>
          store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          store.address.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  return (
    <div className="relative px-6 py-24 bg-gradient-to-br from-blue-50 to-white min-h-screen">
      <div className="absolute right-6 top-26 z-10">
        <button
          className="bg-gradient-to-tr from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 text-white px-5 py-2 rounded-xl font-semibold shadow-lg transition-all duration-200"
          onClick={() => setShowPasswordForm((prev) => !prev)}
        >
          {showPasswordForm ? "Cancel" : "Update Password"}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={handlePasswordUpdate}
            className="mt-4 bg-white border border-gray-200 shadow-xl p-6 rounded-2xl w-80 space-y-4"
          >
            <h3 className="font-bold text-xl text-gray-700">Change Password</h3>
            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-3 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button
              type="submit"
              className="w-full bg-green-600 text-white font-semibold py-2.5 rounded-lg hover:bg-green-700 transition"
            >
              Submit
            </button>
          </form>
        )}
      </div>

      <h2 className="text-5xl font-extrabold text-gray-800 mb-8">
        Welcome User, <span className="text-blue-700">{user?.name}</span>
      </h2>

      <input
        type="text"
        placeholder="Search stores..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border border-gray-300 rounded-xl p-4 mb-10 w-full text-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredStores.map((store) => (
          <div
            key={store.id}
            className="bg-white rounded-3xl p-6 shadow-md border hover:shadow-2xl transition-transform transform hover:-translate-y-1"
          >
            <h3 className="text-2xl font-bold text-blue-700 mb-2">
              {store.name}
            </h3>
            <p className="text-gray-600 mb-1">
              <span className="font-semibold">Address:</span> {store.address}
            </p>

            <div className="text-sm text-gray-700 flex items-center gap-2 mt-2">
              <span className="font-semibold">Average:</span>
              <div className="flex gap-0.5">
                {renderStars(averageRatings[store.id] || 0)}
              </div>
              <span className="text-xs text-gray-500">
                ({averageRatings[store.id]?.toFixed(1) || "N/A"})
              </span>
            </div>

            <div className="text-sm text-gray-700 flex items-center gap-2 mt-1">
              <span className="font-semibold">Your Rating:</span>
              <div className="flex gap-0.5">
                {renderStars(userRatings[store.id] || 0)}
              </div>
              <span className="text-xs text-gray-500">
                ({userRatings[store.id]?.toFixed(1) || "Not rated"})
              </span>
            </div>

            <div className="mt-4 flex gap-2 items-center">
              <input
                type="number"
                min="0"
                max="5"
                step="0.1"
                placeholder="Rate 1.0 - 5.0"
                value={tempRatings[store.id] || ""}
                onChange={(e) => handleInputChange(store.id, e.target.value)}
                className="w-24 px-2 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                onClick={() => handleSubmitRating(store.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg shadow"
              >
                Submit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserDashboard;
