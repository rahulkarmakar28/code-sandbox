import { apiConnector } from "./apiConnector";
import { runCodeApi } from "./api"
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
