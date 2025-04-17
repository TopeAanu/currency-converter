// File: components/CurrencyConverter.tsx
"use client";

import {
  useState,
  useEffect,
  ChangeEvent,
  KeyboardEvent,
  FormEvent,
} from "react";
import { fetchCurrencyCodes, convertCurrency } from "../services/currencyApi";
import { CurrencyCode } from "@/types/currency";
import styles from "../app/styles/CurrencyConverter.module.css";

export default function CurrencyConverter() {
  const [currencies, setCurrencies] = useState<CurrencyCode[]>([]);
  const [fromCurrency, setFromCurrency] = useState<string>("USD");
  const [toCurrency, setToCurrency] = useState<string>("EUR");
  const [amount, setAmount] = useState<string>("");
  const [convertedAmount, setConvertedAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCurrencies() {
      try {
        const supportedCurrencies = await fetchCurrencyCodes();
        setCurrencies(supportedCurrencies);
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred");
        }
      }
    }

    loadCurrencies();
  }, []);

  const handleFromCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setFromCurrency(e.target.value);
  };

  const handleToCurrencyChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setToCurrency(e.target.value);
  };

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAmount(e.target.value);
  };

  const handleKeyUp = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleConvert(e);
    }
  };

  const handleConvert = async (e: FormEvent) => {
    e.preventDefault();

    // Validate input
    if (!amount || parseFloat(amount) <= 0) {
      setError("Please enter a valid amount");
      return;
    }

    if (fromCurrency === toCurrency) {
      setError("Please choose different currencies");
      return;
    }

    setError(null);
    setIsLoading(true);
    setConvertedAmount("Converting...");

    try {
      const result = await convertCurrency(
        fromCurrency,
        toCurrency,
        parseFloat(amount)
      );
      setConvertedAmount(result.toFixed(2));
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An error occurred during conversion");
      }
      setConvertedAmount("Error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Currency Converter</h1>

      {error && <div style={{ color: "red", margin: "10px 0" }}>{error}</div>}

      <div className={styles.box}>
        <div className={styles.leftBox}>
          <select
            className={styles.select}
            value={fromCurrency}
            onChange={handleFromCurrencyChange}
          >
            {currencies.map(([code, name]) => (
              <option key={`from-${code}`} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
          <input
            type="number"
            id="amount"
            className={styles.input}
            value={amount}
            onChange={handleAmountChange}
            onKeyUp={handleKeyUp}
            placeholder="Enter amount"
          />
        </div>
        <div className={styles.rightBox}>
          <select
            className={styles.select}
            value={toCurrency}
            onChange={handleToCurrencyChange}
          >
            {currencies.map(([code, name]) => (
              <option key={`to-${code}`} value={code}>
                {code} - {name}
              </option>
            ))}
          </select>
          <input
            type="text"
            id="result"
            className={styles.input}
            value={convertedAmount}
            disabled
            placeholder="Result"
          />
        </div>
      </div>
      <button
        className={styles.btn}
        onClick={handleConvert}
        disabled={isLoading}
      >
        {isLoading ? "Converting..." : "Convert"}
      </button>
    </div>
  );
}
