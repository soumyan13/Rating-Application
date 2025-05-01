import React, { useEffect } from "react";
import { useUserStore } from "../store/useStore";

const StoreOwnerDashboard = () => {
  const { user, fetchStoreRatings, storeRatings } = useUserStore();

  useEffect(() => {
    if (storeRatings?.id) {
      fetchStoreRatings(storeRatings.id);
    }
  }, [storeRatings?.id, fetchStoreRatings]);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        Welcome Store Owner: {user?.name}
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
