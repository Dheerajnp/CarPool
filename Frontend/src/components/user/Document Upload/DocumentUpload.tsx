import React, { useState } from "react";
import { Toaster, toast } from 'react-hot-toast';
import axios from 'axios';
import { useEssentials } from "../../../hooks/UseEssentials";
import { ModeToggle } from "../../Common/mode-toggle";
import axiosApiGateway from "../../../functions/axios";

const DocumentUpload = () => {
  const [documentType, setDocumentType] = useState<string>("");
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const { auth, navigate } = useEssentials();
  let userId = auth.user?._id ? auth.user?._id : auth.user?.id

  const handleDocumentTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDocumentType(event.target.value);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    setFile(file);
    setFilePreview(file ? URL.createObjectURL(file) : null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!documentType || !file) {
      toast.error("Please select a document type and upload a file.");
      return;
    }

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "ij1csbqj");
    data.append("cloud_name", "dfwtb2qba");

    try {
      const response = await axios.post("https://api.cloudinary.com/v1_1/dfwtb2qba/auto/upload", data, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      const uploadedUrl = response.data.secure_url;

      await axiosApiGateway.put(`/user/upload-document/${userId}`, {
        documentType,
        documentUrl: uploadedUrl
      });

      toast.success("Document uploaded successfully!");
      
      navigate('/user')
    } catch (error) {
      console.error("Error uploading document:", error);
      toast.error("Failed to upload document. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-800  text-gray-800 dark:text-white">
      <div className="absolute top-2 right-2">
        <ModeToggle />
      </div>
      <Toaster />
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-lg shadow-md w-full max-w-md dark:border dark:border-gray-700 dark:shadow-2xl">
        <h2 className="text-2xl font-bold mb-6 text-center">Upload Government Document</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="documentType" className="block text-sm font-medium">
              Select Document Type
            </label>
            <select
              id="documentType"
              value={documentType}
              onChange={handleDocumentTypeChange}
              className="mt-1 block w-full bg-white dark:bg-gray-700  border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 text-gray-800 dark:text-white focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select</option>
              <option value="aadhar">Aadhar</option>
              <option value="pan">PAN</option>
              <option value="passport">Passport</option>
            </select>
          </div>
          <div>
            <label htmlFor="fileUpload" className="block text-sm font-medium">
              Upload Document
            </label>
            <input
              type="file"
              id="fileUpload"
              onChange={handleFileChange}
              className="mt-1 block w-full text-gray-800 dark:text-white"
            />
            {filePreview && (
              <div className="mt-2">
                <img src={filePreview} alt="Document Preview" className="h-40 w-auto object-cover rounded-md" />
              </div>
            )}
          </div>
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            >
              Upload
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;
