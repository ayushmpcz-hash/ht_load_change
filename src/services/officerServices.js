import { HT_LOAD_CHANGE_BASE } from "../api/api";
import Cookies from "js-cookie";

export const refreshOfficerDashboard = async (employeeId) => {
  const token = Cookies.get("accessToken");

  if (!token) throw new Error("Access token missing");
  if (!employeeId) throw new Error("Employee ID missing");

  const res = await fetch(`${HT_LOAD_CHANGE_BASE}/officer-flags/`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      employee_id: employeeId,
    }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw err;
  }

  return res.json();
};
