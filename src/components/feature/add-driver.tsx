import React from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SERVER_URL } from '@/config/constant';

interface AddDriverFormProps {
  setIsNew:(isNew:boolean)=> void;
}

interface FormValues {
  name: string;
  phoneNumber: string;
  profilePhoto: File | null;
}

const validationSchema = Yup.object({
  name: Yup.string().required('Name is required'),
  phoneNumber: Yup.string().required('Phone number is required'),
  profilePhoto: Yup.mixed().required('Profile photo is required'),
});

const AddDriverForm: React.FC<AddDriverFormProps> = ({setIsNew}) => {
  const initialValues: FormValues = {
    name: '',
    phoneNumber: '',
    profilePhoto: null,
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    const formData = new FormData();
    formData.append('name', values.name);
    formData.append('phoneNumber', values.phoneNumber);
    formData.append('file', values.profilePhoto as Blob);

    try {
      const response = await fetch(`${SERVER_URL}/drivers`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log("result",result)
      alert('Driver added successfully!');
      resetForm();
      setIsNew(true)
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error adding the driver.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className='mb-3'>
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
      
    >
      {({ setFieldValue, handleChange, handleBlur, values, isSubmitting }) => (
        <Form className="flex flex-col md:flex-row md:items-center md:gap-4 mt-4 ">
        <div className="mb-4 md:mb-0">
          <label htmlFor="name" className="block text-sm mb-2 font-medium text-gray-700">
            Name<span className="text-red-600 pl-2">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            placeholder="Enter Driver Name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <ErrorMessage name="name" component="div" className="text-red-500 text-sm" />
        </div>
        <div className="mb-4 md:mb-0">
          <label htmlFor="phoneNumber" className="block mb-2 text-sm font-medium text-gray-700">
            Phone Number<span className="text-red-600 pl-2">*</span>
          </label>
          <Input
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter Phone number"
            type="text"
            value={values.phoneNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <ErrorMessage name="phoneNumber" component="div" className="text-red-500 text-sm" />
        </div>
        <div className="mb-4 md:mb-0">
          <label htmlFor="profilePhoto" className="block text-sm font-medium text-gray-700">
            Profile Photo <span className="text-red-600 pl-2">*</span>
          </label>
          <input
            id="profilePhoto"
            name="profilePhoto"
            type="file"
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.currentTarget.files) {
                setFieldValue('profilePhoto', event.currentTarget.files[0]);
              }
            }}
          />
          <ErrorMessage name="profilePhoto" component="div" className="text-red-500 text-sm" />
        </div>
        <Button type="submit" className="self-center mt-5 w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Driver'}
        </Button>
      </Form>
      
      )}
    </Formik>
    </div>
  );
};

export default AddDriverForm;
