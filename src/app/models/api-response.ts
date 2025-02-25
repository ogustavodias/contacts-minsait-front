type ResponseType = "SUCCESS" | "ERROR";

export interface ApiResponse<T> {
  message: string;
  body: T;
  responseType: ResponseType;
}
