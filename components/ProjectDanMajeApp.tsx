"use client";

import { getTransactions, type TransactionItem } from "@/lib/transactions";
import { useState } from "react";
import { loginUser } from "@/lib/auth";
import { getWalletBalance } from "@/lib/wallet";
import { useEffect, useState } from "react";
const [phone, setPhone] = useState("");
const [password, setPassword] = useState("");
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [walletBalance, setWalletBalance] = useState<number>(0);
const [transactions, setTransactions] = useState<TransactionItem[]>([]);
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Bell,
  Landmark,
  Menu,
  Receipt,
  Search,
  User,
  Wallet,
} from "lucide-react";
import { services, recentTransactions, agents, notifications } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { TextInput, SelectInput, PrimaryButton } from "@/components/ui/Form";
import { BottomNav } from "@/components/BottomNav";

type Page =
  | "login"
  | "home"
  | "data"
  | "airtime"
  | "electricity"
  | "cable"
  | "waec"
  | "jamb"
  | "r2c"
  | "wallet"
  | "fund"
  | "withdraw"
  | "transactions"
  | "agent"
  | "profile"
  | "notifications";

function StatusBadge({ status }: { status: "Successful" | "Processing" | "Failed" }) {
  const tone =
    status === "Successful"
      ? "success"
      : status === "Processing"
      ? "processing"
      : "failed";
  return <span className={`status-badge ${tone}`}>{status}</span>;
}

function MiniAction({
  icon: Icon,
  label,
  onClick,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  label: string;
  onClick: () => void;
}) {
  return (
    <button onClick={onClick} className="mini-action">
      <Icon size={16} />
      <span>{label}</span>
    </button>
  );
}

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="profile-row">
      <span className="profile-label">{label}</span>
      <span>{value}</span>
    </div>
  );
}

function Screen({
  title,
  subtitle,
  children,
  onBack,
  showBack = true,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  onBack: () => void;
  showBack?: boolean;
}) {
  return (
    <>
      <div className="top-hero">
        <div className="orb orb-left" />
        <div className="orb orb-right" />
        <div className="top-hero-content left-header">
          {showBack ? (
            <button className="ghost-button" onClick={onBack}>
              Back
            </button>
          ) : (
            <button className="ghost-icon">
              <Menu size={18} />
            </button>
          )}

          <div>
            <p className="eyebrow">Astrovia Systems</p>
            <h1>{title}</h1>
            <p className="subtitle">{subtitle}</p>
          </div>
        </div>
      </div>
      <div className="page-content">{children}</div>
    </>
  );
}

export default function ProjectDanMajeApp() {
  const [page, setPage] = useState<Page>("login");
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [dataPlan, setDataPlan] = useState("1GB Daily");
  const [airtimeAmount, setAirtimeAmount] = useState("500");
  const [meterType, setMeterType] = useState("Prepaid");
  const [walletMethod, setWalletMethod] = useState("Bank Transfer");

  const goHome = () => setPage("home");

  const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    const data = await loginUser({
      phone,
      password,
    });

    localStorage.setItem("access_token", data.access_token);
    setPage("home");
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unable to login";
    setError(message);
  } finally {
    setLoading(false);
  }
};

  const LoginPage = () => (
  <>
    <Screen
      title="Welcome Back"
      subtitle="Login to Project Dan Maje"
      onBack={() => {}}
      showBack={false}
    >
      <Card>
        <TextInput
          label="Phone Number"
          placeholder="08012345678"
          value={phone}
          onChange={setPhone}
        />

        <TextInput
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          type="password"
        />

        {error ? (
          <p style={{ color: "#fda4af", fontSize: "14px", marginBottom: "12px" }}>
            {error}
          </p>
        ) : null}

        <PrimaryButton onClick={handleLogin}>
          {loading ? "Logging in..." : "Login"}
        </PrimaryButton>
      </Card>
    </Screen>
  </>
);

  useEffect(() => {
  const token = localStorage.getItem("access_token");

  if (!token) return;
  if (page === "login") return;

  const loadData = async () => {
    try {
      const [wallet, txns] = await Promise.all([
        getWalletBalance(),
        getTransactions(),
      ]);

      setWalletBalance(wallet.available_balance);
      setTransactions(txns);
    } catch (err) {
      console.error("Dashboard data fetch failed:", err);
    }
  };

  loadData();
}, [page]);

  loadWallet();
}, [page]);

  const pages: Record<Page, React.ReactNode> = {
    login: <LoginPage />,
    home: (
      <>
        <Screen title="Project Dan Maje" subtitle="Digital vending made simple" onBack={goHome} showBack={false}>
          <Card className="hero-card">
            <div className="wallet-head">
              <div>
                <p className="eyebrow soft">Wallet Balance</p>
                <h2>₦{walletBalance.toLocaleString()}</h2>
                <p className="muted">Main wallet • Available</p>
              </div>
              <div className="icon-bubble">
                <Wallet size={22} />
              </div>
            </div>
            <div className="mini-grid">
              <MiniAction icon={ArrowDownToLine} label="Fund" onClick={() => setPage("fund")} />
              <MiniAction icon={ArrowUpFromLine} label="Withdraw" onClick={() => setPage("withdraw")} />
              <MiniAction icon={Receipt} label="History" onClick={() => setPage("transactions")} />
            </div>
          </Card>

          <div className="section-head">
            <h3>Quick Services</h3>
            <button className="link-button">View all</button>
          </div>

          <div className="service-grid">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <button key={service.id} className="service-tile" onClick={() => setPage(service.id as Page)}>
                  <div className="service-icon">
                    <Icon size={22} />
                  </div>
                  <p className="service-title">{service.label}</p>
                  <p className="service-subtitle">{service.amount}</p>
                </button>
              );
            })}
          </div>

          <Card>
            <div className="section-head compact">
              <h3>Recent Transactions</h3>
              <Search size={16} className="muted-icon" />
            </div>
            <div className="stack">
              {recentTransactions.map((item) => (
                <div key={item.reference} className="txn-row">
                  <div>
                    <p className="txn-title">{item.title}</p>
                    <p className="txn-sub">{item.amount}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    data: (
      <>
        <Screen title="Buy Data" subtitle="Purchase SME and direct bundles" onBack={goHome}>
          <Card>
            <SelectInput label="Network" value={selectedNetwork} onChange={setSelectedNetwork} options={["MTN", "Airtel", "Glo", "9mobile"]} />
            <TextInput label="Phone Number" placeholder="0803 123 4567" value="08031234567" />
            <SelectInput label="Data Plan" value={dataPlan} onChange={setDataPlan} options={["500MB Daily", "1GB Daily", "2GB Weekly", "5GB Weekly", "10GB Monthly"]} />
            <div className="amount-box">
              <span>Amount</span>
              <strong>₦500</strong>
            </div>
            <PrimaryButton>Buy Data</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    airtime: (
      <>
        <Screen title="Buy Airtime" subtitle="Recharge any supported network" onBack={goHome}>
          <Card>
            <SelectInput label="Network" value={selectedNetwork} onChange={setSelectedNetwork} options={["MTN", "Airtel", "Glo", "9mobile"]} />
            <TextInput label="Phone Number" placeholder="0803 123 4567" value="08031234567" />
            <TextInput label="Amount (₦)" value={airtimeAmount} onChange={setAirtimeAmount} type="number" />
            <div className="quick-amounts">
              {[100, 200, 500, 1000].map((n) => (
                <button key={n} className="quick-chip" onClick={() => setAirtimeAmount(String(n))}>
                  ₦{n}
                </button>
              ))}
            </div>
            <PrimaryButton>Buy Airtime</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    electricity: (
      <>
        <Screen title="Electricity" subtitle="Pay prepaid or postpaid bills" onBack={goHome}>
          <Card>
            <SelectInput label="Distribution Company" value="Abuja Electric" options={["Abuja Electric", "Ikeja Electric", "Jos Electric", "Eko Electric"]} />
            <TextInput label="Meter Number" placeholder="1234567890" value="1234567890" />
            <SelectInput label="Meter Type" value={meterType} onChange={setMeterType} options={["Prepaid", "Postpaid"]} />
            <TextInput label="Amount (₦)" placeholder="5000" value="5000" type="number" />
            <PrimaryButton>Pay Electricity Bill</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    cable: (
      <>
        <Screen title="Cable TV" subtitle="Renew or activate bouquet" onBack={goHome}>
          <Card>
            <SelectInput label="Provider" value="GOtv" options={["DStv", "GOtv", "StarTimes"]} />
            <TextInput label="Smartcard / IUC Number" placeholder="1234 5678 9012" value="7022334455" />
            <SelectInput label="Bouquet" value="GOtv Max" options={["GOtv Jolli", "GOtv Max", "DStv Compact", "StarTimes Basic"]} />
            <div className="amount-box">
              <span>Subscription Amount</span>
              <strong>₦7,200</strong>
            </div>
            <PrimaryButton>Pay Subscription</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    waec: (
      <>
        <Screen title="WAEC / NECO" subtitle="Generate exam checker PINs" onBack={goHome}>
          <Card>
            <SelectInput label="Service Type" value="WAEC Result Checker" options={["WAEC Result Checker", "NECO Result Checker"]} />
            <TextInput label="Number of PINs" placeholder="1" value="1" type="number" />
            <div className="summary-box">
              <div><span>Price per PIN</span><strong>₦4,000</strong></div>
              <div><span>Total</span><strong>₦4,000</strong></div>
            </div>
            <PrimaryButton>Generate PIN</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    jamb: (
      <>
        <Screen title="JAMB ePIN" subtitle="Instant purchase and delivery" onBack={goHome}>
          <Card>
            <TextInput label="Number of ePINs" placeholder="1" value="1" type="number" />
            <div className="amount-box">
              <span>Total Amount</span>
              <strong>₦6,200</strong>
            </div>
            <PrimaryButton>Generate JAMB ePIN</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    r2c: (
      <>
        <Screen title="Recharge to Cash" subtitle="Convert airtime to wallet balance" onBack={goHome}>
          <Card>
            <SelectInput label="Network" value={selectedNetwork} onChange={setSelectedNetwork} options={["MTN", "Airtel", "Glo", "9mobile"]} />
            <TextInput label="Phone Number" placeholder="0803 123 4567" value="08031234567" />
            <TextInput label="Airtime Amount" placeholder="1000" value="1000" type="number" />
            <div className="summary-box">
              <div><span>Conversion Rate</span><strong>85%</strong></div>
              <div><span>You Receive</span><strong>₦850</strong></div>
            </div>
            <PrimaryButton>Convert Airtime</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    wallet: (
      <>
        <Screen title="Wallet" subtitle="Manage funds and transfers" onBack={goHome}>
          <Card className="hero-card">
            <p className="eyebrow soft">Available Balance</p>
            <h2>₦45,000</h2>
            <div className="mini-grid">
              <MiniAction icon={ArrowDownToLine} label="Fund" onClick={() => setPage("fund")} />
              <MiniAction icon={ArrowUpFromLine} label="Withdraw" onClick={() => setPage("withdraw")} />
              <MiniAction icon={Landmark} label="Transfer" onClick={() => {}} />
            </div>
          </Card>
          <Card>
            <h3 className="small-title">Wallet Activity</h3>
            <div className="stack">
              {recentTransactions.map((item) => (
                <div key={item.reference} className="txn-row">
                  <div>
                    <p className="txn-title">{item.title}</p>
                    <p className="txn-sub">{item.amount}</p>
                  </div>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    fund: (
      <>
        <Screen title="Fund Wallet" subtitle="Top up through transfer or card" onBack={goHome}>
          <Card>
            <SelectInput label="Funding Method" value={walletMethod} onChange={setWalletMethod} options={["Bank Transfer", "Paystack", "Flutterwave"]} />
            <TextInput label="Amount (₦)" placeholder="10000" value="10000" type="number" />
            <div className="bank-box">
              <span>Bank</span>
              <strong>Wema Bank • 1234567890</strong>
              <span>Account Name</span>
              <strong>Project Dan Maje Wallet</strong>
            </div>
            <PrimaryButton>Proceed to Fund</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    withdraw: (
      <>
        <Screen title="Withdraw Funds" subtitle="Move balance to bank account" onBack={goHome}>
          <Card>
            <TextInput label="Bank Name" placeholder="Access Bank" value="Access Bank" />
            <TextInput label="Account Number" placeholder="0123456789" value="0123456789" />
            <TextInput label="Amount (₦)" placeholder="5000" value="5000" type="number" />
            <PrimaryButton>Withdraw Funds</PrimaryButton>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
    transactions: (
      <>
        <Screen title="Transactions" subtitle="Track all platform activities" onBack={goHome}>
          <Card>
            <div className="filters">
              {["Today", "This Week", "This Month"].map((item) => (
                <button key={item} className="quick-chip">{item}</button>
              ))}
            </div>
            <div className="stack">
              {recentTransactions.concat(recentTransactions).map((item, idx) => (
                <div key={`${item.reference}-${idx}`} className="txn-card">
                  <div>
                    <p className="txn-title">{item.title}</p>
                    <p className="txn-sub">TXN00{idx + 1} • Today</p>
                  </div>
                  <div className="txn-right">
                    <p className="txn-amount">{item.amount}</p>
                    <StatusBadge status={item.status} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Screen>
        <BottomNav current="transactions" setPage={setPage} />
      </>
    ),
    agent: (
      <>
        <Screen title="Agent Dashboard" subtitle="Monitor sales and commissions" onBack={goHome}>
          <Card className="hero-card">
            <div className="two-cols">
              <div className="stat-box">
                <span>Total Sales</span>
                <strong>₦147,500</strong>
              </div>
              <div className="stat-box">
                <span>Commission</span>
                <strong>₦5,900</strong>
              </div>
            </div>
          </Card>
          <Card>
            <h3 className="small-title">Top Agents</h3>
            <div className="stack">
              {agents.map((agent) => (
                <div key={agent.name} className="txn-card">
                  <div>
                    <p className="txn-title">{agent.name}</p>
                    <p className="txn-sub">Sales {agent.sales}</p>
                  </div>
                  <div className="txn-right">
                    <p className="txn-amount accent">{agent.commission}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Screen>
        <BottomNav current="agent" setPage={setPage} />
      </>
    ),
    profile: (
      <>
        <Screen title="Profile" subtitle="Account and security settings" onBack={goHome}>
          <Card>
            <div className="profile-head">
              <div className="avatar"><User size={24} /></div>
              <div>
                <p className="txn-title">Aminu Astrovia</p>
                <p className="txn-sub">Agent ID: DMJ-1024</p>
              </div>
            </div>
          </Card>
          <Card>
            <div className="stack">
              <ProfileRow label="Phone Number" value="08031234567" />
              <ProfileRow label="Email" value="hello@astrovia.systems" />
              <ProfileRow label="KYC Status" value="Verified" />
              <ProfileRow label="Security" value="Change Password" />
            </div>
          </Card>
        </Screen>
        <BottomNav current="profile" setPage={setPage} />
      </>
    ),
    notifications: (
      <>
        <Screen title="Notifications" subtitle="Platform alerts and updates" onBack={goHome}>
          <Card>
            <div className="stack">
              {notifications.map((message) => (
                <div key={message} className="notice-box">
                  <div className="notice-head"><Bell size={15} /> <span>Alert</span></div>
                  <p>{message}</p>
                </div>
              ))}
            </div>
          </Card>
        </Screen>
        <BottomNav current="home" setPage={setPage} />
      </>
    ),
  };

  return <main className="app-shell">{pages[page]}</main>;
}
