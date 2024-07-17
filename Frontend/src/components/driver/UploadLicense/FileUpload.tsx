import React from 'react';
import { Box } from '@mui/material';

interface FileUploadProps {
  label: string;
  file: File | null;
  preview: string | null;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ label, file, preview, onChange }) => (
  <Box className="flex flex-col mb-6">
    <label
      htmlFor={label}
      className="p-5 text-gray-800 flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-100 hover:bg-gray-200 relative"
    >
      {preview && (
        <img src={preview} alt={`${label} Preview`} className="absolute inset-0 w-full h-full object-cover opacity-75" />
      )}
      <div className="flex flex-col items-center justify-center pt-5 pb-6">
        <svg
          className="w-8 h-8 mb-4 text-gray-500"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 20 16"
        >
          <path
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
          />
        </svg>
        <p className="mb-2 text-sm text-gray-500">
          <span className="font-semibold">Click to upload</span> or drag and drop
        </p>
        <p className="text-xs text-gray-500">{label} (MAX. 800x400px)</p>
      </div>
      <input
        id={label}
        type="file"
        className="hidden"
        onChange={onChange}
      />
    </label>
  </Box>
);

export default FileUpload;
