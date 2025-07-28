import { apiConnector } from "./apiConnector";
import { runCodeApi, turnstileVerifyApi } from "./api"
import axios, { AxiosError } from "axios";

type RunCodeResponse = {
    output: string;
};

export const runCodeService = async (code: string, language: string, roomId: string) => {
    try {
        const response = await apiConnector<RunCodeResponse>(
            "POST",
            `${runCodeApi}`,
            { code, language, roomID: roomId },
            {
                "Content-Type": "application/json",
            }
        );
        // console.log(response)
        return "Running...";
    } catch (error) {
        const axiosError = error as AxiosError<{ error: string }>;

        const serverMessage =
            axiosError.response?.data?.error ||
            axiosError.message ||
            "Failed to run code";

        console.log(serverMessage);
        throw new Error(serverMessage);
    }
};


export const turnstileVerify = async (token: string) => {
    try {
        const response = await apiConnector<{
            success: boolean;
            message: string;
        }>(
            "POST",
            `${turnstileVerifyApi}`,
            { token },
            {
                "Content-Type": "application/json",
            }
        );

        return response.data.success;
    } catch (error) {
        const axiosError = error as AxiosError<{ message: string }>;
        const serverMessage =
            axiosError.response?.data?.message ||
            axiosError.message ||
            "Turnstile verification failed";

        console.error(serverMessage);
        throw new Error(serverMessage);
    }
};