export class ResponseItem {
  constructor({ type = "error", message = "No message", info = {} }) {
    this.type = type;
    this.message = message;
    this.info = info;
  }
  responseAll() {
    return { type: this.type, message: this.message, info: this.info };
  }
}
