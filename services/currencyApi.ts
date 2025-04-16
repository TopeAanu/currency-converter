// File: services/currencyApi.ts
import { CurrencyApiResponse, CurrencyCode } from "@/types/currency";

const API_KEY = process.env.NEXT_PUBLIC_EXCHANGE_RATE_API_KEY;
const BASE_URL = "https://v6.exchangerate-api.com/v6";

export async function fetchCurrencyCodes(): Promise<CurrencyCode[]> {
  try {
    // Check if API key exists
    if (!API_KEY) {
      throw new Error("API key is not defined in environment variables");
    }

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
    // Check if API key exists
    if (!API_KEY) {
      throw new Error("API key is not defined in environment variables");
    }

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
