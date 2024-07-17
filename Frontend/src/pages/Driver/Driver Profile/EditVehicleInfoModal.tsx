import React, { useState } from 'react';
import { Vehicle } from '../../../redux/userStore/Authentication/interfaces';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';

interface EditVehicleModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onSave: (updatedVehicle: Vehicle) => void;
}

const EditVehicleModal: React.FC<EditVehicleModalProps> = ({ vehicle, onClose, onSave }) => {
  const [formData, setFormData] = useState(vehicle);

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
        <h2 className="text-xl font-bold mb-4">Edit Vehicle Info</h2>
        <div className="grid grid-cols-1 gap-4">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            value={formData.brand}
            onChange={handleChange}
            className="dark:bg-black dark:text-white"
          />
          <Label htmlFor="model">Model</Label>
          <Input
            id="model"
            name="model"
            value={formData.model}
            onChange={handleChange}
            className="dark:bg-black dark:text-white"
          />
          <Label htmlFor="rcDocumentUrl">RC Document URL</Label>
          <Input
            type="file"
            id="rcDocumentUrl"
            name="rcDocumentUrl"
            onChange={handleChange}
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

export default EditVehicleModal;
