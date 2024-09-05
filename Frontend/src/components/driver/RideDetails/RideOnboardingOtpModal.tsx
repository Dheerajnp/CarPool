import { useState } from "react";

const  OtpInput = ({ onComplete }: { onComplete: (otp: string) => void }) => {
    const [otp, setOtp] = useState(["", "", "", ""]);
  
    const handleChange = (element: HTMLInputElement, index: number) => {
      if (isNaN(Number(element.value))) return false;
  
      setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
  
      if (element.nextSibling && element.value !== "") {
        (element.nextSibling as HTMLInputElement).focus();
      }
  
      if (index === 3 && element.value !== "") {
        onComplete(otp.join("") + element.value);
      }
    };
  
    return (
      <div className="flex justify-center gap-2">
        {otp.map((data, index) => (
          <input
            key={index}
            type="text"
            maxLength={1}
            className="w-12 h-12 text-center text-2xl border rounded-md focus:outline-none focus:border-blue-500"
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
          />
        ))}
      </div>
    );
  };

  export default OtpInput;