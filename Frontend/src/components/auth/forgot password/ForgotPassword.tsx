import { useState } from 'react';
import { useFormik } from 'formik';
import { toast } from 'react-hot-toast';
import RoundLoader from '../common/RoundLoader';
import { useEssentials } from '../../../hooks/UseEssentials';
import { ForgotPassword } from '../../../redux/userStore/Authentication/AuthSlice';
import * as yup from 'yup';
import VerifyUserModal from './VerifyOTPModal';

const ForgotPasswordPage = () => {
  const { dispatch, auth } = useEssentials();
  const loading = auth.loading;
  const saved = auth.user?.email;
  const [otpModal, setOtpModal] = useState(false);

  const validateEmail = yup.object().shape({
    email: yup.string().email("Enter a valid email address").required("Enter an email id"),
    role: yup.string().oneOf(['host', 'rider'], "Select a valid role").required("Select a role"),
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      role: '',
    },
    validationSchema: validateEmail,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        dispatch(ForgotPassword({ email: values.email, role: values.role })).then((response: any) => {
          
          if (response.payload.status == 200) {
            setOtpModal(true);
          } else {
            console.log(response)
            const errorMessage = response.payload.message;
            console.log("Error: " + errorMessage);
            toast.error(errorMessage);
          }
        });
      } catch (error: any) {
        const errorMessage = error.message;
        toast.error(errorMessage);
      } finally {
        setSubmitting(false);
      }
    },
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
          <p className="text-center text-3xl font-bold">Forgot Password</p>
          <form className="flex flex-col pt-3 md:pt-8" onSubmit={formik.handleSubmit}>
            <div className="flex flex-col pt-4">
              <div className="focus-within:border-gray-500 mb-2 relative flex overflow-hidden border-2 transition rounded-md">
                <input
                  type="email"
                  name="email"
                  id="forgot-password-email"
                  className="w-full flex-1 appearance-none border-gray-400 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  placeholder="Enter your email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
              </div>
              {formik.touched.email && formik.errors.email ? (
                <span className="text-red-500 text-[12px] m-1 ps-1">{formik.errors.email}</span>
              ) : null}
            </div>
            <div className="flex flex-col pt-4">
              <div className="focus-within:border-gray-500 mb-2 relative flex overflow-hidden border-2 transition rounded-md">
                <select
                  name="role"
                  id="forgot-password-role"
                  className="w-full flex-1 appearance-none border-gray-400 bg-white px-4 py-3 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                  value={formik.values.role}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                >
                  <option value="" label="Select role" />
                  <option value="host" label="Host" />
                  <option value="rider" label="Rider" />
                </select>
              </div>
              {formik.touched.role && formik.errors.role ? (
                <span className="text-red-500 text-[12px] m-1 ps-1">{formik.errors.role}</span>
              ) : null}
            </div>
            <button
              type="submit"
              className="w-full rounded-lg mt-1 bg-indigo-600 hover:bg-indigo-700 px-4 py-2 text-center text-base font-semibold text-white shadow-md ring-gray-500 ring-offset-2 transition focus:ring-2"
              disabled={formik.isSubmitting}
            >
              {loading ? (
                <RoundLoader />
              ) : (
                `Send OTP`
              )}
            </button>
          </form>
          {otpModal && (
            <div className={`fixed top-0 left-0 w-full h-full ${otpModal ? "bg-black bg-opacity-80 backdrop-blur-md" : ""}`}>
              <VerifyUserModal role={formik.values.role} saved={saved} onClose={() => setOtpModal(false)} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
