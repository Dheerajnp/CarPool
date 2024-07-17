import React from 'react';
import { Box } from '@mui/material';

interface TextInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  name: string;
}

const TextInput: React.FC<TextInputProps> = ({ id, label, value, onChange,name }) => (
  <Box className="flex flex-col mb-6">
    <label
      htmlFor={id}
      className="block text-gray-700 text-sm font-bold mb-2 dark:text-white"
    >
      {label}
    </label>
    <input
      id={id}
      type="text"
      name={name}
      className="shadow appearance-none border rounded w-full py-2 px-3  leading-tight focus:outline-none focus:shadow-outline bg-dark dark:bg-white dark:text-black dark:border-gray-600"
      value={value}
      onChange={onChange}
      required
    />
  </Box>
);

export default TextInput;
