import AddDriverForm from "@/components/feature/add-driver";
import AddVehicleForm from "@/components/feature/add-vehicle";
import { DataTable } from "@/components/ui/data-table";
import { SERVER_URL } from "@/config/constant";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
interface Vehicle {
  id: number;
  vehicleNumber: string;
  vehicleType: string;
  pucCertificate: string;
  pucCertificateId: number;
  insuranceCertificate: string;
  insuranceCertificateId: number;
  isAssigned: boolean;
}

// Define the type for the API response
interface ApiResponse {
  status: number;
  data: {
    result: Vehicle[];
  };
}
export default function Vehicle() {
  const [isNew,setIsNew] = useState(false);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch(`${SERVER_URL}/vehicles`)
          .then(response => response.json())
          .then((data: ApiResponse) => {
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

      const columns: ColumnDef<Vehicle>[] = [
        {
          accessorKey: "vehicleNumber",
          header: "Vehicle Number",
        },
        {
          accessorKey: "vehicleType",
          header: "Vehicle Type",
        },
        {
            accessorKey: "pucCertificate",
            header: "PUC Certificate",
        },
        {
            accessorKey: "insuranceCertificate",
            header: "Insurance Certificate",
        },

      ]

    
      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error}</p>;
    return (
        <div className="container" >
            <AddVehicleForm setIsNew={setIsNew} />
            <DataTable columns={columns} data={vehicles} />
        </div>
    );
  }
  