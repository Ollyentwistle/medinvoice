export interface PaymentBase {
  id?: number;
  patientId: number;
  serviceId: number;
  date: string;
  isPaid: boolean;
}
