const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL
export const runCodeApi = backendURL + "/api/v1/run"
export const turnstileVerifyApi = backendURL + "/api/v1/verify-turnstile"