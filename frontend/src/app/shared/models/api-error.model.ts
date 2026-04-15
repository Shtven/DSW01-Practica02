export interface ApiError {
  status: number;
  message: string;
  path?: string;
  error?: string;
}
