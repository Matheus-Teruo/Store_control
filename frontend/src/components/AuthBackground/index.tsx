import { Outlet } from "react-router-dom";

function AuthBackground() {
  return (
    <div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default AuthBackground;
