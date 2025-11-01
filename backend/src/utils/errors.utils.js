
export class ValidationError extends Error {
    constructor(message){
        super(message);
        this.name = 'Validation Error';
        this.statusCode = 400;
    }
}

export class ConflictError extends Error {
    constructor(message){
        super(message);
        this.name = 'Conflict Error';
        this.statusCode = 409;        
    }
}

export class AuthenticationError extends Error {
    constructor(message){
        super(message);
        this.name = 'Authentication Error';
        this.statusCode = 401;        
    }
}

export class NotFoundError extends Error {
    constructor(message){
        super(message);
        this.name = 'NotFoundError';
        this.statusCode = 404;
    }
}

export class ForbiddenError extends Error {
    constructor(message){
        super(message);
        this.name = 'ForbidenError';
        this.statusCode = 403;
    }
}


export default {ValidationError, ConflictError, AuthenticationError, NotFoundError, ForbiddenError};