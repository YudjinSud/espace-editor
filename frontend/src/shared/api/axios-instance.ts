import Axios, { type AxiosRequestConfig } from "axios";

export const AXIOS_INSTANCE = Axios.create({
    baseURL: "http://localhost:3002",
});

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
    const source = Axios.CancelToken.source();
    const promise = AXIOS_INSTANCE({
        ...config,
        cancelToken: source.token,
    }).then(({ data }) => data);

    // @ts-expect-error cancel property
    promise.cancel = () => {
        source.cancel("Query was cancelled");
    };

    return promise;
};
