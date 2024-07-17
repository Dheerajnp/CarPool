import React, { SetStateAction } from "react";
import { InputOTP,InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "../ui/input-otp";


interface IOTPInputProps {
  otp: string;
  setOtp: React.Dispatch<SetStateAction<string>>;
  setError: React.Dispatch<SetStateAction<string>>;
  length: number;
}

const OTP: React.FC<IOTPInputProps> = ({ length, otp, setOtp, setError }) => {
    const handleChange = (value: string) => {
        if (value.length === length) {
          setError("");
        }
        setOtp(value);
      };

  return (
    <InputOTP maxLength={length} onChange={handleChange}>
       <InputOTPGroup >
        <InputOTPSlot index={0} className="border border-gray-300 dark:border-gray-600"/>
        <InputOTPSlot index={1} className="border border-gray-300 dark:border-gray-600"/>
        <InputOTPSlot index={2} className="border border-gray-300 dark:border-gray-600"/>
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot index={3} className="border border-gray-300 dark:border-gray-600"/>
        <InputOTPSlot index={4} className="border border-gray-300 dark:border-gray-600"/>
        <InputOTPSlot index={5} className="border border-gray-300 dark:border-gray-600"/>
      </InputOTPGroup>
    </InputOTP>
  );
};

export default OTP;
