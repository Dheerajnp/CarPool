import { Toaster } from "react-hot-toast";
import UploadLicenseForm from "../../../components/driver/UploadLicense/UploadLicenseForm";

const UploadLicensePage = () => {
  console.log("Upload")
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-gray-800">
      <Toaster position="top-center" reverseOrder={false} />
      <div className="w-full max-w-2xl mx-auto my-8 p-4">
        <p className="text-center text-3xl font-bold mt-5 mb-5">
          Upload Driving License & Vehicle Details
        </p>
        <UploadLicenseForm />
      </div>
    </div>
  );
};

export default UploadLicensePage;
