export class ChangedPasswordResponseDto {
  readonly message: string;

  constructor(email: string) {
    this.message = `Password changed successfully, confirmation mail sent to ${email}`;
  }
}
