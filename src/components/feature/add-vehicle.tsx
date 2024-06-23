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
  vehicleNumber: string;
  vehicleType: string;
  pucCertificate: File | null;
  insuranceCertificate: File | null;
}

const validationSchema = Yup.object({
  vehicleNumber: Yup.string().required('Vehicle Number is required'),
  vehicleType: Yup.string().required('Vehicle Type is required'),
  pucCertificate: Yup.mixed().required('PUC Certificate is required'),
  insuranceCertificate: Yup.mixed().required('Insurance Certificate  is required'),
});

const AddVehicleForm: React.FC<AddDriverFormProps> = ({setIsNew}) => {
  const initialValues: FormValues = {
    vehicleNumber: '',
    vehicleType: '',
    pucCertificate:  null,
    insuranceCertificate:  null
  };

  const handleSubmit = async (values: FormValues, { setSubmitting, resetForm }: any) => {
    const formData = new FormData();
    formData.append('vehicleNumber', values.vehicleNumber);
    formData.append('vehicleType', values.vehicleType);
    formData.append('pucCertificate', values.pucCertificate as Blob);
    formData.append('insuranceCertificate', values.insuranceCertificate as Blob);

    try {
      const response = await fetch(`${SERVER_URL}/vehicles`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      console.log("result",result)
      alert('Vehicle added successfully!');
      resetForm();
      setIsNew(true)
    } catch (error) {
      console.error('Error:', error);
      alert('There was an error adding the vehicle.');
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
          <label htmlFor="vehicleNumber" className="block text-sm mb-2 font-medium text-gray-700">
          Vehicle Number<span className="text-red-600 pl-2">*</span>
          </label>
          <Input
            id="vehicleNumber"
            name="vehicleNumber"
            type="text"
            placeholder="Enter Vehicle Number"
            value={values.vehicleNumber}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <ErrorMessage name="vehicleNumber" component="div" className="text-red-500 text-sm" />
        </div>
        <div className="mb-4 md:mb-0">
          <label htmlFor="vehicleType" className="block mb-2 text-sm font-medium text-gray-700">
          Vehicle Type<span className="text-red-600 pl-2">*</span>
          </label>
          <Input
            id="vehicleType"
            name="vehicleType"
            placeholder="Enter Vehicle Type"
            type="text"
            value={values.vehicleType}
            onChange={handleChange}
            onBlur={handleBlur}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
          />
          <ErrorMessage name="vehicleType" component="div" className="text-red-500 text-sm" />
        </div>
        <div className="mb-4 md:mb-0">
          <label htmlFor="pucCertificate" className="block text-sm font-medium text-gray-700">
          PUC Certificate <span className="text-red-600 pl-2">*</span>
          </label>
          <input
            id="pucCertificate"
            name="pucCertificate"
            type="file"
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.currentTarget.files) {
                setFieldValue('pucCertificate', event.currentTarget.files[0]);
              }
            }}
          />
          <ErrorMessage name="pucCertificate" component="div" className="text-red-500 text-sm" />
        </div>
        <div className="mb-4 md:mb-0">
          <label htmlFor="insuranceCertificate" className="block text-sm font-medium text-gray-700">
          Insurance Certificate <span className="text-red-600 pl-2">*</span>
          </label>
          <input
            id="insuranceCertificate"
            name="insuranceCertificate"
            type="file"
            accept="image/*"
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:border-blue-300"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (event.currentTarget.files) {
                setFieldValue('insuranceCertificate', event.currentTarget.files[0]);
              }
            }}
          />
          <ErrorMessage name="insuranceCertificate" component="div" className="text-red-500 text-sm" />
        </div>
        <Button type="submit" className="self-center mt-5 w-full md:w-auto" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Add Driver'}
        </Button>
      </Form>
      
      )}
    </Formik>
    </div>
  );
};

export default AddVehicleForm;
