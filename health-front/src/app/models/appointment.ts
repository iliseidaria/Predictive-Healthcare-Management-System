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
  doctorUsername?: string;
  appointmentDate: Date;
  reason: string;
  status: AppointmentStatus;
}

export interface AppointmentResponse extends Appointment {
  id?: string;
}

export interface PaginatedResponse {
  items: Appointment[];
  totalCount: number;
  page: number;
  pageSize: number;
}