import { useState, useRef, useEffect } from "react";

const RABHA_DATABASE = `
GREETINGS: Hello=Urgirasong/Sirirasong | Goodbye=Rengrasong | Thank you=Nemrasong | Welcome=Nasiriba/Boraisung | Good morning=Nemphung | Good afternoon=Nem-san-dipor | Good evening=Nem rangsi/Nem langsi | Good night=Nemphar | Are you fine=Name nemetana | I'm fine=Ame nemeta | Good=Nema | Bad=Nemcha

PRONOUNS: I=Ang | My=Angi | Me=Anga | You=Nang/Name | Your=Nangi | We=Ching/Chime | Our=Chingi | He/She=U/O/Ube | His/Her=Uni/Oni | They=Orong/Urong | Friend=Lwga/Liga/Lyga

NUMBERS: 0=Slong|1=Sa|2=Ning|3=Tham|4=Bri|5=Bwng|6=Krop|7=Sin|8=Gin|9=Suku|10=Hasi/Chi|20=Ningsi|30=Thamsi|100=Sosa|1000=Sohasi

DAYS: Monday=Ranggresan|Tuesday=Sakrengsan|Wednesday=Pirusan|Thursday=Girisan|Friday=Charisan|Saturday=Khwraosan|Sunday=Baisan | Week=Hatapak/Sandasin

FAMILY: Mother=Aia/Aya|Father=Boa/Bawa/Baba|Elder sister=Bibi|Elder brother=Dada|Younger brother=Phojong|Younger sister=Jinong/Janong|Son=Sabra musa|Daughter=Sabra mecha|Grandfather=Juju|Grandmother=Bidi/Budi|Husband=Ymba/Wmba|Wife=Michik|Friend=Lwga/Liga|Family=Nokdrong/Noktang|Child=Kaisabra

BODY: Head=Tykam|Hair=Khoro|Eye=Neken|Nose=Kungpak|Ear=Nakor|Mouth=Khuchem|Tooth=Phakam|Hand=Tasi|Blood=Si|Bone=Kingjung

COLOURS: White=Bokkai/Bokka|Black=Akkai/Akka|Red=Sakkai/Sakka|Yellow=Baikai|Green=Khenchrakkai|Blue=Khentrakkai|Golden=Sonachi|Silvery=Rupachi|Pink=Sakplek|Gray=Kukdur

NATURE: Sky=Rangkarang|Sun=Rangsang|Moon=Ranggre/Langgre|Star=Aphe|Cloud=Rangkhop|Rain=Rang|Wind=Rampar|River=Tambrong|Water=Chika|Mountain=Hachu|Forest=Grwm|Rainbow=Baisangkoi|Lightning=Rangbingbrap|Thunder=Rangbadi

ANIMALS: Dog=Ki|Cat=Mingku|Cow=Masu|Buffalo=Misi|Horse=Gorai|Elephant=Huti|Tiger=Masa|Snake=Tupu|Bird=To|Frog=Lwbak|Monkey=Makkra|Goat=Purun|Pig=Bak|Deer=Masi|Bear=Mada

FOOD: Rice(cooked)=Mai/May|Rice(uncooked)=Mairong|Salt=Swm|Sugar=Chini|Oil=Thuchi|Milk=Nu|Honey=Neka rangching|Meat=Kaka/Makan|Rice beer=Choko|Sweet=Swma|Bitter=Khaa|Sour=Khikai|Hot=Tunga|Cold=Chwka

VERBS: Go=Reng|Come=Riba|Eat=Sa|Drink=Rwng|Sit=Nu|Sleep=Gur|Laugh=Mini|Love=Nasi|Give=Rakhu|Listen=Natham|Dance=Phwsa|Sing=Chairung|Learn=Twrang|Speak=Katha man|Stop=Rasam|Wait=Sam

TIME: Today=Te|Now=Tebe|Yesterday=Mia|Tomorrow=Gaphung|Morning=Phung|Night=Phar|Day=San|Always=Barmasi|Forever=Basakali

SCHOOL: School=Trwngdam|College=Godatrwngdam|University=Bwsatrwngdam|Teacher(m)=Kwtrwnggir|Teacher(f)=Kwtrwngmari|Student(m)=Trynggir|Student(f)=Tryngmari|Book=Kaosa|Word=Thuka/Katha|Language=Khurang

ADJECTIVES: Good=Nema|Bad=Nemcha|Little=Chypan|More=Panga|New=Pidan|Old=Maicham|Hard=Raka|Easy=Altua(Rongdani)/Pela(Maituri)|Hot=Tunga|Cold=Chwka

PHRASES: What is your name=Nangi ato mung|My name is=Angi mung|Where are you going=Nang bisini renga dogojo|I am fine=Ame nemeta|Thank you=Nemrasong|Goodbye=Rengrasong|I am learning Rabha=Ang Rabha khurang twrangeta|Our language is disappearing=Chingi Rabakatha Jimarangeta|I don't have money=Angi taka tongcha|What are you doing=Nang ato kharita tebe

CULTURE: Baikho=most important Rabha festival, same name as 2nd month | Kham=traditional Rabha drum | Barnakai=fire-walking ritual during Baikho | Choko=rice beer, central to celebrations | Rabha subtribes=Rongdani,Maituri,Pati,Dahuri,Kocha,Hana,Bitoliya,Totola,Songa,Madahi | Clan=Barai/Husuk | Matrilineal=Rabha traditionally use mother's surname | Hero/Warrior=Khetri | Rabha also called Raba
`;

const SYSTEM_PROMPT = `You are Mwdan, a warm and expert AI tutor for the Rabha language — a Tibeto-Burmese indigenous language of the Rabha people of Assam, India. You have access to an authentic vocabulary database compiled from 2.5 years of Rabha community field research.

DATABASE:
${RABHA_DATABASE}

RULES:
- Always use the database as your primary source
- When teaching a word: give Rabha word, pronunciation hint, meaning, cultural note if relevant, example sentence
- Mention dialect variants (Rongdani, Maituri, Kocha) when they exist
- Keep responses concise but rich
- Be warm and encouraging
- Modes: Free chat, Word of the Day, Quiz, Sentence practice
- Greet the user warmly in Rabha when they start`;

const SUGGESTED = [
  "Urgirasong! Teach me a greeting",
  "Give me a Word of the Day",
  "Quiz me on Rabha words",
  "Teach me family words",
  "How do numbers work?",
  "Tell me about Baikho festival",
  "Teach me body part words",
  "How does Rabha grammar work?",
];

export default function Tutor() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [started, setStarted] = useState(false);
  const bottomRef = useRef(null);
  const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function callGemini(msgs) {
    const history = msgs.slice(0, -1).map(m => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }]
    }));
    const lastMsg = msgs[msgs.length - 1].content;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents: [...history, { role: "user", parts: [{ text: lastMsg }] }],
          generationConfig: { maxOutputTokens: 1000, temperature: 0.7 }
        })
      }
    );
    const data = await res.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't respond. Please try again.";
  }

  async function startSession() {
    setStarted(true);
    setLoading(true);
    const reply = await callGemini([{ role: "user", content: "Hello! I want to learn Rabha language and culture." }]);
    setMessages([
      { role: "user", content: "Hello! I want to learn Rabha language and culture." },
      { role: "assistant", content: reply },
    ]);
    setLoading(false);
  }

  async function sendMessage(text) {
    const msg = text || input.trim();
    if (!msg || loading) return;
    setInput("");
    const updated = [...messages, { role: "user", content: msg }];
    setMessages(updated);
    setLoading(true);
    const reply = await callGemini(updated);
    setMessages([...updated, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  }

  function fmt(text) {
    return text.split("\n").map((line, i, arr) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <span key={i}>
          {parts.map((p, j) =>
            p.startsWith("**") && p.endsWith("**")
              ? <strong key={j} style={{ color: "#fb923c" }}>{p.slice(2, -2)}</strong>
              : p
          )}
          {i < arr.length - 1 && <br />}
        </span>
      );
    });
  }

  const btnBase = { border: "none", cursor: "pointer", fontFamily: "inherit", transition: "all 0.18s" };

  return (
    <div style={{ fontFamily: "'Georgia', serif", display: "flex", flexDirection: "column", alignItems: "center", padding: "0 12px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: "18px" }}>
        <div style={{ fontSize: "36px", marginBottom: "3px" }}>🥁</div>
        <h1 style={{ margin: 0, fontSize: "clamp(18px,5vw,28px)", color: "#f97316", letterSpacing: "0.1em", textTransform: "uppercase", textShadow: "0 0 40px rgba(249,115,22,0.5)" }}>Mwdan</h1>
        <p style={{ margin: "3px 0 0", color: "#a16207", fontSize: "11px", letterSpacing: "0.25em", textTransform: "uppercase" }}>Rabha Language AI Tutor</p>
        <div style={{ height: "1px", width: "90px", background: "linear-gradient(90deg,transparent,#f97316,transparent)", margin: "8px auto 0" }} />
      </div>

      <div style={{ width: "100%", maxWidth: "660px", background: "rgba(18,6,0,0.78)", border: "1px solid rgba(249,115,22,0.17)", borderRadius: "14px", backdropFilter: "blur(14px)", display: "flex", flexDirection: "column", overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,0.65)" }}>
        {!started ? (
          <div style={{ padding: "36px 24px", textAlign: "center" }}>
            <p style={{ color: "#d97706", fontSize: "14px", lineHeight: 1.85, marginBottom: "24px" }}>
              Mwdan is built on <strong style={{ color: "#f97316" }}>2.5 years</strong> of authentic Rabha community field research.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "7px", justifyContent: "center", marginBottom: "28px" }}>
              {["🗣️ 400+ real words", "📖 Grammar", "🎯 Quiz mode", "🥁 Baikho culture", "🌿 10 sub-dialects"].map(t => (
                <span key={t} style={{ padding: "4px 10px", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.2)", borderRadius: "18px", color: "#fb923c", fontSize: "11px" }}>{t}</span>
              ))}
            </div>
            <button onClick={startSession} style={{ ...btnBase, padding: "12px 34px", background: "linear-gradient(135deg,#ea580c,#c2410c)", borderRadius: "9px", color: "white", fontSize: "14px", letterSpacing: "0.05em", boxShadow: "0 4px 24px rgba(234,88,12,0.38)" }}>Begin Learning →</button>
          </div>
        ) : (
          <>
            <div style={{ padding: "16px", overflowY: "auto", maxHeight: "430px", minHeight: "260px", display: "flex", flexDirection: "column", gap: "13px" }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
                  {m.role === "assistant" && <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#ea580c,#92400e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px", flexShrink: 0, marginRight: "8px", marginTop: "2px" }}>🥁</div>}
                  <div style={{ maxWidth: "83%", padding: "10px 14px", borderRadius: m.role === "user" ? "13px 13px 4px 13px" : "13px 13px 13px 4px", background: m.role === "user" ? "linear-gradient(135deg,#ea580c,#c2410c)" : "rgba(255,255,255,0.04)", border: m.role === "assistant" ? "1px solid rgba(249,115,22,0.12)" : "none", color: m.role === "user" ? "white" : "#fde8cc", fontSize: "13px", lineHeight: 1.8 }}>
                    {fmt(m.content)}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: "linear-gradient(135deg,#ea580c,#92400e)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "14px" }}>🥁</div>
                  <div style={{ padding: "10px 15px", background: "rgba(255,255,255,0.04)", border: "1px solid rgba(249,115,22,0.12)", borderRadius: "13px 13px 13px 4px", display: "flex", gap: "5px", alignItems: "center" }}>
                    {[0,1,2].map(j => <div key={j} style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#f97316", animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${j*0.2}s` }} />)}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {messages.length <= 2 && (
              <div style={{ padding: "0 14px 10px", display: "flex", flexWrap: "wrap", gap: "6px" }}>
                {SUGGESTED.map(p => (
                  <button key={p} onClick={() => sendMessage(p)} disabled={loading} style={{ ...btnBase, padding: "5px 10px", background: "rgba(249,115,22,0.07)", border: "1px solid rgba(249,115,22,0.17)", borderRadius: "16px", color: "#fb923c", fontSize: "11px" }}
                    onMouseEnter={e => e.currentTarget.style.background = "rgba(249,115,22,0.16)"}
                    onMouseLeave={e => e.currentTarget.style.background = "rgba(249,115,22,0.07)"}
                  >{p}</button>
                ))}
              </div>
            )}

            <div style={{ height: "1px", background: "rgba(249,115,22,0.08)", margin: "0 14px" }} />
            <div style={{ padding: "12px", display: "flex", gap: "8px", alignItems: "flex-end" }}>
              <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={handleKey} placeholder="Ask about Rabha words, grammar, culture..." rows={1}
                style={{ flex: 1, background: "rgba(255,255,255,0.04)", border: "1px solid rgba(249,115,22,0.17)", borderRadius: "8px", padding: "8px 12px", color: "#fde8cc", fontSize: "13px", fontFamily: "inherit", resize: "none", outline: "none", lineHeight: 1.5 }}
                onFocus={e => e.target.style.borderColor = "rgba(249,115,22,0.42)"}
                onBlur={e => e.target.style.borderColor = "rgba(249,115,22,0.17)"}
              />
              <button onClick={() => sendMessage()} disabled={loading || !input.trim()} style={{ ...btnBase, padding: "8px 15px", background: loading || !input.trim() ? "rgba(249,115,22,0.14)" : "linear-gradient(135deg,#ea580c,#c2410c)", borderRadius: "8px", color: loading || !input.trim() ? "#a16207" : "white", fontSize: "16px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", flexShrink: 0 }}>→</button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes pulse{0%,100%{opacity:.3;transform:scale(.8)}50%{opacity:1;transform:scale(1)}} textarea::placeholder{color:#78350f}`}</style>
    </div>
  );
}
