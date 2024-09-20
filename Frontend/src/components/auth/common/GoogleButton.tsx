import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";
import { useEssentials } from "../../../hooks/UseEssentials";
import axios from "axios";
import { googleLogin, login } from "../../../redux/userStore/Authentication/AuthSlice";
import { setCookie } from "../../../functions/CalculateTime";
import toast from "react-hot-toast";




export interface GoogleParams{
    label:string;
    role?:string;
}

const GoogleButton:React.FC<GoogleParams> = ({label,role}) => {
  const { navigate, dispatch } = useEssentials();
  const Glogin = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
            withCredentials: false,
          }
        );
        if (label === "In") {
          dispatch(login({ email: res.data.email as string, password: res.data.sub as string ,role:role as string }))
            .then((response: any) => {
              if (response.payload.user) {
                setCookie("token", response.payload.token);
                setCookie("refreshToken", response.payload.refreshToken);
                navigate("/");
              } else {
                const errorMessage = response.payload.message;
                console.log("Error: " + errorMessage);
                toast.error(errorMessage);
              }
            })
            .catch((error: any) => {
              const errorMessage = error.message;
              toast.error(errorMessage);
            });
        }else{
            console.log("data by google:",res.data)
            dispatch(googleLogin({email: res.data.email as string, password: res.data.sub as string, role:role as string , name: res.data.given_name as string})).then((response:any )=> {
                if(response.payload.user){
                    console.log("pppppppppppppppppppp",response.payload.user.role)
                    setCookie('token',response.payload.token)
                    setCookie('refreshToken',response.payload.refreshToken);
                    if(response.payload.user.role === "rider"){
                      navigate('/user/upload-document');
                    }else if(response.payload.user.role ==="host"){
                      navigate('/driver/upload-license')
                    }
                }else{
                    const errorMessage = response.payload.message;
                    console.log("Error: " + errorMessage);
                    toast.error(errorMessage);
                }
            })
            
        }
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      }
    },
  });
  return (
    <div>
      <button className="w-full mt-5 bg-white border border-gray-300 rounded-md py-3 text-center font-semibold flex justify-center hover:bg-indigo-300 "
      onClick={()=>Glogin()}
      >
        <FcGoogle className="size-6 mr-2" />
        <span className="mt-[0.5px]">Sign{label} with Google</span>
      </button>
    </div>
  );
};

export default GoogleButton;
