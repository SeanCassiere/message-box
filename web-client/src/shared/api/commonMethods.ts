import { client } from "./client";

export async function checkAccountPasswordlessStatus(
  email: string,
  abortSignal?: AbortController
): Promise<string | "not-found" | { propertyPath: string; message: string }[]> {
  const abort = abortSignal || new AbortController();
  try {
    const response = await client.get("/Authentication/Login/Passwordless", {
      params: {
        email: email.toLowerCase(),
      },
      signal: abort.signal,
    });

    if (response.status === 200) {
      if (response.data?.userId !== null) {
        return response.data?.userId;
      } else {
        return "not-found";
      }
    }

    if (response.status === 400) {
      return response.data?.errors;
    }

    return "not-found";
  } catch (error) {
    return [{ propertyPath: "email", message: "Could not check passwordless status" }];
  }
}
