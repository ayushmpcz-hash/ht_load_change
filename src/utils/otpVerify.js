export const verifyOtp = async (mobileNo, otp) => {
  try {
    let data = {
      source: 'HT SANYOJAN PORTAL',
      mobileNo: mobileNo,
      otp: otp,
    };

    const response = await fetch(
      `https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/verifyOtpAll`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      console.log('OTP Sccessfully Matched');
      return { success: true };
    } else {
      console.error('connote Matched otp');
      return { success: false, error: 'OTP send failed' };
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error };
  }
};


// // verifyOtp.js using this
// export const verifyOtpNew = async (mobileNo, otp) => {
//   try {
//     if (!otp) {
//       return { success: false, error: "Please enter OTP" };
//     }

//     const data = {
//       source: "HT SANYOJAN PORTAL",
//       mobileNo,
//       otp,
//     };

//     const response = await fetch(
//       `https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/verifyOtpAll`,
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(data),
//       }
//     );


// const result = await response.json();
// console.log(result.message); // "Invalid OTP"
// console.log(result.code);
//     if (result.message =="Success" && result.code =="200" ) {
//       return { success: true };
//     } else {
//       return { success: false, error: "Invalid OTP ❌" };
//     }
//   } catch (error) {
//     console.error("Error verifying OTP:", error);
//     return { success: false, error: "Something went wrong, please try again!" };
//   }
// };

//new function
// VERIFY OTP
export const verifyOtpNew = async (mobileNo, otp) => {
  try {
    if (!otp) return { success: false, error: "Please enter OTP" };

    const res = await fetch(
      "https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/verifyOtpAll",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "HT SANYOJAN PORTAL",
          mobileNo,
          otp,
        }),
      }
    );

    const data = await res.json();

    if (data.code === "200") return { success: true };

    if (data.code === "609")
      return { success: false, error: "You entered an incorrect OTP. Please enter the correct OTP and verify again." };

    if (data.code === "640")
      return { success: false, error: "OTP expired. Please resend OTP." };

    return { success: false, error: data.message };
  } catch {
    return { success: false, error: "OTP verification service is currently unavailable. Please try again later. failed. Try again." };
  }
};

