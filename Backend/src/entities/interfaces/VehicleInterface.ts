import { Document } from "mongoose";

export default interface Vehicle {
    brand: string;
    model: string;
    rcDocumentUrl: string;
    number: string;
    status: 'approved' | 'rejected' | 'pending';
  }