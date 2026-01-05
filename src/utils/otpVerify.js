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


// verifyOtp.js
export const verifyOtpNew = async (mobileNo, otp) => {
  try {
    if (!otp) {
      return { success: false, error: "Please enter OTP" };
    }

    const data = {
      source: "HT SANYOJAN PORTAL",
      mobileNo,
      otp,
    };

    const response = await fetch(
      `https://resourceutils.mpcz.in:8888/MPCZ_OTP/api/otp/verifyOtpAll`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );


const result = await response.json();
console.log(result.message); // "Invalid OTP"
console.log(result.code);
    if (result.message =="Success" && result.code =="200" ) {
      return { success: true };
    } else {
      return { success: false, error: "Invalid OTP ❌" };
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return { success: false, error: "Something went wrong, please try again!" };
  }
};



