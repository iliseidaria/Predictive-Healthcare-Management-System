export enum AppointmentStatus {
  Scheduled = 0,
  Completed = 1,
  Cancelled = 2
}

export interface Appointment {
  appointmentId?: string;
  patientId: string;
  providerId: string;
  patientName?: string;
  doctorName?: string;
  appointmentDate: Date;
  reason: string;
  status: AppointmentStatus;
}

export interface PaginatedResponse {
  items: Appointment[];
  totalCount: number;
  page: number;
  pageSize: number;
}