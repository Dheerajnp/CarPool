import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Driver } from "../../../redux/userStore/Authentication/interfaces";
import { saveLicenseInfo } from "../../../redux/driverStore/DriverSlice";
import { useEssentials } from "../../../hooks/UseEssentials";
import axios from "axios";

interface EditLicenseInfoModalProps {
  driver: Driver;
  onClose: () => void;
  onSave: (updatedDriver: Driver) => void;
}

const validationSchema = Yup.object({
  licenseFrontUrl: Yup.string().required("License Front URL is required"),
  licenseBackUrl: Yup.string().required("License Back URL is required"),
});

const EditLicenseInfoModal: React.FC<EditLicenseInfoModalProps> = ({
  driver,
  onClose,
  onSave,
}) => {
  const { dispatch,navigate } = useEssentials();
  const [licenseFrontUrl, setLicenseFrontUrl] = useState(
    driver.licenseFrontUrl || ""
  );
  const [licenseBackUrl, setLicenseBackUrl] = useState(
    driver.licenseBackUrl || ""
  );

  const handleSubmit = async(values: { licenseFrontUrl: string; licenseBackUrl: string }) => {
    
    if(values.licenseFrontUrl && values.licenseBackUrl){

        const files = [licenseFrontUrl,licenseBackUrl];
        const uploadedPromises = files.map((file)=>{
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
        })

        const updatedDriver = {
            ...driver,
            licenseFrontUrl: values.licenseFrontUrl,
            licenseBackUrl: values.licenseBackUrl,
          };
          try {
            const responses = await Promise.all(uploadedPromises);
            const uploadedUrls = responses.map(
              (response) => response.data.secure_url
            );
            const licenseFront = uploadedUrls[0];
            const licenseBack = uploadedUrls[1];
            dispatch(
                saveLicenseInfo({
                  driverId: driver._id,
                  licenseFrontUrl: licenseFront,
                  licenseBackUrl: licenseBack,
                })
              )
              .then(() => {
                toast.success(
                  "License and vehicle information uploaded successfully!"
                );
                onSave(updatedDriver);
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
    }else{
        toast.error("All fields are required");
    }
    
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg overflow-hidden shadow-lg w-full max-w-lg">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Edit License Info</h2>
        </div>
        <Formik
          initialValues={{
            licenseFrontUrl,
            licenseBackUrl,
          }}
          validationSchema={validationSchema}
          onSubmit={(values, { setSubmitting }) => {
            handleSubmit(values);
            setSubmitting(false);
          }}
        >
          {({ errors, touched, setFieldValue, values }) => (
            <Form className="p-4 space-y-4">
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="license-front">License Front</Label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFieldValue("licenseFrontUrl", e.target?.result as string);
                        setLicenseFrontUrl(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                />
                {licenseFrontUrl && (
                  <img
                    src={licenseFrontUrl}
                    alt="License Front"
                    className="w-32 h-32 object-cover"
                  />
                )}
              </div>
              {errors.licenseFrontUrl && touched.licenseFrontUrl && (
                <div className="text-red-600">{errors.licenseFrontUrl}</div>
              )}
              <div className="grid grid-cols-[auto_1fr] items-center gap-4">
                <Label htmlFor="license-back">License Back</Label>
                <Input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = (e) => {
                        setFieldValue("licenseBackUrl", e.target?.result as string);
                        setLicenseBackUrl(e.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  accept="image/*"
                />
                {licenseBackUrl && (
                  <img
                    src={licenseBackUrl}
                    alt="License Back"
                    className="w-32 h-32 object-cover"
                  />
                )}
              </div>
              {errors.licenseBackUrl && touched.licenseBackUrl && (
                <div className="text-red-600">{errors.licenseBackUrl}</div>
              )}
              <div className="flex justify-end p-4 border-t">
                <Button variant="secondary" onClick={onClose}>
                  Cancel
                </Button>
                <Button className="ml-2" type="submit">
                  Save
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditLicenseInfoModal;
