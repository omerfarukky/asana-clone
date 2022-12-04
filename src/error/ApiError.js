class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.status = statusCode;
  }

  static notFount() {
    this.message = "Boyle bir sayfa bulunamadı!";
    this.status = 404;
  }

  static badData() {}
}

module.exports = ApiError;
