import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";
import { toast } from "react-toastify";

const StoreOwnerDashboard = () => {
  const { user, fetchStoreRatings, storeRatings, updatePassword } =
    useUserStore();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user?.storeId) {
      fetchStoreRatings(user.storeId);
    }
  }, [user?.storeId, fetchStoreRatings]);

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

  return (
    <div className="p-6 mt-20 relative">
      <div className="absolute right-6 top-6">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 shadow"
          onClick={() => setShowPasswordForm((prev) => !prev)}
        >
          {showPasswordForm ? "Cancel" : "Update Password"}
        </button>

        {showPasswordForm && (
          <form
            onSubmit={handlePasswordUpdate}
            className="mt-2 bg-white border shadow-lg p-4 rounded-xl w-72 space-y-3"
          >
            <h3 className="font-bold text-lg text-gray-700">Change Password</h3>

            <input
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
            >
              Submit
            </button>
          </form>
        )}
      </div>

      <h2 className="text-2xl font-bold mb-4">
        Welcome Store Owner:{" "}
        <span className="text-5xl text-blue-800">{user?.name}</span>
      </h2>

      <div>
        <h3 className="text-xl font-semibold mb-4">Store Ratings</h3>
        {storeRatings.length > 0 ? (
          <ul className="space-y-3">
            {storeRatings.map((rating) => (
              <li key={rating.id} className="p-4 border rounded">
                <p>
                  <strong>User:</strong> {rating.userName}
                </p>
                <p>
                  <strong>Email:</strong> {rating.userEmail}
                </p>
                <p>
                  <strong>Rating:</strong> {rating.rating} ⭐
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ratings submitted yet.</p>
        )}
      </div>
    </div>
  );
};

export default StoreOwnerDashboard;
