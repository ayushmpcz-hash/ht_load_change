export const sendOtp = async (mobile) => {
  try {
    const data = {
      source: 'HT SANYOJAN PORTAL',
      mobileNo: mobile,
    };

    const response = await fetch(
      `https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/getOtp`,

      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      }
    );

    if (response.ok) {
      console.log('OTP sent successfully');
      return { success: true };
    } else {
      console.error('Failed to send OTP');
      return { success: false, error: 'OTP send failed' };
    }
  } catch (error) {
    console.error('Error sending OTP:', error);
    return { success: false, error };
  }
};

//using this func
export const sendOtpNew = async (mobileNo) => {
  try {
   const bodyData = {
      source: 'HT SANYOJAN PORTAL',
      mobileNo: mobileNo,
    };

    const response = await fetch(
      `https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/getOtp`,

      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData),
      }
    );
    const data = await response.json();

    if (data.message==="Success") {
      return {
        success: true,
        message: `OTP sent successfully to ****${mobileNo.slice(-4)}`
      };
    } else {
      return {
        success: false,
        message: `Failed to send OTP on ****${mobileNo.slice(-4)}`
      };
    }
  } catch (error) {
    return {
      success: false,
      message: "Something went wrong ❌"
    };
  }
};

//new func
// export const sendOtpNew = async (mobileNo) => {
//   try {
//     const response = await fetch(
//       `https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/getOtp`,
//       {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           source: 'HT SANYOJAN PORTAL',
//           mobileNo,
//         }),
//       }
//     );

//     const data = await response.json();

//     // ✅ success
//     if (data.code === "200" && data.message === "Success") {
//       return {
//         success: true,
//         type: "OTP_SENT",
//         message: `OTP sent successfully to ****${mobileNo.slice(-4)}`
//       };
//     }

//     // ❌ logical failure
//     return {
//       success: false,
//       type: "OTP_FAILED",
//       message: "Unable to send OTP right now. Please try again."
//     };

//   } catch (error) {
//     return {
//       success: false,
//       type: "NETWORK_ERROR",
//       message: "OTP service is unavailable. Please try later."
//     };
//   }
// };


