import { useState } from "react";
import Tutor from "./Tutor";
import Translator from "./Translator";

export default function App() {
  const [tab, setTab] = useState("tutor");
  const active = { background: "#ea580c", color: "white", border: "none", borderRadius: "8px", padding: "10px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  const inactive = { background: "transparent", color: "#a16207", border: "1px solid rgba(249,115,22,0.3)", borderRadius: "8px", padding: "10px 28px", fontSize: "14px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit" };
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#0f0500 0%,#1e0800 55%,#0a0300 100%)" }}>
      <div style={{ display: "flex", justifyContent: "center", gap: "10px", padding: "16px" }}>
        <button style={tab === "tutor" ? active : inactive} onClick={() => setTab("tutor")}>🥁 Mwdan</button>
        <button style={tab === "translator" ? active : inactive} onClick={() => setTab("translator")}>⇄ Khurang</button>
      </div>
      {tab === "tutor" ? <Tutor /> : <Translator />}
    </div>
  );
}
