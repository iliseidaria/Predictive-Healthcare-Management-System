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

export enum Gender {
    Male = 0,
    Female = 1,
    Other = 2
  }
  
  export interface User {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    role: string;
    gender: Gender;
    dateOfBirth: string;
    contactInformation?: string;
    address?: string;
    photo?: string;
  }
