import React, { useEffect, useState } from "react";
import { useUserStore } from "../store/useStore";

const StoreOwnerDashboard = () => {
  const { user, storeDetails, fetchStoreDetails, updatePassword } =
    useUserStore();
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (user?.id) {
      fetchStoreDetails(user.id);
    }
  }, [user?.id, fetchStoreDetails]);

  const handlePasswordChange = async () => {
    if (!newPassword.trim()) return;

    const result = await updatePassword(user.id, newPassword);
    setMessage(result.message);
    if (result.success) setNewPassword("");
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome Store Owner: {user?.name}
      </h2>

      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Update Password</h3>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="border px-3 py-2 mr-2"
        />
        <button
          onClick={handlePasswordChange}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Update Password
        </button>
        {message && <p className="mt-2 text-green-600">{message}</p>}
      </div>

      {storeDetails ? (
        <div>
          <h3 className="text-xl font-semibold mb-2">Store Ratings</h3>
          <p className="mb-4">
            Average Rating:{" "}
            <span className="font-bold">
              {storeDetails.averageRating?.toFixed(1) || "N/A"}
            </span>
          </p>

          <h4 className="text-lg font-semibold mb-2">
            Users Who Rated Your Store:
          </h4>
          <ul className="list-disc pl-6">
            {storeDetails.ratings?.length > 0 ? (
              storeDetails.ratings.map((rating) => (
                <li key={rating.userId}>
                  {rating.userName} - {rating.rating} ⭐
                </li>
              ))
            ) : (
              <li>No ratings submitted yet.</li>
            )}
          </ul>
        </div>
      ) : (
        <p>Loading store details...</p>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;
