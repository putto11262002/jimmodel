class ConstraintViolationError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "InvalidArgumentError";
    }
}

export default ConstraintViolationError;
