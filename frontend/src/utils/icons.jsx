import {
  Briefcase, Monitor, TrendingUp, Gift, Package,
  UtensilsCrossed, Car, ShoppingBag, Film, Heart, Zap, Home,
  Wallet, ArrowUp, ArrowDown, CreditCard, Banknote,
  PiggyBank, Sparkles, Pencil, BarChart2, ClipboardList, Inbox,
  Sun, Moon,
} from 'lucide-react';

// Default purple palette
export const PURPLE       = '#8486e1';
export const PURPLE_MID   = '#6a2bd6';
export const PURPLE_LIGHT = '#1d122c';

const IC_MAP = {
  // Income categories
  Salario:         Briefcase,
  Freelance:       Monitor,
  'Inversión':     TrendingUp,
  Bono:            Gift,
  Regalo:          Gift,
  // Expense categories
  Comida:          UtensilsCrossed,
  Transporte:      Car,
  Compras:         ShoppingBag,
  Entretenimiento: Film,
  Salud:           Heart,
  Servicios:       Zap,
  Renta:           Home,
  Otro:            Package,
  // Summary / UI
  balance:         Wallet,
  income:          ArrowUp,
  expense:         ArrowDown,
  // Payment
  efectivo:        Banknote,
  debito:          CreditCard,
  credito:         CreditCard,
  // Budget tags
  indispensable:   Home,
  ahorro:          PiggyBank,
  extra:           Sparkles,
  // Misc UI
  edit:            Pencil,
  chart:           BarChart2,
  list:            ClipboardList,
  inbox:           Inbox,
  card:            CreditCard,
  sun:             Sun,
  moon:            Moon,
};

export function AppIcon({ name, size = 16, color = PURPLE, strokeWidth = 1.8, ...props }) {
  const Ic = IC_MAP[name] ?? Package;
  return <Ic size={size} color={color} strokeWidth={strokeWidth} {...props} />;
}
