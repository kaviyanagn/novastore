import React, { createContext, useContext } from "react";
import { useReservation } from "../hooks/useReservation";

/**
 * ReservationContext
 * -------------------------------------------------------------
 * Requirements:
 * c) Create a ReservationContext using Context API to share reservation information
 *    between RestaurantList, RestaurantDetail, TableSelection, ReservationSummary,
 *    and Confirmation components.
 * d) Use Context API to avoid passing reservation information through multiple
 *    levels of components using Props (no prop drilling).
 */
export const ReservationContext = createContext(null);

export function ReservationProvider({ children }) {
  const reservation = useReservation();

  return (
    <ReservationContext.Provider value={reservation}>
      {children}
    </ReservationContext.Provider>
  );
}

export function useReservationContext() {
  const context = useContext(ReservationContext);
  if (!context) {
    throw new Error("useReservationContext must be used within a <ReservationProvider>");
  }
  return context;
}

export default ReservationContext;
