export class ChangedPaswordResponseDto {
  readonly message: string;

  constructor(email: string) {
    this.message = `Password changed successfully, confimartion mail sent to ${email}`;
  }
}
