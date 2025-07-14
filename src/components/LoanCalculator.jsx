import { useState } from "react";

/**
 * LoanCalculator
 *
 * Allows users to estimate monthly payments based on:
 * - Vehicle price
 * - Down payment amount
 * - Annual interest rate (in %)
 * - Loan duration (years)
 */
export default function LoanCalculator() {
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);
  const [error, setError] = useState("");

  const handleCalculate = (e) => {
    e.preventDefault();
    setError("");
    const P = parseFloat(price) - parseFloat(downPayment);
    const rAnnual = parseFloat(interestRate) / 100;
    const years = parseFloat(duration);

    if (isNaN(P) || isNaN(rAnnual) || isNaN(years) || P <= 0 || years <= 0) {
      setError("Please enter valid positive numbers for all fields.");
      return;
    }

    const n = years * 12;
    const r = rAnnual / 12;
    let M;
    if (r === 0) {
      M = P / n;
    } else {
      M = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    }

    setMonthlyPayment(M);
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Loan Calculator</h2>
      <form onSubmit={handleCalculate} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">
            Vehicle Price ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Down Payment ($)
          </label>
          <input
            type="number"
            step="0.01"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Loan Duration (Years)
          </label>
          <input
            type="number"
            step="0.1"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
            className="w-full border rounded p-2"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-black py-2 rounded hover:bg-blue-700 transition"
        >
          Calculate
        </button>
      </form>

      {monthlyPayment !== null && (
        <div className="mt-6 p-4 bg-gray-50 rounded">
          <p className="text-lg">
            Estimated Monthly Payment:{" "}
            <span className="font-semibold">${monthlyPayment.toFixed(2)}</span>
          </p>
        </div>
      )}
    </div>
  );
}
