export interface Vehicle {
  id: number;
  vehicleNumber: string;
  vehicleType: string;
  pucCertificate: string;
  pucCertificateId: number;
  insuranceCertificate: string;
  insuranceCertificateId: number;
  isAssigned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Driver {
  id: number;
  name: string;
  phoneNumber: string;
  profilePhoto: string;
  profilePhotoId: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface AssignedVehicle {
  id: number;
  assignedDate: Date;
  createdAt: Date;
  updatedAt: Date;
  vehicle: Vehicle;
  driver: Driver;
}

export interface vehicleApiResponse {
  status: number;
  data: {
    result: Vehicle[];
  };
}

export interface driverApiResponse {
  status: number;
  data: {
    result: Driver[];
  };
}

export interface AssignedVehicleApiResponse {
  status: number;
  data: {
    result: AssignedVehicle[];
  };
}