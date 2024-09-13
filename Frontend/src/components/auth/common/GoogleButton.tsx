import React from "react";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../../ui/button"; 

export interface GoogleParams {
  label: string;
  role:string
}

const GoogleButton: React.FC<GoogleParams> = ({ label,role }) => {
  const Glogin = () => {
    // Mock function for login, replace with actual logic
    console.log(role)
    console.log(`Mock ${label} with Google clicked`);
  };

  return (
    <div>
      <Button
        variant="outline"
        className="w-full mt-5 flex items-center justify-center"
        onClick={Glogin}
      >
        <FcGoogle className="mr-2" />
        <span className="mt-0.5">Sign{label} with Google</span>
      </Button>
    </div>
  );
};

export default GoogleButton;
