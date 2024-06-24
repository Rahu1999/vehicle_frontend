import React, { useEffect } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { SERVER_URL } from '@/config/constant';
import { Label } from "@/components/ui/label";
import { Check, ChevronsUpDown } from "lucide-react"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Driver, Vehicle, driverApiResponse, vehicleApiResponse } from '@/types/common.types';
import { cn } from '@/lib/utils';

interface AddDriverFormProps {
    setIsNew: (isNew: boolean) => void;
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

const AssignVehicle: React.FC<AddDriverFormProps> = ({ setIsNew }) => {

    const [selectedVehicle, setSelectedVehicle] = React.useState<Vehicle>();
    const [openVehicle, setOpenVehicle] = React.useState(false);
    const [vehicles, setVehicles] = React.useState<Vehicle[]>([]);

    const [selectedDriver, setSelectedDriver] = React.useState<Driver>();
    const [openDriver, setOpenDriver] = React.useState(false);
    const [drivers, setDrivers] = React.useState<Driver[]>([]);


    useEffect(() => {
        fetch(`${SERVER_URL}/vehicles/unassign`)
            .then(response => response.json())
            .then((data: vehicleApiResponse) => {
                if (data.status === 200) {
                    console.log("Vehicles data:", data.data.result);
                    setVehicles(data.data.result || []); // Ensure a default empty array if result is undefined
                } else {
                    console.error("Failed to fetch vehicles:", data);
                }
            })
            .catch(error => {
                console.error("Error fetching vehicles:", error);
            });
    }, []);

    useEffect(() => {
        fetch(`${SERVER_URL}/drivers`)
          .then(response => response.json())
          .then((data: driverApiResponse) => {
            if (data.status === 200) {
                setDrivers(data.data.result);
            } 
          })
          .catch(error => {

          });
      }, []);

    const initialValues: FormValues = {
        vehicleNumber: '',
        vehicleType: '',
        pucCertificate: null,
        insuranceCertificate: null
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
            console.log("result", result)
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
                            <Label className="font-semibold" >Select Vehicle</Label>
                            <div className={`mt-2 `} >
                                <Popover open={openVehicle} onOpenChange={setOpenVehicle}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openVehicle}
                                            className="w-[200px] justify-between"
                                        >
                                            {selectedVehicle
                                                ? vehicles.find((vehicle) => vehicle.vehicleNumber === selectedVehicle.vehicleNumber)?.vehicleNumber
                                                : "Select Vehicle..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search Vehicle..." />
                                            <CommandList>
                                                <CommandEmpty>No Vehicle found.</CommandEmpty>
                                                <CommandGroup>
                                                    {vehicles.map((vehicle) => (
                                                        <CommandItem
                                                            key={vehicle.vehicleNumber}
                                                            value={vehicle.vehicleNumber}
                                                            onSelect={(currentValue) => {
                                                                setSelectedVehicle(vehicle)
                                                                setOpenVehicle(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedVehicle?.vehicleNumber === vehicle.vehicleNumber ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {vehicle.vehicleNumber}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                            </div>
                        </div>
                        <div className="mb-4 md:mb-0">
                        <Label className="font-semibold" >Select Driver</Label>
                            <div className={`mt-2 `} >
                                <Popover open={openDriver} onOpenChange={setOpenDriver}>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            aria-expanded={openDriver}
                                            className="w-[200px] justify-between"
                                        >
                                            {selectedDriver
                                                ? drivers.find((driver) => driver.id === selectedDriver.id)?.name
                                                : "Select Driver..."}
                                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-[200px] p-0">
                                        <Command>
                                            <CommandInput placeholder="Search Driver..." />
                                            <CommandList>
                                                <CommandEmpty>No Driver found.</CommandEmpty>
                                                <CommandGroup>
                                                    {drivers.map((driver) => (
                                                        <CommandItem
                                                            key={driver.id}
                                                            value={driver.name}
                                                            onSelect={(currentValue) => {
                                                                setSelectedDriver(driver)
                                                                setOpenDriver(false)
                                                            }}
                                                        >
                                                            <Check
                                                                className={cn(
                                                                    "mr-2 h-4 w-4",
                                                                    selectedDriver?.id === driver.id ? "opacity-100" : "opacity-0"
                                                                )}
                                                            />
                                                            {driver.name}
                                                        </CommandItem>
                                                    ))}
                                                </CommandGroup>
                                            </CommandList>
                                        </Command>
                                    </PopoverContent>
                                </Popover>

                            </div>
                        </div>
                        <Button type="submit" className="self-center mt-5 w-full md:w-auto" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Assign Driver'}
                        </Button>
                    </Form>

                )}
            </Formik>
        </div>
    );
};

export default AssignVehicle;
