// server/utils/customException.js

class CustomException extends Error {
    constructor(message, status = 500) {
      super(message);
      this.name = 'CustomException';
      this.status = status;
    }
  }
  
  module.exports = CustomException;
  