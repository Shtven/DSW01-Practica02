export interface RequestState {
  loading: boolean;
  error?: string;
  success?: string;
  empty?: boolean;
  lastUpdatedAt?: number;
}
