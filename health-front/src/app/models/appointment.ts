export enum AppointmentStatus {
  Scheduled = 0,
  Completed = 1,
  Cancelled = 2
}

export interface Appointment {
  appointmentId?: string;  // Optional for creation
  patientId: string;
  providerId: string;
  appointmentDate: Date;
  reason: string;
  status: AppointmentStatus;
}

// Optional: Create a separate interface for appointment creation
export interface CreateAppointmentRequest {
  patientId: string;
  providerId: string;
  appointmentDate: Date;
  reason: string;
  status: AppointmentStatus;
}
