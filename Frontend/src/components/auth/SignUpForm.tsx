import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Toaster, toast } from 'react-hot-toast';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { ModeToggle } from "../../components/mode-toggle";
import GoogleButton from './common/GoogleButton';
import { Link } from 'react-router-dom';
import { useEssentials } from '../../hooks/UseEssentials';
import { register } from '../../redux/userStore/Authentication/AuthSlice';

// Validation schema
const basicSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: Yup.string()
    .nullable()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
});

const SignUpForm = () => {
  const roles = [
    { value: 'host', label: 'Driver', tooltip: 'Create Rides' },
    { value: 'rider', label: 'User', tooltip: 'Search for your rides' },
  ];

  const { dispatch, navigate } = useEssentials();
  const [role, setRole] = useState('rider');

  const handleRoleChange = (event: any) => {
    setRole(event.target.value);
  };

  const onSubmit = (values: any, { setSubmitting }: any) => {
    const { name, email, password } = values;
    dispatch(register({ name, email, password, role })).then((state: any) => {
      if (state.payload.status === 200) {
        navigate('/verifyotp');
      } else {
        const errorMessage = state.payload.message;
        toast.error(errorMessage);
        setSubmitting(false);
      }
    }).catch((error) => {
      const errorMessage = error.message;
      toast.error(errorMessage);
      setSubmitting(false);
    });
  };

  const { errors, values, touched, isSubmitting, handleSubmit, handleBlur, handleChange, submitCount } = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: basicSchema,
    onSubmit,
  });

  return (
    <div className="flex flex-wrap h-screen relative">
      <div className="absolute top-4 right-4 z-50">
        <ModeToggle />
      </div>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="flex w-full lg:w-1/2 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold">Sign up</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            <div className="flex justify-center ">
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
            <GoogleButton label="Up" role={role} />
            <div className="relative mt-4 flex h-px bg-gray-200 dark:bg-gray-700">
              <div className="absolute left-1/2 transform -translate-x-1/2 -translate-y-3.5 px-2 bg-white dark:bg-slate-950 text-gray-500 dark:text-gray-300 ">
                or
              </div>
            </div>
            <form className="flex flex-col items-center md:pt-4" onSubmit={handleSubmit}>
              <div className="grid gap-2 w-full pt-4">
                <div className="grid gap-1">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.name && touched.name && submitCount > 0 ? 'border-red-500' : ''}
                  />
                  {errors.name && touched.name && submitCount > 0 && <span className="text-red-500 font-thin text-[12px]">{errors.name}</span>}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="m@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.email && touched.email && submitCount > 0 ? 'border-red-500' : ''}
                  />
                  {errors.email && touched.email && submitCount > 0 && <span className="text-red-500 font-thin text-[12px]">{errors.email}</span>}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.password && touched.password && submitCount > 0 ? 'border-red-500' : ''}
                  />
                  {errors.password && touched.password && submitCount > 0 && <span className="text-red-500 font-thin text-[12px]">{errors.password}</span>}
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                    value={values.confirmPassword}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={errors.confirmPassword && touched.confirmPassword && submitCount > 0 ? 'border-red-500' : ''}
                  />
                  {errors.confirmPassword && touched.confirmPassword && submitCount > 0 && <span className="text-red-500 font-thin text-[12px]">{errors.confirmPassword}</span>}
                </div>
              </div>
              <CardFooter className="mt-4 w-full">
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  Sign Up
                </Button>
              </CardFooter>
            </form>
            <div className=" text-center">
              <p className="whitespace-nowrap text-gray-600">
                Already have an account?
                <Link to="/login" className="ms-2 underline-offset-4 font-semibold text-gray-900 underline dark:text-gray-500">
                  Log in.
                </Link> 
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="relative hidden lg:block min-h-screen select-none bg-black lg:w-1/2">
        <img
          className="absolute top-0 h-full w-full object-cover opacity-90"
          src="https://images.unsplash.com/photo-1636935529049-2078e9ee3e6c?q=80&w=1935&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Background"
        />
      </div>
    </div>
  );
};

export default SignUpForm;
