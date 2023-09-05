class ValidationError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class UnauthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class AccessError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class ExistError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
    this.code = 11000;
  }
}

module.exports = {
  ValidationError,
  AccessError,
  NotFoundError,
  UnauthorizedError,
  ExistError
};