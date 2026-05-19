import type { Category } from "./matches";

export interface CartItem {
  matchId: string;
  category: Category;
  quantity: number;
  unitPriceUsd: number;
}

const KEY = "wctix_cart_v1";

export const readCart = (): CartItem[] => {
  if (typeof window === "undefined") return [];
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : [];
  } catch {
    return [];
  }
};

export const writeCart = (items: CartItem[]) => {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:updated"));
};

export const setCart = (items: CartItem[]) => writeCart(items);

export const clearCart = () => writeCart([]);

// Fixed BTC reference rate for the demo. Real apps fetch live rates.
export const BTC_USD = 95000;
export const usdToBtc = (usd: number) => usd / BTC_USD;
export const formatBtc = (btc: number) => `₿ ${btc.toFixed(6)}`;
