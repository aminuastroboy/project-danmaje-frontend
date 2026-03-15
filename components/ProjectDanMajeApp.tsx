"use client";

import { useEffect, useState } from "react";
import { ArrowDownToLine, ArrowUpFromLine, Bell, Landmark, Menu, Plane, Receipt, Search, User, Wallet } from "lucide-react";
import { services, agents, notifications } from "@/lib/data";
import { Card } from "@/components/ui/Card";
import { TextInput, SelectInput, PrimaryButton } from "@/components/ui/Form";
import { BottomNav } from "@/components/BottomNav";
import { loginUser } from "@/lib/auth";
import { getWalletBalance } from "@/lib/wallet";
import { getTransactions, type TransactionItem } from "@/lib/transactions";
import { buyAirtime, buyData } from "@/lib/services";

type Page = "login" | "home" | "data" | "airtime" | "electricity" | "cable" | "waec" | "jamb" | "r2c" | "wallet" | "fund" | "withdraw" | "transactions" | "agent" | "profile" | "notifications" | "flights" | "flightResults";
type FlightResult = { id: string; airline: string; from: string; to: string; departure: string; arrival: string; duration: string; stops: string; price: number; };

function StatusBadge({ status }: { status: "Successful" | "Processing" | "Failed" }) {
  const tone = status === "Successful" ? "success" : status === "Processing" ? "processing" : "failed";
  return <span className={`status-badge ${tone}`}>{status}</span>;
}
function MiniAction({ icon: Icon, label, onClick }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; onClick: () => void; }) {
  return <button onClick={onClick} className="mini-action" type="button"><Icon size={16} /><span>{label}</span></button>;
}
function ProfileRow({ label, value }: { label: string; value: string }) {
  return <div className="profile-row"><span className="profile-label">{label}</span><span>{value}</span></div>;
}
function Screen({ title, subtitle, children, onBack, showBack = true }: { title: string; subtitle: string; children: React.ReactNode; onBack: () => void; showBack?: boolean; }) {
  return <>
    <div className="top-hero">
      <div className="orb orb-left" />
      <div className="orb orb-right" />
      <div className="top-hero-content left-header">
        {showBack ? <button className="ghost-button" onClick={onBack} type="button">Back</button> : <button className="ghost-icon" type="button"><Menu size={18} /></button>}
        <div><p className="eyebrow">Astrovia Systems</p><h1>{title}</h1><p className="subtitle">{subtitle}</p></div>
      </div>
    </div>
    <div className="page-content">{children}</div>
  </>;
}

export default function ProjectDanMajeApp() {
  const [page, setPage] = useState<Page>("login");
  const [selectedNetwork, setSelectedNetwork] = useState("MTN");
  const [dataPlan, setDataPlan] = useState("1GB Daily");
  const [airtimeAmount, setAirtimeAmount] = useState("500");
  const [meterType, setMeterType] = useState("Prepaid");
  const [walletMethod, setWalletMethod] = useState("Bank Transfer");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletBalance, setWalletBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [dataPhone, setDataPhone] = useState("");
  const [airtimePhone, setAirtimePhone] = useState("");
  const [serviceMessage, setServiceMessage] = useState("");
  const [serviceLoading, setServiceLoading] = useState(false);
  const [tripType, setTripType] = useState("One Way");
  const [fromCity, setFromCity] = useState("ABV");
  const [toCity, setToCity] = useState("LOS");
  const [departureDate, setDepartureDate] = useState("2026-03-20");
  const [returnDate, setReturnDate] = useState("");
  const [passengers, setPassengers] = useState("1");
  const [cabinClass, setCabinClass] = useState("Economy");
  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);

  const goHome = () => setPage("home");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (token && page === "login") setPage("home");
  }, [page]);

  const refreshDashboardData = async () => {
    const [wallet, txns] = await Promise.all([getWalletBalance(), getTransactions()]);
    setWalletBalance(wallet.available_balance);
    setTransactions(txns);
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("access_token");
    if (!token || page === "login") return;
    refreshDashboardData().catch((err) => console.error("Dashboard data fetch failed:", err));
  }, [page]);

  const handleLogin = async () => {
    try {
      setLoading(true); setError("");
      const data = await loginUser({ phone, password });
      localStorage.setItem("access_token", data.access_token);
      setPage("home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to login");
    } finally { setLoading(false); }
  };

  const handleBuyAirtime = async () => {
    try {
      setServiceLoading(true); setServiceMessage("");
      const result = await buyAirtime({ network: selectedNetwork, phone: airtimePhone, amount: Number(airtimeAmount) });
      setServiceMessage(result.message || "Airtime purchase successful");
      await refreshDashboardData();
    } catch (err) { setServiceMessage(err instanceof Error ? err.message : "Airtime purchase failed"); }
    finally { setServiceLoading(false); }
  };

  const handleBuyData = async () => {
    try {
      setServiceLoading(true); setServiceMessage("");
      const result = await buyData({ network: selectedNetwork, phone: dataPhone, plan: dataPlan, amount: 500 });
      setServiceMessage(result.message || "Data purchase successful");
      await refreshDashboardData();
    } catch (err) { setServiceMessage(err instanceof Error ? err.message : "Data purchase failed"); }
    finally { setServiceLoading(false); }
  };

  const handleSearchFlights = () => {
    setFlightResults([
      { id: "FL001", airline: "Air Peace", from: fromCity, to: toCity, departure: "08:30", arrival: "10:00", duration: "1h 30m", stops: "Non-stop", price: 125000 },
      { id: "FL002", airline: "Arik Air", from: fromCity, to: toCity, departure: "12:15", arrival: "13:50", duration: "1h 35m", stops: "Non-stop", price: 118000 },
      { id: "FL003", airline: "Ibom Air", from: fromCity, to: toCity, departure: "17:20", arrival: "18:50", duration: "1h 30m", stops: "Non-stop", price: 132000 },
    ]);
    setPage("flightResults");
  };

  const LoginPage = () => <Screen title="Welcome Back" subtitle="Login to Project Dan Maje" onBack={() => {}} showBack={false}><Card><TextInput label="Phone Number" placeholder="08012345678" value={phone} onChange={setPhone} /><TextInput label="Password" placeholder="Enter your password" value={password} onChange={setPassword} type="password" />{error ? <p style={{ color:"#fda4af", fontSize:"14px", marginBottom:"12px" }}>{error}</p> : null}<PrimaryButton onClick={handleLogin}>{loading ? "Logging in..." : "Login"}</PrimaryButton></Card></Screen>;

  const HomePage = () => <><Screen title="Project Dan Maje" subtitle="Digital vending made simple" onBack={goHome} showBack={false}><Card className="hero-card"><div className="wallet-head"><div><p className="eyebrow soft">Wallet Balance</p><h2>₦{walletBalance.toLocaleString()}</h2><p className="muted">Main wallet • Available</p></div><div className="icon-bubble"><Wallet size={22} /></div></div><div className="mini-grid"><MiniAction icon={ArrowDownToLine} label="Fund" onClick={() => setPage("fund")} /><MiniAction icon={ArrowUpFromLine} label="Withdraw" onClick={() => setPage("withdraw")} /><MiniAction icon={Receipt} label="History" onClick={() => setPage("transactions")} /></div></Card><div className="section-head"><h3>Quick Services</h3><button className="link-button" type="button">View all</button></div><div className="service-grid">{services.map((service) => { const Icon = service.icon; return <button key={service.id} className="service-tile" onClick={() => setPage(service.id as Page)} type="button"><div className="service-icon"><Icon size={22} /></div><p className="service-title">{service.label}</p><p className="service-subtitle">{service.amount}</p></button>; })}</div><Card><div className="section-head compact"><h3>Recent Transactions</h3><Search size={16} className="muted-icon" /></div><div className="stack">{transactions.length > 0 ? transactions.slice(0,4).map((item) => <div key={item.reference} className="txn-row"><div><p className="txn-title">{item.category}</p><p className="txn-sub">₦{item.amount.toLocaleString()}</p></div><StatusBadge status={item.status === "success" ? "Successful" : item.status === "processing" ? "Processing" : "Failed"} /></div>) : <p className="txn-sub">No transactions yet.</p>}</div></Card></Screen><BottomNav current="home" setPage={setPage} /></>;

  const FlightsPage = () => <><Screen title="Flights Booking" subtitle="Search and book airline tickets" onBack={goHome}><Card><div className="quick-amounts" style={{ gridTemplateColumns: "repeat(2, 1fr)" }}>{["One Way","Round Trip"].map((item) => <button key={item} className={`trip-chip ${tripType === item ? "active" : ""}`} onClick={() => setTripType(item)} type="button">{item}</button>)}</div><TextInput label="From" placeholder="ABV" value={fromCity} onChange={setFromCity} /><TextInput label="To" placeholder="LOS" value={toCity} onChange={setToCity} /><TextInput label="Departure Date" value={departureDate} onChange={setDepartureDate} type="date" />{tripType === "Round Trip" ? <TextInput label="Return Date" value={returnDate} onChange={setReturnDate} type="date" /> : null}<SelectInput label="Passengers" value={passengers} onChange={setPassengers} options={["1","2","3","4"]} /><SelectInput label="Cabin Class" value={cabinClass} onChange={setCabinClass} options={["Economy","Premium Economy","Business"]} /><PrimaryButton onClick={handleSearchFlights}>Search Flights</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>;

  const FlightResultsPage = () => <><Screen title="Flight Results" subtitle={`${fromCity} → ${toCity} • ${departureDate}`} onBack={() => setPage("flights")}><div className="stack">{flightResults.map((flight) => <Card key={flight.id}><div className="flight-row"><div><p className="flight-title">{flight.airline}</p><p className="flight-muted">{flight.stops}</p></div><div className="icon-bubble"><Plane size={20} /></div></div><div style={{ marginTop: 14 }} className="flight-meta"><div><p className="flight-title">{flight.departure}</p><p className="flight-muted">{flight.from}</p></div><div style={{ textAlign: "center" }}><p className="flight-muted">{flight.duration}</p></div><div style={{ textAlign: "right" }}><p className="flight-title">{flight.arrival}</p><p className="flight-muted">{flight.to}</p></div></div><div className="flight-row" style={{ marginTop: 16 }}><p className="flight-price">₦{flight.price.toLocaleString()}</p><PrimaryButton onClick={() => setServiceMessage(`Selected ${flight.airline} • ${flight.id}`)} full={false}>Select</PrimaryButton></div></Card>)}</div></Screen><BottomNav current="home" setPage={setPage} /></>;

  const pages: Record<Page, React.ReactNode> = {
    login: <LoginPage />,
    home: <HomePage />,
    flights: <FlightsPage />,
    flightResults: <FlightResultsPage />,
    data: <><Screen title="Buy Data" subtitle="Purchase SME and direct bundles" onBack={goHome}><Card><SelectInput label="Network" value={selectedNetwork} onChange={setSelectedNetwork} options={["MTN","Airtel","Glo","9mobile"]} /><TextInput label="Phone Number" placeholder="08012345678" value={dataPhone} onChange={setDataPhone} /><SelectInput label="Data Plan" value={dataPlan} onChange={setDataPlan} options={["500MB Daily","1GB Daily","2GB Weekly","5GB Weekly","10GB Monthly"]} /><div className="amount-box"><span>Amount</span><strong>₦500</strong></div>{serviceMessage ? <p className="txn-sub">{serviceMessage}</p> : null}<PrimaryButton onClick={handleBuyData}>{serviceLoading ? "Processing..." : "Buy Data"}</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    airtime: <><Screen title="Buy Airtime" subtitle="Recharge any supported network" onBack={goHome}><Card><SelectInput label="Network" value={selectedNetwork} onChange={setSelectedNetwork} options={["MTN","Airtel","Glo","9mobile"]} /><TextInput label="Phone Number" placeholder="08012345678" value={airtimePhone} onChange={setAirtimePhone} /><TextInput label="Amount (₦)" value={airtimeAmount} onChange={setAirtimeAmount} type="number" /><div className="quick-amounts">{[100,200,500,1000].map((n) => <button key={n} className="quick-chip" onClick={() => setAirtimeAmount(String(n))} type="button">₦{n}</button>)}</div>{serviceMessage ? <p className="txn-sub">{serviceMessage}</p> : null}<PrimaryButton onClick={handleBuyAirtime}>{serviceLoading ? "Processing..." : "Buy Airtime"}</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    electricity: <><Screen title="Electricity" subtitle="Pay prepaid or postpaid bills" onBack={goHome}><Card><SelectInput label="Distribution Company" value="Abuja Electric" options={["Abuja Electric","Ikeja Electric","Jos Electric","Eko Electric"]} /><TextInput label="Meter Number" placeholder="1234567890" value="1234567890" /><SelectInput label="Meter Type" value={meterType} onChange={setMeterType} options={["Prepaid","Postpaid"]} /><TextInput label="Amount (₦)" placeholder="5000" value="5000" type="number" /><PrimaryButton>Pay Electricity Bill</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    cable: <><Screen title="Cable TV" subtitle="Renew or activate bouquet" onBack={goHome}><Card><SelectInput label="Provider" value="GOtv" options={["DStv","GOtv","StarTimes"]} /><TextInput label="Smartcard / IUC Number" placeholder="1234 5678 9012" value="7022334455" /><SelectInput label="Bouquet" value="GOtv Max" options={["GOtv Jolli","GOtv Max","DStv Compact","StarTimes Basic"]} /><div className="amount-box"><span>Subscription Amount</span><strong>₦7,200</strong></div><PrimaryButton>Pay Subscription</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    waec: <><Screen title="WAEC / NECO" subtitle="Generate exam checker PINs" onBack={goHome}><Card><SelectInput label="Service Type" value="WAEC Result Checker" options={["WAEC Result Checker","NECO Result Checker"]} /><TextInput label="Number of PINs" placeholder="1" value="1" type="number" /><div className="summary-box"><div><span>Price per PIN</span><strong>₦4,000</strong></div><div><span>Total</span><strong>₦4,000</strong></div></div><PrimaryButton>Generate PIN</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    jamb: <><Screen title="JAMB ePIN" subtitle="Instant purchase and delivery" onBack={goHome}><Card><TextInput label="Number of ePINs" placeholder="1" value="1" type="number" /><div className="amount-box"><span>Total Amount</span><strong>₦6,200</strong></div><PrimaryButton>Generate JAMB ePIN</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    r2c: <><Screen title="Recharge to Cash" subtitle="Convert airtime to wallet balance" onBack={goHome}><Card><SelectInput label="Network" value={selectedNetwork} onChange={setSelectedNetwork} options={["MTN","Airtel","Glo","9mobile"]} /><TextInput label="Phone Number" placeholder="08012345678" value="08031234567" /><TextInput label="Airtime Amount" placeholder="1000" value="1000" type="number" /><div className="summary-box"><div><span>Conversion Rate</span><strong>85%</strong></div><div><span>You Receive</span><strong>₦850</strong></div></div><PrimaryButton>Convert Airtime</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    wallet: <><Screen title="Wallet" subtitle="Manage funds and transfers" onBack={goHome}><Card className="hero-card"><p className="eyebrow soft">Available Balance</p><h2>₦{walletBalance.toLocaleString()}</h2><div className="mini-grid"><MiniAction icon={ArrowDownToLine} label="Fund" onClick={() => setPage("fund")} /><MiniAction icon={ArrowUpFromLine} label="Withdraw" onClick={() => setPage("withdraw")} /><MiniAction icon={Landmark} label="Transfer" onClick={() => {}} /></div></Card><Card><h3 className="small-title">Wallet Activity</h3><div className="stack">{transactions.length > 0 ? transactions.slice(0,4).map((item) => <div key={item.reference} className="txn-row"><div><p className="txn-title">{item.category}</p><p className="txn-sub">₦{item.amount.toLocaleString()}</p></div><StatusBadge status={item.status === "success" ? "Successful" : item.status === "processing" ? "Processing" : "Failed"} /></div>) : <p className="txn-sub">No transactions yet.</p>}</div></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    fund: <><Screen title="Fund Wallet" subtitle="Top up through transfer or card" onBack={goHome}><Card><SelectInput label="Funding Method" value={walletMethod} onChange={setWalletMethod} options={["Bank Transfer","Paystack","Flutterwave"]} /><TextInput label="Amount (₦)" placeholder="10000" value="10000" type="number" /><div className="bank-box"><span>Bank</span><strong>Wema Bank • 1234567890</strong><span>Account Name</span><strong>Project Dan Maje Wallet</strong></div><PrimaryButton>Proceed to Fund</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    withdraw: <><Screen title="Withdraw Funds" subtitle="Move balance to bank account" onBack={goHome}><Card><TextInput label="Bank Name" placeholder="Access Bank" value="Access Bank" /><TextInput label="Account Number" placeholder="0123456789" value="0123456789" /><TextInput label="Amount (₦)" placeholder="5000" value="5000" type="number" /><PrimaryButton>Withdraw Funds</PrimaryButton></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
    transactions: <><Screen title="Transactions" subtitle="Track all platform activities" onBack={goHome}><Card><div className="filters">{["Today","This Week","This Month"].map((item) => <button key={item} className="quick-chip" type="button">{item}</button>)}</div><div className="stack">{transactions.length > 0 ? transactions.map((item) => <div key={item.reference} className="txn-card"><div><p className="txn-title">{item.category}</p><p className="txn-sub">{item.reference}</p></div><div className="txn-right"><p className="txn-amount">₦{item.amount.toLocaleString()}</p><StatusBadge status={item.status === "success" ? "Successful" : item.status === "processing" ? "Processing" : "Failed"} /></div></div>) : <p className="txn-sub">No transactions found.</p>}</div></Card></Screen><BottomNav current="transactions" setPage={setPage} /></>,
    agent: <><Screen title="Agent Dashboard" subtitle="Monitor sales and commissions" onBack={goHome}><Card className="hero-card"><div className="two-cols"><div className="stat-box"><span>Total Sales</span><strong>₦147,500</strong></div><div className="stat-box"><span>Commission</span><strong>₦5,900</strong></div></div></Card><Card><h3 className="small-title">Top Agents</h3><div className="stack">{agents.map((agent) => <div key={agent.name} className="txn-card"><div><p className="txn-title">{agent.name}</p><p className="txn-sub">Sales {agent.sales}</p></div><div className="txn-right"><p className="txn-amount accent">{agent.commission}</p></div></div>)}</div></Card></Screen><BottomNav current="agent" setPage={setPage} /></>,
    profile: <><Screen title="Profile" subtitle="Account and security settings" onBack={goHome}><Card><div className="profile-head"><div className="avatar"><User size={24} /></div><div><p className="txn-title">Aminu Astrovia</p><p className="txn-sub">Agent ID: DMJ-1024</p></div></div></Card><Card><div className="stack"><ProfileRow label="Phone Number" value="08031234567" /><ProfileRow label="Email" value="hello@astrovia.systems" /><ProfileRow label="KYC Status" value="Verified" /><ProfileRow label="Security" value="Change Password" /></div></Card></Screen><BottomNav current="profile" setPage={setPage} /></>,
    notifications: <><Screen title="Notifications" subtitle="Platform alerts and updates" onBack={goHome}><Card><div className="stack">{notifications.map((message) => <div key={message} className="notice-box"><div className="notice-head"><Bell size={15} /> <span>Alert</span></div><p>{message}</p></div>)}</div></Card></Screen><BottomNav current="home" setPage={setPage} /></>,
  };

  return <main className="app-shell">{pages[page]}</main>;
}
