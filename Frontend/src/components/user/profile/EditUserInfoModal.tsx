import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { User } from '../../../redux/userStore/Authentication/interfaces';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import axiosApiGateway from '../../../functions/axios';
import toast from 'react-hot-toast';

interface EditUserInfoModalProps {
  user: User;
  onClose: () => void;
  onSave: (updatedUser: User) => void;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phone: Yup.string().required('Phone is required').matches(/^[0-9]+$/, 'Phone number is not valid').length(10,"need 10 digits"),
});

const EditUserInfoModal: React.FC<EditUserInfoModalProps> = ({ user, onClose, onSave }) => {
  const handleSave = async (values: { name: string; phone: string }) => {
    const { name, phone } = values;
    try {
      const response = await axiosApiGateway.put(`/user/updateInfo/${user._id}`, { name, phone });
      if (response.data.status === 200) {
        toast.success(response.data.message);
        onSave({ ...user, name, phone });
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error('Failed to update user information. Please try again.');
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
      <div className="bg-white dark:bg-black p-8 rounded-md w-96">
        <h2 className="text-xl font-bold mb-4">Edit User Info</h2>
        <Formik
          initialValues={{ name: user.name||"", phone: user?.phone || "NA" }}
          validationSchema={validationSchema}
          onSubmit={handleSave}
        >
          {({ isSubmitting }) => (
            <Form className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Field
                  as={Input}
                  id="name"
                  name="name"
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage name="name" component="div" className="text-red-600" />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Field
                  as={Input}
                  id="phone"
                  name="phone"
                  className="dark:bg-black dark:text-white"
                />
                <ErrorMessage name="phone" component="div" className="text-red-600" />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save'}
                </Button>
                <Button type="button" onClick={onClose}>
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

export default EditUserInfoModal;
