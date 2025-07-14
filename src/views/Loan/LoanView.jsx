import React from "react";
import LoanCalculator from "../../components/LoanCalculator";

/**
 * LoanView
 *
 * Standalone page for the loan calculator tool.
 */
export default function LoanView() {
  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Loan Calculator</h1>
      <LoanCalculator />
    </div>
  );
}
