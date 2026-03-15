import { Wallet, Smartphone, RadioTower, Tv, GraduationCap, Receipt, Bolt, CircleDollarSign, Plane } from "lucide-react";
export const services = [
  { id: "data", label: "Buy Data", icon: RadioTower, amount: "From ₦500" },
  { id: "airtime", label: "Buy Airtime", icon: Smartphone, amount: "From ₦100" },
  { id: "electricity", label: "Electricity", icon: Bolt, amount: "Pay bills" },
  { id: "cable", label: "Cable TV", icon: Tv, amount: "Renew bouquet" },
  { id: "waec", label: "WAEC / NECO", icon: GraduationCap, amount: "Buy PIN" },
  { id: "jamb", label: "JAMB ePIN", icon: Receipt, amount: "Instant delivery" },
  { id: "r2c", label: "Recharge to Cash", icon: CircleDollarSign, amount: "Convert airtime" },
  { id: "wallet", label: "Fund Wallet", icon: Wallet, amount: "Transfer / Card" },
  { id: "flights", label: "Flights", icon: Plane, amount: "Book tickets" },
];
export const recentTransactions = [
  { title: "MTN 1GB Daily", amount: "₦500", status: "Successful", reference: "TXN001" },
  { title: "Wallet Funding", amount: "+₦10,000", status: "Successful", reference: "TXN002" },
];
export const agents = [
  { name: "Agent Sule", sales: "₦82,500", commission: "₦3,300" },
  { name: "Agent Amina", sales: "₦65,000", commission: "₦2,600" },
];
export const notifications = [
  "Your wallet was funded successfully.",
  "MTN 1GB Daily was delivered to 08031234567.",
  "Recharge-to-Cash request has been processed.",
  "New data pricing is now available for agents.",
];