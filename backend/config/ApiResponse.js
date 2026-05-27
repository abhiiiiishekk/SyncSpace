class ApiResponse{
  constructor(statusCode, message, data) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.successMessage = statusCode < 400
  }
}
export default ApiResponse;
