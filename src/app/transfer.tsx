import TransferVehicle from "@/components/feature/transfer-vehicle";
import { DataTable } from "@/components/ui/data-table";
import { SERVER_URL } from "@/config/constant";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
interface Transfer {
  id: number;
  transferDate: string;
  createdAt: string;
  updatedAt: string;
  vehicle: {
      id: number;
      vehicleNumber: string;
      vehicleType: string;
      pucCertificate: string;
      pucCertificateId: number;
      insuranceCertificate: string;
      insuranceCertificateId: number;
      isAssigned: boolean;
      createdAt: string;
      updatedAt: string;
  };
  fromDriver: {
      id: number;
      name: string;
      phoneNumber: string;
      profilePhoto: string;
      profilePhotoId: number;
      createdAt: string;
      updatedAt: string;
  };
  toDriver: {
      id: number;
      name: string;
      phoneNumber: string;
      profilePhoto: string;
      profilePhotoId: number;
      createdAt: string;
      updatedAt: string;
  };
}
  
  // Define the type for the API response
  interface ApiResponse {
    status: number;
    data: {
      result: Transfer[];
    };
  }
export default function Transfer() {
    const [isNew, setIsNew] = useState(false);
    const [users, setUsers] = useState<Transfer[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch(`${SERVER_URL}/transfers/history`)
          .then(response => response.json())
          .then((data: ApiResponse) => {
            if (data.status === 200) {
              setUsers(data.data.result);
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

      const columns: ColumnDef<Transfer>[] = [
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
          accessorKey: "fromDriver.name",
          header: "From Driver",
        },
        {
            accessorKey: "toDriver.name",
            header: "To Driver ",
        },

      ]
    
      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error}</p>;
    return (
        <div className="container" >
          <TransferVehicle setIsNew={setIsNew}/>
            <DataTable columns={columns} data={users} />
        </div>
    );
}
