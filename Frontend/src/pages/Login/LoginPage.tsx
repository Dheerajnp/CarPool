import { Label } from "@radix-ui/react-label";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ModeToggle } from "../../components/mode-toggle";
import GoogleButton from "../../components/auth/common/GoogleButton";
import { login } from "../../redux/userStore/Authentication/AuthSlice";
import { useEssentials } from "../../hooks/UseEssentials";
import { setCookie } from "../../functions/CalculateTime";
import toast from "react-hot-toast";
import { useState } from "react";

// Validation schema using Yup
const validateUserLogin = Yup.object().shape({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});



const LoginPage = () => {

  const roles = [
    { value: 'host', label: 'Driver', tooltip: 'Create Rides' },
    { value: 'rider', label: 'User', tooltip: 'Search for your rides' },
  ];
  const [role, setRole] = useState('rider');

  const handleRoleChange = (event: any) => {
    setRole(event.target.value);
  };


  const{ navigate,dispatch } = useEssentials();
  const onSubmit = () => {
    const { email, password } = values;
    if (email && password) {
      
      dispatch(login({ email, password, role })).then((response: any) => {
        if (response.payload.user) {
          setCookie('token', response.payload.token);
          setCookie('refreshToken', response.payload.refreshToken);
          navigate('/user');
        } else {
          const errorMessage = response.payload.message;
          console.log("Error: " + errorMessage)
          toast.error(errorMessage);
        }
      })
     .catch((error: any) => {
        const errorMessage = error.message;
        toast.error(errorMessage);
      })
    }
  };

  const { values, errors, touched, handleBlur, handleSubmit, handleChange, submitCount } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: validateUserLogin,
    onSubmit
  });

  return (
    <div className="flex flex-wrap overflow-hidden h-screen relative">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <div className="relative hidden lg:block h-screen select-none bg-black lg:w-1/2">
        <img
          className="-z-1 absolute top-0 h-full w-full object-cover opacity-90"
          src="https://images.pexels.com/photos/20511397/pexels-photo-20511397/free-photo-of-interior-of-a-lamborghini-urus.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
      </div>
      <div className="flex w-full flex-col justify-center items-center lg:w-1/2 px-3">
        <Card className="w-full max-w-md mx-auto my-auto flex flex-col justify-center">
          <CardHeader>
            <CardTitle className="text-center text-3xl font-bold">Welcome back</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4">
          <div className="flex justify-center mt-4">
              <div className="relative flex flex-wrap rounded-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg p-1.5 w-72 text-sm">
                {roles.map((option) => (
                  <label key={option.value} className="flex-1 text-center cursor-pointer relative group">
                    <input
                      type="radio"
                      name="role"
                      value={option.value}
                      checked={role === option.value}
                      onChange={handleRoleChange}
                      className="hidden"
                    />
                    <span
                      className={`block w-full py-2 ${
                        role === option.value
                          ? 'bg-purple-700 text-white rounded-sm'
                          : 'bg-transparent text-black dark:text-white'
                      }`}
                    >
                      {option.label}
                    </span>
                    <div className="absolute opacity-0 group-hover:opacity-100 group-hover:text-white group-hover:text-sm group-hover:-translate-y-[100px] duration-500 bg-gray-300 dark:bg-gray-600 text-white rounded-md px-3 py-1">
                      {option.tooltip}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          <GoogleButton label='In' role=""/>
            <div className="relative mt-1 flex h-px bg-gray-200 dark:bg-gray-700">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-3.5 px-2 bg-white dark:bg-slate-950 text-gray-500 dark:text-gray-300">
                or
              </div>
            </div>
            <form className="flex flex-col pt-3 md:pt-8" onSubmit={handleSubmit}>
              <div className="grid gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email && submitCount > 0 ? "border-red-500" : ""}
                  />
                  {errors.email && touched.email && submitCount > 0 && <span className="text-red-500 font-thin text-[12px]">{errors.email}</span>}
                </div>
                <div className="grid">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.password && touched.password && submitCount > 0 ? "border-red-500" : ""}
                  />
                  {errors.password && touched.password && submitCount > 0 && <span className="text-red-500 font-thin text-[12px] p-0">{errors.password}</span>}
                </div>
              </div>
              <div className="py-2 text-right px-3">
                <a href="/forgotpassword" className="font-semibold whitespace-nowrap text-gray-600">
                  Forgot your password?
                </a>
              </div>
              <CardFooter>
                <Button type="submit" className="w-full">Log in</Button>
              </CardFooter>
            </form>
            <div className="py-2 text-center">
              <p className="whitespace-nowrap text-gray-600">
                Don't have an account?
                <a href="/signup" className="ms-2 underline-offset-4 font-semibold text-gray-900 dark:text-gray-500 underline">
                  Sign up for free.
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
