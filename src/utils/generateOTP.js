
export const generateNewOTP = (time = 60000) => {
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // const otpExpires = new Date(Date.now() + 60000); // 1 minute from now
    const otpExpires = new Date(Date.now() + time); // 1 minute from now

    return {
        otp,
        otpExpires,
    };
};