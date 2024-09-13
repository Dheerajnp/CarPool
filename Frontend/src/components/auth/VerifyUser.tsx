import  { useState, useEffect, useMemo } from "react";
import { useEssentials } from "../../hooks/UseEssentials";
import { verifyOtpThunk } from "../../redux/userStore/Authentication/AuthSlice";
import OTP from "./OTP";
import { ModeToggle } from "../mode-toggle";

const VerifyUser = ({ savedId }: { savedId: string}) => {
  const { dispatch, navigate } = useEssentials();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [resendAvailable, setResendAvailable] = useState(false);

  const handleSubmit = () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Enter valid OTP");
      return;
    }
    setError("");
    dispatch(verifyOtpThunk({ savedId, otp })).then((response: any) => {
      if (response.payload.user) {
        let role = response.payload.user.role;
        if (role === 'rider') {
          navigate('/user/upload-document');
        } else if (role === 'host') {
          navigate('/driver/upload-license');
        }
      } else {
        setError(response.payload.message);
      }
    });
  };

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setResendAvailable(true);
    }
  }, [timeLeft]);

  const resendOTP = () => {
    setTimeLeft(60);
    setResendAvailable(false);
    // Add your API call or submission logic here
  };

  return (
    <section className="h-screen w-screen flex flex-col justify-center items-center bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-md shadow-md w-96">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
        <h2 className="text-2xl mb-4 text-center">Verify OTP</h2>
        <p className="text-gray-600 dark:text-gray-300 mb-8 text-center">
          An OTP has been sent to your email address, kindly enter it here
        </p>
        <div className="justify-center ms-4">
        {useMemo(
          () => (
            <OTP length={6} otp={otp} setOtp={setOtp} setError={setError} />
          ),
          [otp]
        )}
        </div>
        {error && <div className="text-red-500">{error}</div>}
        {resendAvailable ? (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
            onClick={resendOTP}
          >
            Resend OTP
          </button>
        ) : (
          <p className="text-center mt-4">Resend OTP in {timeLeft}s</p>
        )}
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md w-full mt-4"
          onClick={handleSubmit}
        >
          Submit OTP
        </button>
      </div>
    </section>
  );
};

export default VerifyUser;
