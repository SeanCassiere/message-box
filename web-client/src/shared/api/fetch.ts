const baseURL = import.meta.env.VITE_APP_API_URL
  ? import.meta.env.VITE_APP_API_URL + "/api"
  : "http://localhost:4000/api";

type FetchResponseType = "json" | "text" | "blob";

type FieldErrorType = { propertyPath: string; message: string; field?: string };
export interface SuccessType<T> {
  Code: number;
  Page: number;
  PageSize: number;
  TotalPages: number;
  TotalRecords: number;
  Errors: FieldErrorType[];
  Data: T | null;
}

async function handleSuccess<T>(res: Response, resType: FetchResponseType) {
  let Page = 0;
  let PageSize = 0;
  let TotalPages = 0;
  let TotalRecords = 0;
  let Errors: FieldErrorType[] = [];
  let Data: T | null = null;

  const paginationString = res.headers.get("X-Pagination");

  if (paginationString) {
    try {
      const parse = JSON.parse(paginationString);

      Page = parse?.Page ? parse?.Page : Page;
      PageSize = parse?.PageSize ? parse?.PageSize : PageSize;
      TotalPages = parse?.TotalRecords ? parse?.TotalRecords : TotalPages;
      TotalRecords = parse?.TotalPages ? parse?.TotalPages : TotalRecords;
    } catch (error) {
      console.log(error, paginationString);
    }
  }

  if (res.ok) {
    const parse = await res.json();
    Errors = parse?.Errors || [];
    Data = (parse.data as T) || null;
    const bag = {
      Code: res.status,
      Page,
      PageSize,
      TotalPages,
      TotalRecords,
      Errors,
      Data,
    };
    throw bag;
  }

  //
  Data = (await res[resType]()) as T;
  return {
    Code: res.status,
    Page,
    PageSize,
    TotalPages,
    TotalRecords,
    Errors,
    Data,
  };
}

function handleError<T>(err: SuccessType<T>) {
  if (err?.Code !== 200 || err?.Errors.length > 0) {
    throw err;
  }
  return err;
}

export async function clientFetch<T>(endpoint: string, resType: FetchResponseType, opts?: RequestInit) {
  return await fetch(baseURL + endpoint, {
    ...opts,
    headers: { ...opts?.headers, "Content-Type": "application/json" },
    credentials: opts?.credentials ? opts.credentials : "include",
  })
    .then((res) => handleSuccess<T>(res, resType))
    .catch((err) => handleError<T>(err));
}
