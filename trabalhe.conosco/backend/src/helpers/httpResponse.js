import { text } from "express"

export const ok = (body) => {
    return {
        success: true,
        statusCode: 200,
        body
    };
};
export const notFound = () => {
    return {
        success: false,
        statusCode: 400,
        body: 'not found'
    }
}
export const serverError = (Error) => {
    return {
        success: false,
        statusCode: 400,
        body: Error
    }
}

