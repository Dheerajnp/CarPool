import React from "react";
import { MdClose, MdDownload } from "react-icons/md";

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}

const ImageModal: React.FC<ImageModalProps> = ({ isOpen, onClose, imageUrl }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading the image:", error);
    }
  };


  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="fixed inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white rounded-lg shadow-lg z-10 p-6 w-full max-w-lg mx-auto relative">
        <button className="absolute top-3 right-3" onClick={onClose}>
          <MdClose size={24} />
        </button>
        <div className="flex flex-col items-center p-3">
          <img src={imageUrl} alt="Document" className="w-full h-full object-cover rounded-md mb-4" />
          <button
            onClick={handleDownload}
            className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            <MdDownload className="mr-2" />
            Download
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
