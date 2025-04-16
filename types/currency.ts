// File: types/currency.ts
export type CurrencyCode = [string, string]; // [code, name]

export interface CurrencyApiResponse {
  result: string;
  supported_codes?: CurrencyCode[];
  "error-type"?: string;
  conversion_result?: number;
}
