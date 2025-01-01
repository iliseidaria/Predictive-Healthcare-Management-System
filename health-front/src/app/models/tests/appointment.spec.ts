import { Appointment, AppointmentStatus, AppointmentResponse, PaginatedResponse } from '../appointment';

describe('Appointment Models', () => {
  describe('AppointmentStatus Enum', () => {
    it('should have correct status values', () => {
      expect(AppointmentStatus.Scheduled).toBe(0);
      expect(AppointmentStatus.Completed).toBe(1);
      expect(AppointmentStatus.Cancelled).toBe(2);
    });

    it('should map to correct number values', () => {
      const status: AppointmentStatus = AppointmentStatus.Scheduled;
      expect(typeof status).toBe('number');
    });
  });

  describe('Appointment Interface', () => {
    it('should create appointment with required properties', () => {
      const appointment: Appointment = {
        patientId: '123',
        providerId: '456',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: AppointmentStatus.Scheduled
      };

      expect(appointment.patientId).toBeDefined();
      expect(appointment.providerId).toBeDefined();
      expect(appointment.appointmentDate).toBeDefined();
      expect(appointment.reason).toBeDefined();
      expect(appointment.status).toBeDefined();
    });

    it('should handle optional properties', () => {
      const appointment: Appointment = {
        patientId: '123',
        providerId: '456',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: AppointmentStatus.Scheduled,
        appointmentId: '789',
        patientName: 'John Doe',
        doctorName: 'Dr. Smith'
      };

      expect(appointment.appointmentId).toBeDefined();
      expect(appointment.patientName).toBeDefined();
      expect(appointment.doctorName).toBeDefined();
    });
  });

  describe('AppointmentResponse Interface', () => {
    it('should extend Appointment interface', () => {
      const response: AppointmentResponse = {
        id: '123',
        patientId: '456',
        providerId: '789',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: AppointmentStatus.Scheduled
      };

      expect(response.id).toBeDefined();
      expect(response.patientId).toBeDefined();
    });
  });

  describe('PaginatedResponse Interface', () => {
    it('should have correct pagination structure', () => {
      const paginatedResponse: PaginatedResponse = {
        items: [],
        totalCount: 0,
        page: 1,
        pageSize: 10
      };

      expect(Array.isArray(paginatedResponse.items)).toBeTruthy();
      expect(typeof paginatedResponse.totalCount).toBe('number');
      expect(typeof paginatedResponse.page).toBe('number');
      expect(typeof paginatedResponse.pageSize).toBe('number');
    });

    it('should contain appointment items', () => {
      const appointment: Appointment = {
        patientId: '123',
        providerId: '456',
        appointmentDate: new Date(),
        reason: 'Check-up',
        status: AppointmentStatus.Scheduled
      };

      const paginatedResponse: PaginatedResponse = {
        items: [appointment],
        totalCount: 1,
        page: 1,
        pageSize: 10
      };

      expect(paginatedResponse.items.length).toBe(1);
      expect(paginatedResponse.items[0]).toEqual(appointment);
    });
  });
});