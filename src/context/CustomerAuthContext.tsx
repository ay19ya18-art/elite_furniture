import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type CustomerUser = {
  email: string;
  name?: string;
  picture?: string;
  provider: "google" | "password";
};

type Value = {
  user: CustomerUser | null;
  signInPassword: (email: string, password: string) => boolean;
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

export function CustomerAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CustomerUser | null>(() => load());

  const value = useMemo<Value>(
    () => ({
      user,
      signInPassword: (email, password) => {
        const e = email.trim().toLowerCase();
        const p = password.trim();
        if (!e || !p) return false;
        // Demo accounts — replace with API later
        if (e === "demo@elitefurniture.com" && p === "demo1234") {
          const u: CustomerUser = { email: e, name: "Demo Customer", provider: "password" };
          setUser(u);
          localStorage.setItem(KEY, JSON.stringify(u));
          return true;
        }
        return false;
      },
      signInGoogle: (u) => {
        setUser(u);
        localStorage.setItem(KEY, JSON.stringify(u));
      },
      signOut: () => {
        setUser(null);
        localStorage.removeItem(KEY);
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
