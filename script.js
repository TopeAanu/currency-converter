const select = document.querySelectorAll(".currency");
const btn = document.getElementById("btn");
const num = document.getElementById("num");
const ans = document.getElementById("ans");

// Get API key from Netlify environment variable
const getApiKey = () => {
  // For Netlify production environment
  if (process.env.EXCHANGE_API_KEY) {
    return process.env.EXCHANGE_API_KEY;
  }

  // Fallback to hardcoded key for local development
  // Remove this in production or replace with a local config import
  // return "b63db26f3ef7e801732e605f";
};

const apiKey = getApiKey();

// Fetch currency codes from the API
fetch(`https://v6.exchangerate-api.com/v6/${apiKey}/codes`)
  .then((response) => response.json())
  .then((data) => {
    if (data.result === "success") {
      displayCurrencies(data.supported_codes);
    } else {
      alert("Error fetching currency data");
      console.error("API Error:", data["error-type"]);
    }
  })
  .catch((error) => {
    console.error("Fetch error:", error);
    alert("Failed to connect to currency API");
  });

// Display currencies in the dropdowns
function displayCurrencies(currencies) {
  // Set default selections
  let defaultFrom = "USD";
  let defaultTo = "EUR";

  // Add currencies to both dropdowns
  currencies.forEach(([code, name]) => {
    select[0].innerHTML += `<option value="${code}">${code} - ${name}</option>`;
    select[1].innerHTML += `<option value="${code}">${code} - ${name}</option>`;
  });

  // Set default selections
  select[0].value = defaultFrom;
  select[1].value = defaultTo;
}

// Add event listener to the Convert button
btn.addEventListener("click", () => {
  let currency1 = select[0].value;
  let currency2 = select[1].value;
  let value = num.value;

  // Validate input
  if (value === "" || value <= 0) {
    alert("Please enter a valid amount");
    return;
  }

  if (currency1 === currency2) {
    alert("Please choose different currencies");
    return;
  }

  convertCurrency(currency1, currency2, value);
});

// Convert currency using the ExchangeRate API
function convertCurrency(currency1, currency2, value) {
  // Show loading state
  ans.value = "Converting...";

  fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/pair/${currency1}/${currency2}/${value}`
  )
    .then((response) => response.json())
    .then((data) => {
      if (data.result === "success") {
        // Format the result to 2 decimal places
        ans.value = parseFloat(data.conversion_result).toFixed(2);
      } else {
        ans.value = "Error";
        console.error("API Error:", data["error-type"]);
        alert("Error during conversion");
      }
    })
    .catch((error) => {
      ans.value = "Error";
      console.error("Conversion error:", error);
      alert("Failed to convert currency");
    });
}

// Also convert when pressing Enter in the amount field
num.addEventListener("keyup", (event) => {
  if (event.key === "Enter") {
    btn.click();
  }
});
