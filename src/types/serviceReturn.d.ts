export default interface ServiceReturn<T = any> {
    data?: T;
    message: string;
    status: number;
}

