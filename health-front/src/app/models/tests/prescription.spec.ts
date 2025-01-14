import { Prescription, PrescriptionResponse, PaginatedPrescriptionResponse } from '../prescription';

describe('Prescription Interfaces', () => {
  let prescription: Prescription;
  let prescriptionResponse: PrescriptionResponse;
  let paginatedPrescriptionResponse: PaginatedPrescriptionResponse;

  beforeEach(() => {
    prescription = {
      prescriptionId: '1',
      patientId: '123',
      medicationName: 'Medicine A',
      dosage: '10mg',
      frequency: 'Twice a day',
      startDate: '2023-01-01T00:00:00Z',
      endDate: '2023-01-15T00:00:00Z',
      notes: 'Take with food',
    };

    prescriptionResponse = {
      ...prescription,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
    };

    paginatedPrescriptionResponse = {
      items: [prescription],
      totalCount: 1,
      page: 1,
      pageSize: 10,
    };
  });

  it('should create a valid Prescription object', () => {
    expect(prescription).toBeTruthy();
    expect(prescription.prescriptionId).toBe('1');
    expect(prescription.patientId).toBe('123');
    expect(prescription.medicationName).toBe('Medicine A');
    expect(prescription.dosage).toBe('10mg');
    expect(prescription.frequency).toBe('Twice a day');
    expect(prescription.startDate).toBe('2023-01-01T00:00:00Z');
    expect(prescription.endDate).toBe('2023-01-15T00:00:00Z');
    expect(prescription.notes).toBe('Take with food');
  });

  it('should create a valid PrescriptionResponse object', () => {
    expect(prescriptionResponse).toBeTruthy();
    expect(prescriptionResponse.patientName).toBe('John Doe');
    expect(prescriptionResponse.doctorName).toBe('Dr. Smith');
  });

  it('should create a valid PaginatedPrescriptionResponse object', () => {
    expect(paginatedPrescriptionResponse).toBeTruthy();
    expect(paginatedPrescriptionResponse.items.length).toBe(1);
    expect(paginatedPrescriptionResponse.items[0].prescriptionId).toBe('1');
    expect(paginatedPrescriptionResponse.totalCount).toBe(1);
    expect(paginatedPrescriptionResponse.page).toBe(1);
    expect(paginatedPrescriptionResponse.pageSize).toBe(10);
  });

  it('should handle empty PaginatedPrescriptionResponse gracefully', () => {
    const emptyResponse: PaginatedPrescriptionResponse = {
      items: [],
      totalCount: 0,
      page: 1,
      pageSize: 10,
    };

    expect(emptyResponse.items.length).toBe(0);
    expect(emptyResponse.totalCount).toBe(0);
  });

  it('should match PrescriptionResponse to Prescription', () => {
    const response: PrescriptionResponse = {
      ...prescription,
      patientName: 'John Doe',
      doctorName: 'Dr. Smith',
    };

    expect(response.patientName).toBe('John Doe');
    expect(response.doctorName).toBe('Dr. Smith');
    expect(response.medicationName).toBe(prescription.medicationName);
  });
});
