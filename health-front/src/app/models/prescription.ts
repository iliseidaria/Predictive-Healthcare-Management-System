export interface Prescription {
    prescriptionId: string;
    patientId: string;
    medicationName: string;
    dosage: string;
    frequency: string;
    startDate: Date;
    endDate: Date;
    notes: string;
}

export interface PrescriptionResponse extends Prescription {
    patientName?: string;
    doctorName?: string;
}

export interface PaginatedPrescriptionResponse {
    items: Prescription[];
    totalCount: number;
    page: number;
    pageSize: number;
}