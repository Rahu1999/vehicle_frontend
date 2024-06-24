import { DataTable } from "@/components/ui/data-table";
import { SERVER_URL } from "@/config/constant";
import { AssignedVehicle, AssignedVehicleApiResponse } from "@/types/common.types";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import AssignVehicle from "../form/assign-vehicle";

// Define the type for the API response
export default function Assigned() {
  const [isNew, setIsNew] = useState(false);
  const [vehicles, setVehicles] = useState<AssignedVehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    fetch(`${SERVER_URL}/assign-vehicles`)
      .then(response => response.json())
      .then((data: AssignedVehicleApiResponse) => {
        if (data.status === 200) {
          setVehicles(data.data.result);
        } else {
          setError('Failed to fetch data');
        }
        setLoading(false);
      })
      .catch(error => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, [isNew]);

  const columns: ColumnDef<AssignedVehicle>[] = [
    {
      accessorKey: "vehicle.vehicleNumber",
      header: "Vehicle Number",
    },
    {
      accessorKey: "vehicle.vehicleType",
      header: "Vehicle Type",
    },
    {
      accessorKey: "vehicle.pucCertificate",
      header: "PUC Certificate",
    },
    {
      accessorKey: "vehicle.insuranceCertificate",
      header: "Insurance Certificate",
    },
    {
      accessorKey: "driver.name",
      header: "Driver Name",
    },
    {
      accessorKey: "driver.phoneNumber",
      header: "Phone Number ",
    },

  ]

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;
  return (
    <div className="container" >
      <AssignVehicle setIsNew={setIsNew} />
      <DataTable columns={columns} data={vehicles} />
    </div>
  );
}
