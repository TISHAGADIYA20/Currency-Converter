// Currency data with country codes for flags
const currencies = {
    USD: { name: "US Dollar", country: "US" },
    EUR: { name: "Euro", country: "EU" },
    GBP: { name: "British Pound", country: "GB" },
    JPY: { name: "Japanese Yen", country: "JP" },
    AUD: { name: "Australian Dollar", country: "AU" },
    CAD: { name: "Canadian Dollar", country: "CA" },
    CHF: { name: "Swiss Franc", country: "CH" },
    CNY: { name: "Chinese Yuan", country: "CN" },
    INR: { name: "Indian Rupee", country: "IN" },
    BRL: { name: "Brazilian Real", country: "BR" },
    RUB: { name: "Russian Ruble", country: "RU" },
    KRW: { name: "South Korean Won", country: "KR" },
    SGD: { name: "Singapore Dollar", country: "SG" },
    HKD: { name: "Hong Kong Dollar", country: "HK" },
    NOK: { name: "Norwegian Krone", country: "NO" },
    SEK: { name: "Swedish Krona", country: "SE" },
    DKK: { name: "Danish Krone", country: "DK" },
    PLN: { name: "Polish Zloty", country: "PL" },
    CZK: { name: "Czech Koruna", country: "CZ" },
    HUF: { name: "Hungarian Forint", country: "HU" },
    RON: { name: "Romanian Leu", country: "RO" },
    BGN: { name: "Bulgarian Lev", country: "BG" },
    HRK: { name: "Croatian Kuna", country: "HR" },
    TRY: { name: "Turkish Lira", country: "TR" },
    ILS: { name: "Israeli Shekel", country: "IL" },
    AED: { name: "UAE Dirham", country: "AE" },
    SAR: { name: "Saudi Riyal", country: "SA" },
    ZAR: { name: "South African Rand", country: "ZA" },
    MXN: { name: "Mexican Peso", country: "MX" },
    NZD: { name: "New Zealand Dollar", country: "NZ" },
    THB: { name: "Thai Baht", country: "TH" },
    MYR: { name: "Malaysian Ringgit", country: "MY" },
    PHP: { name: "Philippine Peso", country: "PH" },
    IDR: { name: "Indonesian Rupiah", country: "ID" },
    VND: { name: "Vietnamese Dong", country: "VN" }
};

// Mock exchange rates (in a real app, you'd fetch from an API)
const exchangeRates = {
    USD: {
        EUR: 0.85, GBP: 0.73, JPY: 110.0, AUD: 1.35, CAD: 1.25, CHF: 0.92, CNY: 6.45, INR: 83.25,
        BRL: 5.20, RUB: 75.50, KRW: 1180.0, SGD: 1.35, HKD: 7.80, NOK: 8.50, SEK: 8.75, DKK: 6.35,
        PLN: 3.90, CZK: 21.50, HUF: 295.0, RON: 4.15, BGN: 1.66, HRK: 6.40, TRY: 8.50, ILS: 3.25,
        AED: 3.67, SAR: 3.75, ZAR: 14.80, MXN: 17.50, NZD: 1.42, THB: 33.50, MYR: 4.15, PHP: 50.0,
        IDR: 14250.0, VND: 23500.0
    }
};

class CurrencyConverter {
    constructor() {
        this.initializeElements();
        this.populateDropdowns();
        this.attachEventListeners();
        this.updateExchangeRate();
    }

    initializeElements() {
        this.amountInput = document.getElementById('amount');
        this.fromCurrency = document.getElementById('fromCurrency');
        this.toCurrency = document.getElementById('toCurrency');
        this.fromFlag = document.getElementById('fromFlag');
        this.toFlag = document.getElementById('toFlag');
        this.exchangeMsg = document.getElementById('exchangeMsg');
        this.convertBtn = document.getElementById('convertBtn');
        this.swapBtn = document.getElementById('swapBtn');
    }

    populateDropdowns() {
        // Clear existing options
        this.fromCurrency.innerHTML = '';
        this.toCurrency.innerHTML = '';

        // Populate both dropdowns
        Object.keys(currencies).forEach(code => {
            const currency = currencies[code];
            
            // From dropdown
            const fromOption = document.createElement('option');
            fromOption.value = code;
            fromOption.textContent = `${code} - ${currency.name}`;
            fromOption.dataset.country = currency.country;
            this.fromCurrency.appendChild(fromOption);

            // To dropdown
            const toOption = document.createElement('option');
            toOption.value = code;
            toOption.textContent = `${code} - ${currency.name}`;
            toOption.dataset.country = currency.country;
            this.toCurrency.appendChild(toOption);
        });

        // Set default values
        this.fromCurrency.value = 'USD';
        this.toCurrency.value = 'INR';
        this.updateFlags();
    }

    attachEventListeners() {
        this.convertBtn.addEventListener('click', () => this.convertCurrency());
        this.swapBtn.addEventListener('click', () => this.swapCurrencies());
        this.fromCurrency.addEventListener('change', () => {
            this.updateFlags();
            this.updateExchangeRate();
        });
        this.toCurrency.addEventListener('change', () => {
            this.updateFlags();
            this.updateExchangeRate();
        });
        this.amountInput.addEventListener('input', () => this.updateExchangeRate());
    }

    updateFlags() {
        const fromCountry = currencies[this.fromCurrency.value].country;
        const toCountry = currencies[this.toCurrency.value].country;
        
        this.fromFlag.src = `https://flagsapi.com/${fromCountry}/flat/64.png`;
        this.fromFlag.alt = `${fromCountry} Flag`;
        
        this.toFlag.src = `https://flagsapi.com/${toCountry}/flat/64.png`;
        this.toFlag.alt = `${toCountry} Flag`;
    }

    getExchangeRate(from, to) {
        if (from === to) return 1;
        
        // If we have direct rate
        if (exchangeRates[from] && exchangeRates[from][to]) {
            return exchangeRates[from][to];
        }
        
        // If we have reverse rate
        if (exchangeRates[to] && exchangeRates[to][from]) {
            return 1 / exchangeRates[to][from];
        }
        
        // Convert through USD
        if (from !== 'USD' && to !== 'USD') {
            const fromToUSD = exchangeRates['USD'][from] ? 1 / exchangeRates['USD'][from] : 1;
            const USDToTo = exchangeRates['USD'][to] || 1;
            return fromToUSD * USDToTo;
        }
        
        return 1; // Fallback
    }

    updateExchangeRate() {
        const from = this.fromCurrency.value;
        const to = this.toCurrency.value;
        const rate = this.getExchangeRate(from, to);
        
        this.exchangeMsg.textContent = `1 ${from} = ${rate.toFixed(4)} ${to}`;
    }

    convertCurrency() {
        const amount = parseFloat(this.amountInput.value);
        const from = this.fromCurrency.value;
        const to = this.toCurrency.value;
        
        if (!amount || amount <= 0) {
            alert('Please enter a valid amount');
            return;
        }
        
        // Add loading state
        this.convertBtn.classList.add('loading');
        this.convertBtn.textContent = 'Converting...';
        
        // Simulate API delay
        setTimeout(() => {
            const rate = this.getExchangeRate(from, to);
            const convertedAmount = amount * rate;
            
            this.exchangeMsg.textContent = `${amount} ${from} = ${convertedAmount.toFixed(2)} ${to}`;
            
            // Remove loading state
            this.convertBtn.classList.remove('loading');
            this.convertBtn.textContent = 'Get Exchange Rate';
        }, 500);
    }

    swapCurrencies() {
        const fromValue = this.fromCurrency.value;
        const toValue = this.toCurrency.value;
        
        this.fromCurrency.value = toValue;
        this.toCurrency.value = fromValue;
        
        this.updateFlags();
        this.updateExchangeRate();
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new CurrencyConverter();
});