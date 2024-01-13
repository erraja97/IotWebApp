class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400; //above 400 status code is for server error which will be handle by ApiError.js
  }
}

export { ApiResponse };
