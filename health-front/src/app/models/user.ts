export enum UserRole {
    Doctor = 'Doctor',
    Patient = 'Patient',
    Admin = 'Admin'
}

export interface UsersResponse {
    users: User[];
    totalUsers: number;
}

export interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}