export enum UserRole {
    Doctor = 'Doctor',
    Patient = 'Patient',
    Admin = 'Admin'
}

export interface UsersResponse {
    items: any[];
    totalCount: number;
    pageNumber: number;
    pageSize: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
    lastName: string,
  firstName: string,
}
