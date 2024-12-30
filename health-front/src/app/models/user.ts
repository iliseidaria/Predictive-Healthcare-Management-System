export enum UserRole {
    Doctor = 'Doctor',
    Patient = 'Patient',
    Admin = 'Admin'
}

export interface User {
    id: string;
    username: string;
    email: string;
    passwordHash?: string;
    role: string;
}