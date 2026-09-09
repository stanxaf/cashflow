"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  eventCashEffect,
  prototypeToday,
  type FinancialEvent,
  type PayCycleSummary,
} from "@/lib/seed-data";

type EventDraft = Omit<FinancialEvent, "id"> & { id?: string };

type PrototypeStore = {
  events: FinancialEvent[];
  completedIds: Set<string>;
  saveEvent: (draft: EventDraft) => FinancialEvent;
  deleteEvent: (id: string) => void;
  toggleCompleted: (id: string) => void;
  schedulePlan: (id: string) => void;
  upcomingEvents: FinancialEvent[];
  payCycleSummaries: PayCycleSummary[];
  forecastFor: (input: FinancialEvent[]) => Array<FinancialEvent & { cashAfter: number }>;
};

const STORAGE_KEY = "cashflow-prototype-events-v2";
const COMPLETED_KEY = "cashflow-prototype-completed-v2";

const PrototypeStoreContext = createContext<PrototypeStore | null>(null);

function sortEvents(input: FinancialEvent[]) {
  return [...input].sort((a, b) => a.date.localeCompare(b.date));
}

function buildPayCycleSummaries(input: FinancialEvent[]): PayCycleSummary[] {
  const upcoming = sortEvents(input.filter((event) => event.state !== "actual" && event.date > prototypeToday));
  const paydays = upcoming.filter((event) => event.type === "income");

  return paydays.map((payday, index) => {
    const previousBoundary = index === 0 ? prototypeToday : paydays[index - 1].date;
    const items = upcoming.filter((event) => event.date > previousBoundary && event.date <= payday.date);
    const income = items.filter((event) => event.type === "income").reduce((total, event) => total + event.amount, 0);
    const needed = items.filter((event) => event.type !== "income").reduce((total, event) => total + event.amount, 0);

    return { payday, income, needed, result: income - needed, items };
  });
}

export function PrototypeStoreProvider({ children }: { children: React.ReactNode }) {
  const [events, setEvents] = useState<FinancialEvent[]>([]);
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const savedEvents = window.localStorage.getItem(STORAGE_KEY);
      const savedCompleted = window.localStorage.getItem(COMPLETED_KEY);
      if (savedEvents) setEvents(JSON.parse(savedEvents) as FinancialEvent[]);
      if (savedCompleted) setCompletedIds(new Set(JSON.parse(savedCompleted) as string[]));
    } catch {
      // Keep the prototype empty if local storage is unavailable.
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events, hydrated]);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(COMPLETED_KEY, JSON.stringify([...completedIds]));
  }, [completedIds, hydrated]);

  const upcomingEvents = useMemo(
    () => sortEvents(events.filter((event) => event.state !== "actual" && event.date > prototypeToday)),
    [events]
  );

  const payCycleSummaries = useMemo(() => buildPayCycleSummaries(events), [events]);

  function saveEvent(draft: EventDraft) {
    const nextEvent: FinancialEvent = {
      ...draft,
      id: draft.id ?? `local-${Date.now()}`,
    } as FinancialEvent;

    setEvents((current) => {
      const exists = current.some((event) => event.id === nextEvent.id);
      return exists
        ? current.map((event) => (event.id === nextEvent.id ? nextEvent : event))
        : [...current, nextEvent];
    });

    return nextEvent;
  }

  function deleteEvent(id: string) {
    setEvents((current) => current.filter((event) => event.id !== id));
    setCompletedIds((current) => {
      const next = new Set(current);
      next.delete(id);
      return next;
    });
  }

  function toggleCompleted(id: string) {
    setCompletedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function schedulePlan(id: string) {
    setEvents((current) => current.map((event) => event.id === id ? { ...event, state: "scheduled" } : event));
  }

  function forecastFor(input: FinancialEvent[]) {
    // Clean-start prototype: until account setup exists, forecasts begin at zero
    // so projected positions only reflect the events the user entered.
    let running = 0;
    return sortEvents(input).map((event) => {
      running += eventCashEffect(event);
      return { ...event, cashAfter: running };
    });
  }

  return (
    <PrototypeStoreContext.Provider value={{
      events,
      completedIds,
      saveEvent,
      deleteEvent,
      toggleCompleted,
      schedulePlan,
      upcomingEvents,
      payCycleSummaries,
      forecastFor,
    }}>
      {children}
    </PrototypeStoreContext.Provider>
  );
}

export function usePrototypeStore() {
  const store = useContext(PrototypeStoreContext);
  if (!store) throw new Error("usePrototypeStore must be used within PrototypeStoreProvider");
  return store;
}
