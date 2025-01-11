import {MONGO_DUPLICATION_ISSUE} from "../consts/client_errors";

export function mongoDBErrorHandler(error: any): any {
    if (error.code === 11000) {
        return {
            isError: true,
            type: MONGO_DUPLICATION_ISSUE,
            duplicatedFields: Object.keys(error.keyPattern),
        };
    }
    return {
        isError: true,
        ...error
    };
}