export type TApiData<T> = {
    success: boolean;
    loading: boolean;
    error: string | null;
    data: T;
};

export function createApiData<T>(data: T): TApiData<T> {
    return {
        success: true,
        loading: false,
        error: null,
        data
    };
}

export function createLoadingApiData<T>(): TApiData<T> {
    return {
        success: false,
        loading: true,
        error: null,
        data: null as unknown as T
    };
}

export function createErrorApiData<T>(error: string): TApiData<T> {
    return {
        success: false,
        loading: false,
        error,
        data: null as unknown as T
    };
}
