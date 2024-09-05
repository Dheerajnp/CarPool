import React, { useState } from "react";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Formik, Form, ErrorMessage, Field } from "formik";
import * as Yup from "yup";
import { Label } from "../../../components/ui/label";
import { Input } from "../../../components/ui/input";
import { Button } from "../../../components/ui/button";
import { User } from "../../../redux/userStore/Authentication/interfaces";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import axiosApiGateway from "../../../functions/axios";

interface EditDocumentModalProps {
  document: { type: string; url: string; status: string };
  user: User;
  onClose: () => void;
  onSave: (updatedDocument: { type: string; url: string }) => void;
}

const validationSchema = Yup.object({
  type: Yup.string().required("Document type is required"),
  imageurl: Yup.mixed().required("Document image is required"),
});

const EditDocumentModal: React.FC<EditDocumentModalProps> = ({
  document,
  onClose,
  onSave,
  user,
}) => {
  const [documentPreview, setDocumentPreview] = useState<string | null>(
    document.url
  );

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
    try {
      let imageurl = values.imageurl;
      if (values.imageurl instanceof File) {
        const data = new FormData();
        data.append("file", values.imageurl);
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

        imageurl = response.data.secure_url;
      }

      const updatedDocument = {
        type:values.type,
        url: imageurl,
        status:'pending',
      };

      // Save to backend
      const response = await axiosApiGateway.put(
        `/user/updateDocument/${user._id}`,
        updatedDocument
      );
      if (response.data.status === 200) {
        onSave(updatedDocument);
        toast.success("Document information updated successfully!");
      } else {
        toast.error("Failed to update document information. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to update document information. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-black p-8 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Document Info</h2>
        <Formik
          initialValues={document}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form className="flex flex-col gap-4">
              <div className="grid grid-cols-1 gap-4">
                <Label htmlFor="type">Document Type</Label>
                <Select
                  onValueChange={(value) => setFieldValue("type", value)}
                  value={values.type}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="aadhar">Aadhar</SelectItem>
                    <SelectItem value="pan">PAN</SelectItem>
                    <SelectItem value="driving license">Driving License</SelectItem>
                  </SelectContent>
                </Select>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-600"
                />

                <Label htmlFor="imageurl">Document Image</Label>
                <Input
                  type="file"
                  id="imageurl"
                  name="imageurl"
                  onChange={(event) =>
                    handleFileChange(
                      event,
                      setFieldValue,
                      setDocumentPreview,
                      "imageurl"
                    )
                  }
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage
                  name="imageurl"
                  component="div"
                  className="text-red-600"
                />
              </div>

              {documentPreview && (
                <img
                  src={documentPreview}
                  alt="Document Preview"
                  className="mt-4"
                />
              )}

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

export default EditDocumentModal;
