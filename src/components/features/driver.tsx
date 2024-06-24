import { DataTable } from "@/components/ui/data-table";
import { SERVER_URL } from "@/config/constant";
import { ColumnDef } from "@tanstack/react-table";
import { useEffect, useState } from "react";
import AddDriverForm from "../form/add-driver";
interface User {
    id: number;
    name: string;
    phoneNumber: string;
    profilePhoto: string;
    profilePhotoId: number;
  }
  
  // Define the type for the API response
  interface ApiResponse {
    status: number;
    data: {
      result: User[];
    };
  }
export default function Driver() {
    const [isNew,setIsNew] = useState(false);
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        fetch(`${SERVER_URL}/drivers`)
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

      const columns: ColumnDef<User>[] = [
        {
          accessorKey: "name",
          header: "Driver Name",
        },
        {
          accessorKey: "phoneNumber",
          header: "Phone number",
        },
        {
            accessorKey: "profilePhoto",
            header: "Profile Photo",
        },

      ]
    
      if (loading) return <p>Loading...</p>;
      if (error) return <p>{error}</p>;
    return (
        <div className="container" >
            <AddDriverForm setIsNew={setIsNew} />
            <DataTable columns={columns} data={users} />
        </div>
    );
}
