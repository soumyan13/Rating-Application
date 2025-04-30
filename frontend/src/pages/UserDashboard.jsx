import React from "react";
import { useUserStore } from "../store/useStore";

const UserDashboard = () => {
  const { user } = useUserStore();

  return (
    <div>
      <h2>Welcome User: {user?.name}</h2>
    </div>
  );
};

export default UserDashboard;
