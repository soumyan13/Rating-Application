import React from "react";
import { useUserStore } from "../store/useStore";

const StoreOwnerDashboard = () => {
  const { user } = useUserStore();

  return (
    <div>
      <h2>Welcome Store Owner: {user?.name}</h2>
    </div>
  );
};

export default StoreOwnerDashboard;
