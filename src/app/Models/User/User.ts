export default class User {
    id: string = '';
    userName: string = '';
    firstName: string = '';
    lastName: string = '';
    normalizedUserName: string = '';
    email: string = '';
    normalizedEmail: string = '';
    emailConfirmed: string = '';
    passwordHash: string = '';
    securityStamp: string = '';
    concurrencyStamp: string = '';
    phoneNumber: string = '';
    phoneNumberConfirmed: string = '';
    twoFactorEnabled: string = '';
    lockoutEnd: string = '';
    lockoutEnabled: string = '';
    accessFailedCount: string = '';
  }