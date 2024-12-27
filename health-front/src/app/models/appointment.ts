export enum AppointmentStatus {
  Scheduled = 'Scheduled',
  Completed = 'Completed',
  Canceled = 'Canceled'
}

export interface Appointment {
  appointmentId?: string;
  patientId: string;
  providerId: string;
  appointmentDate: Date;
  reason: string;
  status: AppointmentStatus;
}
