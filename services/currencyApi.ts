// File: services/currencyApi.ts
import { CurrencyApiResponse, CurrencyCode } from "@/types/currency";

const API_KEY =
  process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY || "b63db26f3ef7e801732e605f";
const BASE_URL = "https://v6.exchangerate-api.com/v6";

export async function fetchCurrencyCodes(): Promise<CurrencyCode[]> {
  try {
    const response = await fetch(`${BASE_URL}/${API_KEY}/codes`);
    const data: CurrencyApiResponse = await response.json();

    if (data.result === "success" && data.supported_codes) {
      return data.supported_codes;
    } else {
      console.error("API Error:", data["error-type"]);
      throw new Error("Error fetching currency data");
    }
  } catch (error) {
    console.error("Fetch error:", error);
    throw new Error("Failed to connect to currency API");
  }
}

export async function convertCurrency(
  fromCurrency: string,
  toCurrency: string,
  amount: number
): Promise<number> {
  try {
    const response = await fetch(
      `${BASE_URL}/${API_KEY}/pair/${fromCurrency}/${toCurrency}/${amount}`
    );
    const data: CurrencyApiResponse = await response.json();

    if (data.result === "success" && data.conversion_result) {
      return data.conversion_result;
    } else {
      console.error("API Error:", data["error-type"]);
      throw new Error("Error during conversion");
    }
  } catch (error) {
    console.error("Conversion error:", error);
    throw new Error("Failed to convert currency");
  }
}
