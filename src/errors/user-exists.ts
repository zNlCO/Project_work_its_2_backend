export class UserExistsError extends Error {
  constructor() {
    super();
    this.name = 'UserExists';
    this.message = 'email already in use';
  }
}
