import React, { createContext, useState, useEffect } from "react";

/**
 * CompareContext
 *
 * Allows users to select up to 4 vehicles to compare side-by-side.
 */
export const CompareContext = createContext();

export function CompareProvider({ children }) {
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const stored = localStorage.getItem("compare");
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse compare list from localStorage", err);
      return [];
    }
  });

  // Persist comparison list to localStorage
  useEffect(() => {
    localStorage.setItem("compare", JSON.stringify(compareItems));
  }, [compareItems]);

  const addCompare = (item) => {
    console.log("Adding item to compare", item);
    setCompareItems((prev) => {
      if (prev.find((v) => v.vid === item.vid)) return prev;
      if (prev.length >= 4) return prev; // max 4 items
      return [...prev, item];
    });
  };

  const removeCompare = (vid) => {
    setCompareItems((prev) => prev.filter((v) => v.vid !== vid));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  return (
    <CompareContext.Provider
      value={{ compareItems, addCompare, removeCompare, clearCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}
