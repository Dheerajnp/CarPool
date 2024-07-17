
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useEssentials } from '../../../hooks/UseEssentials';
import { resetPassword, resetState } from '../../../redux/userStore/Authentication/AuthSlice';
import toast, { Toaster } from 'react-hot-toast';
import { removeCookie } from '../../../functions/CalculateTime';

const NewPassword = () => {
  const { auth, navigate, dispatch } = useEssentials();
  const email = auth.user?.email;
  const role = auth.user?.role;

  const onSubmit = async(values:any, { setSubmitting }:any)=>{
    const { newPassword, confirmNewPassword } = values;
    try {
      if(newPassword !== confirmNewPassword){
        toast.error('Passwords do not match');
        return;
      }
      const password = newPassword;
      if(email&&role){
        dispatch(resetPassword({password,email,role})).then((response:any)=>{
          if(response.payload.status === 200){
            toast.success(response.payload.message);
            setTimeout(()=>{
              removeCookie("token");
              removeCookie("refreshToken");
              dispatch(resetState());
              navigate("/user/login");
            },1000)
            
          }
        })
      }else{
        toast.error('Enter the email id again')
        navigate('/forgotpassword')
      }
    } catch (error: any) {
      console.log(error)
      const errorMessage = error.message;
      toast.error(errorMessage);
    } finally {
      console.log(values);
      setSubmitting(false);
    }
      
      
  }

  const {values, errors, touched, handleBlur, handleSubmit, handleChange , isSubmitting,isValid} = useFormik({
    initialValues: {
      newPassword: '',
      confirmNewPassword: '',
    },
    validationSchema: Yup.object().shape({
      newPassword: Yup.string()
       .min(8, "password must at least be 8 characters")
       .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain at least one symbol")
       .matches(/[0-9]/, "Password must contain at least one number")
       .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
       .matches(/[a-z]/, "Password must contain at least one lowercase letter"),
      confirmNewPassword: Yup.string()
       .required('Confirm new password is required')
       .oneOf([Yup.ref('newPassword')], 'Passwords must match'),
    }),
    onSubmit
  });



  return (
    <div className="flex flex-wrap overflow-hidden">
      <div className="relative hidden h-screen select-none bg-black md:block md:w-1/2">
        <img
          className="-z-1 absolute top-0 h-full w-full object-cover opacity-90"
          src="https://images.pexels.com/photos/20511397/pexels-photo-20511397/free-photo-of-interior-of-a-lamborghini-urus.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
        />
      </div>
      <div className="flex w-full flex-col md:w-1/2">
        <div className="lg:w-[28rem] mx-auto my-auto flex flex-col justify-center pt-8 md:justify-center md:px-6 md:pt-0">
          <p className="text-center text-3xl font-bold">New Password</p>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col pt-4">
              <Toaster
                position="top-center"
                reverseOrder={false}
              />
              <div className="focus-within:border-gray-500 relative flex overflow-hidden border-2 transition rounded-md">
                <input
                  type="password"
                  name="newPassword"
                  id="newPassword"
                  className="w-full flex-1 appearance-none border-gray-400 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Enter new password"
                  value={values.newPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.newPassword && errors.newPassword? (
                <div className="text-red-500 text-[12px] mt-1 ps-1">{errors.newPassword}</div>
              ) : null}
            </div>
            <div className="flex flex-col pt-4">
              <div className="focus-within:border-gray-500 relative flex overflow-hidden border-2 transition rounded-md">
                <input
                  type="password"
                  name="confirmNewPassword"
                  id="confirmNewPassword"
                  className="w-full flex-1 appearance-none border-gray-400 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Confirm new password"
                  value={values.confirmNewPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
               />
              </div>
              {touched.confirmNewPassword && errors.confirmNewPassword? (
                <div className="text-red-400 text-[11px]  ps-1 mt-3">{errors.confirmNewPassword}</div>
              ) : null}
            </div>
            <button
              type="submit"
              disabled={isSubmitting ||!isValid}
              className="w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 mt-3 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2"
            >
              {isSubmitting? 'Submitting...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};


export default NewPassword;