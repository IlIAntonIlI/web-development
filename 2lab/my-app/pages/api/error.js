export default class newError {
  constructor(message, status = 400) {
    this.messuage = message;
    this.status = status;
  }
}
