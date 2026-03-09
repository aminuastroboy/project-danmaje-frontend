import { Receipt, ShieldCheck, User, Wallet } from "lucide-react";

export type NavPage = "home" | "transactions" | "agent" | "profile";

export function BottomNav({
  current,
  setPage,
}: {
  current: NavPage;
  setPage: React.Dispatch<React.SetStateAction<any>>;
}) {
  const items = [
    { id: "home", label: "Home", icon: Wallet },
    { id: "transactions", label: "History", icon: Receipt },
    { id: "agent", label: "Agents", icon: ShieldCheck },
    { id: "profile", label: "Profile", icon: User },
  ] as const;

  return (
    <div className="bottom-nav">
      {items.map((item) => {
        const Icon = item.icon;
        const active = current === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setPage(item.id)}
            className={`bottom-nav-item ${active ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
     }
