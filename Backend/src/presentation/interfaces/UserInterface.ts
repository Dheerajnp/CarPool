export class UserType {
    constructor(
      public readonly email?: string,
      public readonly name?: string,
      public readonly password?: string,
      public readonly phone?: string,
      public readonly role?: string,
      public readonly otp?: string,
      public readonly verified?: boolean,
      public readonly profile?: string,
      public readonly created_at?: Date,
      public readonly updated_at?: Date,
      public readonly blocked?: boolean,
      public readonly documents?: {
        url: string;
        type: string;
      }
    ) {}
  }
  