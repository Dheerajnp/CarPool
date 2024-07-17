import React, { useState } from 'react';

import { Driver } from '../../../redux/userStore/Authentication/interfaces';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface EditDriverInfoModalProps {
  driver: Driver;
  onClose: () => void;
  onSave: (updatedDriver: Driver) => void;
}

const EditDriverInfoModal: React.FC<EditDriverInfoModalProps> = ({ driver, onClose, onSave }) => {
  const [formData, setFormData] = useState(driver);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-black p-8 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit Driver Info</h2>
        <div className="grid grid-cols-1 gap-4">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="dark:bg-black dark:text-white"
          />
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="dark:bg-black dark:text-white"
          />
          <div className="flex justify-end gap-2 mt-4">
            <Button onClick={handleSave}>Save</Button>
            <Button onClick={onClose}>Cancel</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditDriverInfoModal;
