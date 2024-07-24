import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { Vehicle } from "../../../redux/userStore/Authentication/interfaces";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { Driver } from "../../../redux/driverStore/interfaces";

interface EditVehicleModalProps {
  vehicle: Vehicle;
  driver: Driver;
  onClose: () => void;
  onSave: (updatedVehicle: Vehicle) => void;
}

const validationSchema = Yup.object({
  brand: Yup.string().required("Brand is required"),
  model: Yup.string().required("Model is required"),
  vehicleNumber: Yup.string().required("Vehicle number is required"),
  rcDocumentUrl: Yup.mixed().required("RC document is required"),
});

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ vehicle, onClose, onSave,driver }) => {
  const [rcDocumentPreview, setRcDocumentPreview] = useState<string | null>(null);

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
    console.log("Submit", values);
    try {
      let rcDocumentUrl = values.rcDocumentUrl;
      if (values.rcDocumentUrl instanceof File) {
        const data = new FormData();
        data.append("file", values.rcDocumentUrl);
        data.append("upload_preset", "ij1csbqj");
        data.append("cloud_name", "dfwtb2qba");

        const response = await axios.post(
          "https://api.cloudinary.com/v1_1/dfwtb2qba/auto/upload",
          data,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        
        rcDocumentUrl = response.data.secure_url;
      }

      const updatedVehicle = {
        ...values,
        rcDocumentUrl,
      };

      console.log("updatedVehicle");
      console.log(updatedVehicle);
      // Save to backend
     const response = await axios.put(`/driver/addVehicle/${driver._id}`, updatedVehicle);

      if(response.data.status === 200) {
       
        onSave(updatedVehicle);
        toast.success("Vehicle information updated successfully!");
      }else{
        toast.error("Failed to add vehicle information. Please try again.");
      }

    } catch (error) {
      console.error("Error uploading RC document:", error);
      toast.error("Failed to update vehicle information. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-black p-8 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Vehicle Info</h2>
        <Formik
          initialValues={vehicle}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values, isSubmitting }) => (
            <Form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="brand">Brand</Label>
                <Field
                  id="brand"
                  name="brand"
                  as={Input}
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage
                  name="brand"
                  component="div"
                  className="text-red-600"
                />

                <Label htmlFor="model">Model</Label>
                <Field
                  id="model"
                  name="model"
                  as={Input}
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage
                  name="model"
                  component="div"
                  className="text-red-600"
                />

                <Label htmlFor="vehicleNumber">Vehicle Number</Label>
                <Field
                  id="vehicleNumber"
                  name="vehicleNumber"
                  as={Input}
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage
                  name="vehicleNumber"
                  component="div"
                  className="text-red-600"
                />

                <Label htmlFor="rcDocumentUrl">RC Document</Label>
                <Input
                  type="file"
                  id="rcDocumentUrl"
                  name="rcDocumentUrl"
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      setFieldValue,
                      setRcDocumentPreview,
                      "rcDocumentUrl"
                    )
                  }
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage
                  name="rcDocumentUrl"
                  component="div"
                  className="text-red-600"
                />
              </div>

              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Save"}
                </Button>
                <Button onClick={onClose} type="button">
                  Cancel
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default EditVehicleModal;
