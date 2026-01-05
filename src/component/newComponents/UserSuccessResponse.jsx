import { NavLink, useLocation, useParams } from "react-router-dom";

const UserSuccessResponse = () => {
  const location = useLocation();
  const { id } = useParams(); // 👈 URL se id

  const {
    title = "Success",
    message = "Request submitted successfully",
    subMessage = "We’ll be in touch shortly!",
    showDashboard = true,
    showPending = false,
    pendingRoute = "/pending-applications",
  } = location.state || {};

  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900 bg-gray-300 p-3 rounded-md shadow-md">
        {title} (ID: {id})
      </h2>

      <div className="bg-white p-14 rounded shadow-md w-full text-center">
        <div className="rounded-full h-[200px] w-[200px] bg-[#F8FAF5] flex items-center justify-center mx-auto">
          <span className="text-[#9ABC66] text-[100px]">✓</span>
        </div>

        <h1 className="text-[#88B04B] font-black text-[40px] mt-4 mb-2">
          {message}
        </h1>

        <p className="text-[#404F5E] text-[20px]">
          {subMessage}
        </p>

        <div className="mt-10 flex justify-center gap-4 flex-wrap">
          {showDashboard && (
            <NavLink
              to="/user-dashboard"
              className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-green-600"
            >
              Dashboard
            </NavLink>
          )}

          {showPending && (
            <NavLink
              to={pendingRoute}
              className="rounded-lg px-4 py-2 bg-blue-500 text-white hover:bg-green-600"
            >
              Show Pending Applications
            </NavLink>
          )}
        </div>
      </div>
    </>
  );
};

export default UserSuccessResponse;
