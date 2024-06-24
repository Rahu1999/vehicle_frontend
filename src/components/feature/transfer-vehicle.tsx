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
import { AssignedVehicle, AssignedVehicleApiResponse, Driver, Vehicle, driverApiResponse, vehicleApiResponse } from '@/types/common.types';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { getCurrentFormattedDate } from '@/utils/common';

interface AddDriverFormProps {
    setIsNew: (isNew: boolean) => void;
}


const TransferVehicle: React.FC<AddDriverFormProps> = ({ setIsNew }) => {

    const [selectedVehicle, setSelectedVehicle] = React.useState<AssignedVehicle>();
    const [openVehicle, setOpenVehicle] = React.useState(false);
    const [vehicles, setVehicles] = React.useState<AssignedVehicle[]>([]);
    const [vehicleError, setVehicleError] = React.useState(false);

    const [selectedDriver, setSelectedDriver] = React.useState<Driver>();
    const [openDriver, setOpenDriver] = React.useState(false);
    const [drivers, setDrivers] = React.useState<Driver[]>([]);
    const [driverError, setDriverError] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);




    useEffect(() => {
        fetch(`${SERVER_URL}/assign-vehicles`)
            .then(response => response.json())
            .then((data: AssignedVehicleApiResponse) => {
                if (data.status === 200) {
                    setVehicles(data.data.result);
                }
            })
            .catch(error => {

            });
    }, [isComplete]);

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
    }, [isComplete]);



    const handleSubmit = async () => {

        if (!selectedVehicle) {
            setVehicleError(true)
            return
        }
        if (!selectedDriver) {
            setDriverError(true)
            return
        }

        const data = {
            vehicleId: selectedVehicle.vehicle.id,
            fromDriverId: selectedVehicle.driver.id,
            toDriverId: selectedDriver.id
        }

        try {
            const response = await fetch(`${SERVER_URL}/transfers/transfer`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            toast(`Vehicle Transfer successfully!`, {
                description: getCurrentFormattedDate(),
                action: {
                    label: "Success",
                    onClick: () => console.info("Success"),
                },
            })
            setIsNew(true)
            setIsComplete(true)
        } catch (error) {
            console.error('Error:', error);
            toast.error(`${error}`)
        } finally {

        }
    };

    return (
        <div className='mb-3'>
            <div className="flex flex-col md:flex-row md:items-center md:gap-4 mt-4 ">
                <div className="mb-4 md:mb-0">
                    <Label className="font-semibold" >Select Vehicle</Label>
                    <div className={`mt-2 `} >
                        <Popover open={openVehicle} onOpenChange={setOpenVehicle}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={openVehicle}
                                    className="w-[300px] justify-between"
                                >
                                    {selectedVehicle
                                        ? (vehicles.find((vehicle) => vehicle.id === selectedVehicle.id)?.vehicle.vehicleNumber +"-" +
                                        vehicles.find((vehicle) => vehicle.id === selectedVehicle.id)?.driver.name)
                                        : "Select Vehicle..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
                                <Command>
                                    <CommandInput placeholder="Search Vehicle..." />
                                    <CommandList>
                                        <CommandEmpty>No Vehicle found.</CommandEmpty>
                                        <CommandGroup>
                                            {vehicles.map((vehicle) => (
                                                <CommandItem
                                                    key={vehicle.id}
                                                    value={vehicle.vehicle.vehicleNumber}
                                                    onSelect={(currentValue) => {
                                                        setSelectedVehicle(vehicle)
                                                        setOpenVehicle(false)
                                                        setVehicleError(false)
                                                    }}
                                                >
                                                    <Check
                                                        className={cn(
                                                            "mr-2 h-4 w-4",
                                                            selectedVehicle?.id === vehicle.id ? "opacity-100" : "opacity-0"
                                                        )}
                                                    />
                                                    {vehicle.vehicle.vehicleNumber} - {vehicle.driver.name}
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </CommandList>
                                </Command>
                            </PopoverContent>
                        </Popover>

                    </div>
                    {vehicleError ? <span className="text-red-500 text-sm" >Vehicle Required</span> : null}
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
                                    className="w-[300px] justify-between"
                                >
                                    {selectedDriver
                                        ? drivers.find((driver) => driver.id === selectedDriver.id)?.name
                                        : "Select Driver..."}
                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[300px] p-0">
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
                                                        setDriverError(false)
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
                    {driverError ? <span className="text-red-500 text-sm" >Driver Required</span> : null}
                </div>
                <Button type="submit" onClick={() => handleSubmit()} className="self-center mt-7 w-full md:w-auto" >
                    {'Transfer Driver'}
                </Button>
            </div>


        </div>
    );
};

export default TransferVehicle;
