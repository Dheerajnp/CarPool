export interface Driver{
    _id:string;
    name?: string;
    email?: string;
    phone?:string;
    password?:string;
    verified?: boolean;
    created_at?:Date;
    updated_at?:Date;
    profile?:string;
    role?:string;
    otp?:string;
    blocked?:boolean;
    licenseStatus?:string;
    licenseBackUrl?:string;
    licenseFrontUrl?:string;
    vehicles?:[Vehicle]
}



export interface Vehicle{
    brand: string;
    model: string;
    rcDocumentUrl:string;
    status:string;
}

export interface SaveLicenseInfoPayload {
    driverId: string;
    licenseFrontUrl: string;
    licenseBackUrl: string;
  }
  

  export interface SaveLicenseInfoResponse {
    message: string;
    driver: Driver|null;
    status: number;
  }

  export interface DriverStoreState {
    driver:Driver | null;
    loading: boolean;
    error: string[];
    message: string;
}

export interface DriverLoginCredentials {
    email: string;
    password: string;
    role: string;
}

export interface DriverLoginResponse {
  message: string,
  status: number;
  user?: any;
  token?:string;
}