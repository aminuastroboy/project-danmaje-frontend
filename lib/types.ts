import { LucideIcon } from "lucide-react";

export type ServiceItem = {
  id: string;
  label: string;
  amount: string;
  icon: LucideIcon;
};

export type Transaction = {
  title: string;
  amount: string;
  status: "Successful" | "Processing" | "Failed";
  reference: string;
};

export type Agent = {
  name: string;
  sales: string;
  commission: string;
};
