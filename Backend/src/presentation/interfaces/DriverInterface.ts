export class DriverType {
    constructor(
      public readonly name?: string,
      public readonly email?: string,
      public readonly phone?: string,
      public readonly password?: string,
      public readonly verified?: boolean,
      public readonly created_at?: Date,
      public readonly updated_at?: Date,
      public readonly profile?: string,
      public readonly role?: string,
      public readonly otp?: string,
      public readonly blocked?: boolean,
      public readonly licenseStatus?: string,
      public readonly licenseBackUrl?: string,
      public readonly licenseFrontUrl?: string,
      public readonly vehicles?: Array<{
        brand: string;
        model: string;
        rcDocumentUrl: string;
        status: string;
      }>
    ) {}
  }
  