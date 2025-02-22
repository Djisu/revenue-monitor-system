export interface OperatorDefinition {
    operatorid: string;
    operatorname: string;
    password: string;
    firstname: string;
    lastname: string;
    email: string;
    resettoken?: string; // Optional because it may not always be set
    resettokenexpiration?: Date; // Optional
}