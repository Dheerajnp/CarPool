import { useFormik } from 'formik';
import { validateUserLogin } from '../../validationSchema/user/loginSchema';
import { useEssentials } from '../../hooks/UseEssentials';
import { adminLogin } from '../../redux/adminStore/Authentication/AdminAuthSlice';
import { setCookie } from '../../functions/CalculateTime';
import toast, { Toaster } from 'react-hot-toast';

const AdminLoginForm = () => {
  const { dispatch,navigate } = useEssentials();
  const onSubmit = (values:any) => {
    const {email , password } = values;
    if(email && password) {
      dispatch(adminLogin({email,password})).then((response:any) => {
        if(response.payload.admin){
          setCookie('adminToken',response.payload.token);
          setCookie('adminRefreshToken',response.payload.refreshToken)
          navigate('/admin')
        }else{
          const errorMessage = response.payload.message;
                console.log("Error: " + errorMessage)
                toast.error(errorMessage);
        }
      })
      .catch((error:any)=>{
        const errorMessage = error.message;
        toast.error(errorMessage);
      })
    }
  };

  const { values, handleBlur, handleSubmit, handleChange, errors, touched } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema:validateUserLogin ,
    onSubmit,
  });
  return (
    <div>
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="mx-auto w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-50">Admin Dashboard</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Manage your application with our powerful admin tools.
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              autoComplete="email"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-indigo-500 px-3 py-2 ${touched.email && errors.email ? 'border-red-500' : ''}`}
              id="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
              required
              type="text"
            />
            {touched.email && errors.email ? (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            ) : null}
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              autoComplete="current-password"
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-50 dark:focus:border-indigo-500 px-3 py-2 ${touched.password && errors.password ? 'border-red-500' : ''}`}
              id="password"
              name="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
              required
              type="password"
            />
            {touched.password && errors.password ? (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            ) : null}
          </div>
          <div>
            <button
              className="flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:bg-indigo-500 dark:hover:bg-indigo-600 dark:focus:ring-indigo-600"
              type="submit"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminLoginForm