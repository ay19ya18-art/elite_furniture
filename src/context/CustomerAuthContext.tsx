import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { findRegisteredByEmail, registerCustomer } from "../services/local/registeredCustomers";

export type CustomerUser = {
  email: string;
  name?: string;
  picture?: string;
  provider: "google" | "password";
};

type SignUpResult = { ok: true } | { ok: false; error: string };

type Value = {
  user: CustomerUser | null;
  signInPassword: (email: string, password: string) => boolean;
  signUp: (name: string, email: string, password: string) => SignUpResult;
  signInGoogle: (user: CustomerUser) => void;
  signOut: () => void;
};

const KEY = "elite_customer_session";
const Ctx = createContext<Value | null>(null);

function load(): CustomerUser | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return JSON.parse(raw) as CustomerUser;
  } catch {
    return null;
  }
}

function persistUser(u: CustomerUser | null) {
  if (u) localStorage.setItem(KEY, JSON.stringify(u));
  else localStorage.removeItem(KEY);
}

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(() => load());

  const value = useMemo<Value>(
    () => ({
      user,
      signInPassword: (email, password) => {
        const row = findRegisteredByEmail(email);
        if (!row || row.password !== password) return false;
        const u: CustomerUser = {
          email: row.email,
          name: row.name,
          provider: "password",
        };
        setUser(u);
        persistUser(u);
        return true;
      },
      signUp: (name, email, password) => {
        const res = registerCustomer(name, email, password);
        if (!res.ok) return { ok: false, error: res.error };
        const u: CustomerUser = {
          email: res.customer.email,
          name: res.customer.name,
          provider: "password",
        };
        setUser(u);
        persistUser(u);
        return { ok: true };
      },
      signInGoogle: (u) => {
        setUser(u);
        persistUser(u);
      },
      signOut: () => {
        setUser(null);
        persistUser(null);
      },
    }),
    [user],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCustomerAuth() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useCustomerAuth must be used within CustomerAuthProvider");
  return v;
}
