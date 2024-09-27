import axios from 'axios';

// Reusable function for uploading to Cloudinary
export const uploadToCloudinary = async (file: File) => {
  try {
    const data = new FormData();
    data.append("file", file);
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

    return response.data.secure_url;
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw new Error("Cloudinary upload failed");
  }
};
