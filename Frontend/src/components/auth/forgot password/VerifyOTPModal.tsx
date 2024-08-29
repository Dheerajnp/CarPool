import React, { useState } from "react";
import toast from "react-hot-toast";
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../../ui/input-otp";
import { verifyOtpForgotPassword } from "../../../redux/userStore/Authentication/AuthSlice";
import { useEssentials } from "../../../hooks/UseEssentials";


interface IVerifyUserProps {
  saved?: string;
  onClose: () => void;
  role:string;
}

export const VerifyUserModal: React.FC<IVerifyUserProps> = ({ saved, onClose,role }) => {
  const { dispatch, navigate } = useEssentials();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleOtpChange = (value: string) => {
    setOtp(value);
    if (value.length === 6) {
      setError("");
    }
  };

  const handleSubmit = () => {
    if (otp.length !== 6 || !/^\d{6}$/.test(otp)) {
      setError("Enter valid OTP");
      return;
    }
    setError("");
    dispatch(verifyOtpForgotPassword({ email: saved as string, otp,role })).then((response: any) => {
      if (response.payload.status === 200) {
        toast.success(response.payload.message);
        setTimeout(() => {
          navigate("/forgotpassword/newpassword");
        }, 2000);
      } else {
        setError(response.payload.message);
        toast.error(response.payload.message);
      }
    });
  };

  const handleModalClose = () => {
    onClose();
  };

  return (
    <div className="w-full h-full bg-gray-500 bg-opacity-0 flex justify-center items-center">
      <div className="relative bg-white rounded-lg shadow-md p-8 flex flex-col justify-center items-center align-middle gap-4">
        <span className="text-lg font-bold">Enter OTP</span>
        <p className="text-sm text-gray-600 text-center">
          We have sent a verification code to your mobile number
        </p>
        <div className="flex justify-center gap-2 p-4 text-black">
          <InputOTP maxLength={6} value={otp} onChange={handleOtpChange}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <button
          className="w-full h-10 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-700 transition duration-300"
          type="submit"
          onClick={handleSubmit}
        >
          Verify
        </button>
        <button
          className="absolute aspect-square w-10 h-10 flex items-center justify-center right-0 bg-red-600 p-2 rounded-tr-md rounded-bl-sm top-0 shadow-md text-black"
          type="button"
          onClick={handleModalClose}
        >
          x
        </button>
        {error && <div className="text-red-500">{error}</div>}
      </div>
    </div>
  );
};

export default VerifyUserModal;
