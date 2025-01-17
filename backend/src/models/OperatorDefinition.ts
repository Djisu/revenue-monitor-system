export interface OperatorDefinition {
    OperatorID: string;
    OperatorName: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    resetToken?: string; // Optional because it may not always be set
    resetTokenExpiration?: Date; // Optional
}