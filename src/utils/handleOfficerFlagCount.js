import axios from "axios";
import Cookies from "js-cookie";
import { HT_LOAD_CHANGE_BASE } from "../api/api";

export const handleOfficerFlagCount = async () => {
  try {
    const token = Cookies.get("accessToken");

    if (!token) {
      console.error("Access token missing");
      return null;
    }

    const response = await axios.get(
      `${HT_LOAD_CHANGE_BASE}/officer-flags-jwt/`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // ✅ backend se jo bhi count / flags aa rahe honge
    return response.data;

  } catch (error) {
    console.error("Officer Flag API Error:", error);
    return null;
  }
};
