import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Formik, Form, ErrorMessage } from "formik";
import * as Yup from "yup";
import FileUpload from "./FileUpload";
import TextInput from "./TextInput";
import { useEssentials } from "../../../hooks/UseEssentials";
import { Button } from "../../ui/button";
import { ModeToggle } from "../../mode-toggle";

const validationSchema = Yup.object({
  vehicleBrand: Yup.string().required("Vehicle brand is required"),
  vehicleModel: Yup.string().required("Vehicle model is required"),
  frontLicense: Yup.mixed().required("Front license image is required"),
  backLicense: Yup.mixed().required("Back license image is required"),
  rcDocument: Yup.mixed().required("RC document is required"),
  vehicleNumber: Yup.string().required("Vehicle number is required")
});

const UploadLicenseForm = () => {
  const [frontLicensePreview, setFrontLicensePreview] = useState<string | null>(
    null
  );
  const [backLicensePreview, setBackLicensePreview] = useState<string | null>(
    null
  );
  const [rcDocumentPreview, setRcDocumentPreview] = useState<string | null>(
    null
  );

  const { auth, navigate } = useEssentials();
  let userId: string;
  if (auth.user) {
    userId = auth.user._id as string;
  }

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    setFieldValue: (field: string, value: any) => void,
    setPreview: React.Dispatch<React.SetStateAction<string | null>>,
    fieldName: string
  ) => {
    const file = event.target.files?.[0] || null;
    setFieldValue(fieldName, file);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (values: any, { setSubmitting }: any) => {
    setSubmitting(true);

    if (
      values.frontLicense &&
      values.backLicense &&
      values.rcDocument &&
      values.vehicleBrand &&
      values.vehicleModel &&
      values.vehicleNumber
    ) {
      const files = [values.frontLicense, values.backLicense, values.rcDocument];
      const uploadPromises = files.map((file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "ij1csbqj");
        data.append("cloud_name", "dfwtb2qba");
        return axios.post(
          "https://api.cloudinary.com/v1_1/dfwtb2qba/auto/upload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
      });

      try {
        const responses = await Promise.all(uploadPromises);
        const uploadedUrls = responses.map(
          (response) => response.data.secure_url
        );
        const licenseFrontUrl = uploadedUrls[0];
        const licenseBackUrl = uploadedUrls[1];
        const rcDocumentUrl = uploadedUrls[2];
        await axios
          .put(
            `/driver/upload-license/${userId}`,
            {
              licenseFrontUrl,
              licenseBackUrl,
              vehicleBrand: values.vehicleBrand,
              vehicleModel: values.vehicleModel,
              vehicleNumber : values.vehicleNumber,
              rcDocumentUrl,
            },
            {
              withCredentials: true,
            }
          )
          .then(() => {
            toast.success(
              "License and vehicle information uploaded successfully!"
            );
            navigate("/user");
          })
          .catch((error) => {
            console.error(error);
            toast.error(
              "Failed to upload license and vehicle information. Please try again."
            );
          });
      } catch (error) {
        console.error("Error uploading images:", error);
        toast.error(
          "Failed to upload license and vehicle information. Please try again."
        );
      }
    } else {
      toast.error("Please complete all fields and upload all required images.");
    }

    setSubmitting(false);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <Formik
        initialValues={{
          vehicleBrand: "",
          vehicleModel: "",
          frontLicense: null,
          backLicense: null,
          rcDocument: null,
          vehicleNumber: "",
        }}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ setFieldValue, values, handleChange, isSubmitting }) => (
          <Form className="flex flex-col gap-4">
            <div className="absolute top-4 right-4 z-50">
              <ModeToggle />
            </div>
            <div>
              <FileUpload
                label="Front of driving license"
                file={null}
                preview={frontLicensePreview}
                onChange={(event) =>
                  handleFileChange(
                    event,
                    setFieldValue,
                    setFrontLicensePreview,
                    "frontLicense"
                  )
                }
              />
              <ErrorMessage
                name="frontLicense"
                component="div"
                className="text-red-600"
              />
              <FileUpload
                label="Back of driving license"
                file={null}
                preview={backLicensePreview}
                onChange={(event) =>
                  handleFileChange(
                    event,
                    setFieldValue,
                    setBackLicensePreview,
                    "backLicense"
                  )
                }
              />
              <ErrorMessage
                name="backLicense"
                component="div"
                className="text-red-600"
              />
            </div>
            <div>
              <TextInput
                id="vehicle-brand"
                label="Vehicle Brand"
                name="vehicleBrand"
                value={values.vehicleBrand}
                onChange={handleChange}
              />
              <ErrorMessage
                name="vehicleBrand"
                component="div"
                className="text-red-600"
              />
              <TextInput
                id="vehicle-model"
                label="Vehicle Model"
                name="vehicleModel"
                value={values.vehicleModel}
                onChange={handleChange}
              />
              <ErrorMessage
                name="vehicleModel"
                component="div"
                className="text-red-600 mt-[-50px]"
              />
              <TextInput
                id="vehicle-number"
                label="Vehicle Number"
                name="vehicleNumber"
                value={values.vehicleNumber}
                onChange={handleChange}
              />
              <ErrorMessage
                name="vehicleNumber"
                component="div"
                className="text-red-600 mt-[-50px]"
              />
              <FileUpload
                label="RC Document"
                file={null}
                preview={rcDocumentPreview}
                onChange={(event) =>
                  handleFileChange(
                    event,
                    setFieldValue,
                    setRcDocumentPreview,
                    "rcDocument"
                  )
                }
              />
              <ErrorMessage
                name="rcDocument"
                component="div"
                className="text-red-600"
              />
            </div>
            <div className="col-span-1 md:col-span-2">
              <Button
                type="submit"
                className="w-full px-6 py-4 rounded-md text-sm bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:bg-indigo-700 dark:text-gray-100 dark:hover:bg-indigo-600 dark:focus:ring-indigo-700 dark:focus:border-indigo-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Uploading..." : "Upload License & Vehicle Details"}
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default UploadLicenseForm;
