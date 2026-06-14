import { useState, useRef } from "react";

const RABHA_DATABASE = `
GREETINGS: Hello=Urgirasong/Sirirasong|Goodbye=Rengrasong|Thank you=Nemrasong|Welcome=Nasiriba/Boraisung|Good morning=Nemphung|Good afternoon=Nem-san-dipor|Good evening=Nem rangsi/Nem langsi|Good night=Nemphar|Good=Nema|Bad=Nemcha

PRONOUNS: I=Ang|My=Angi|Me=Anga|You=Nang/Name|Your=Nangi|We=Ching/Chime|Our=Chingi|He/She=U/O/Ube|His/Her=Uni/Oni|They=Orong/Urong|Friend=Lwga/Liga/Lyga|All=Dymdakai

NUMBERS: 0=Slong|1=Sa|2=Ning|3=Tham|4=Bri|5=Bwng|6=Krop|7=Sin|8=Gin|9=Suku|10=Hasi/Chi|20=Ningsi|30=Thamsi|40=Brisi|50=Bwngsi|100=Sosa|1000=Sohasi

DAYS: Monday=Ranggresan|Tuesday=Sakrengsan|Wednesday=Pirusan|Thursday=Girisan|Friday=Charisan|Saturday=Khwraosan|Sunday=Baisan|Week=Hatapak/Sandasin

FAMILY: Mother=Aia/Aya|Father=Boa/Bawa/Baba|Elder sister=Bibi|Elder brother=Dada|Younger brother=Phojong|Younger sister=Jinong/Janong|Son=Sabra musa|Daughter=Sabra mecha|Grandfather=Juju|Grandmother=Bidi/Budi|Husband=Ymba/Wmba|Wife=Michik|Child=Kaisabra|Family=Nokdrong/Noktang|Friend=Lwga/Liga|Relatives=Baraitang|Clan=Barai/Husuk

BODY: Head=Tykam|Hair=Khoro|Eye=Neken|Nose=Kungpak|Ear=Nakor|Mouth=Khuchem|Tooth=Phakam|Hand=Tasi|Blood=Si|Bone=Kingjung|Throat=Karkhu|Neck=Tokrang|Finger=Tasikhu(Rongdani/Maituri)/Chwskereng(Kocha)|Lungs=Haofao/Thasruk(Rongdani)/Thasrok(Maituri)

COLOURS: White=Bokkai/Bokka|Black=Akkai/Akka|Red=Sakkai/Sakka|Yellow=Baikai|Green=Khenchrakkai|Blue=Khentrakkai|Golden=Sonachi|Silvery=Rupachi|Pink=Sakplek|Gray=Kukdur|Orange=Sonthrai gap|Violet=Bantho gap|Reddish=Sakkreng|Brown=Hasrak gap

NATURE: Sky=Rangkarang|Sun=Rangsang|Moon=Ranggre/Langgre|Star=Aphe|Cloud=Rangkhop|Rain=Rang|Wind=Rampar|River=Tambrong|Water=Chika|Mountain=Hachu|Forest=Grwm/Ghrum(Maituri)|Rainbow=Baisangkoi|Lightning=Rangbingbrap|Thunder=Rangbadi|Earthquake=Hadwrkai|Snow/Ice=Chisanek|Ocean=Godachimandi|Lake=Chikadubi|Waterfall=Chitram|Desert=Hasidam|Valley=Khaisuk|Bridge=Changkoi

ANIMALS: Dog=Ki|Cat=Mingku|Cow=Masu|Buffalo=Misi|Horse=Gorai|Elephant=Huti|Tiger=Masa|Snake=Tupu|Bird=To|Frog=Lwbak|Monkey=Makkra|Goat=Purun|Pig=Bak|Deer=Masi|Bear=Mada|Rabbit=Sasa|Rat=Mocho|Fox=Sial|Lion=Singho|Crow=Tokha|Peacock=Moira|Duck=Hangsing|Parrot=Batto|Owl=Tobau|Bee=Neka|Butterfly=Topak

FRUITS: Mango=Pocho|Banana=Rethe|Jackfruit=Pangchung|Coconut=Narithe|Pineapple=Anachi|Guava=Lempocho/Amthe|Orange=Sonthrai|Papaya=Mudu|Lemon=Libu|Grape=Anggur|Watermelon=Turmus|Litchi=Lichu|Pomegranate=Dalim

VEGETABLES: Potato=Khanthe|Tomato=Bilati bantho|Brinjal=Banthol|Pumpkin=Jiganata|Cabbage=Kobi|Carrot=Gajor|Radish=Mula|Spinach=Paleng|Ginger=Chingku|Chilli=Jaluk|Mushroom=Mimuk|Taro=Reng|Dal=Dali|Fern=Dengkiya

FOOD: Rice(cooked)=Mai/May|Rice(uncooked)=Mairong|Salt=Swm|Sugar=Chini|Oil=Thuchi|Milk=Nu|Honey=Neka rangching|Meat=Kaka/Makan|Rice beer=Choko|Sweet=Swma|Bitter=Khaa|Sour=Khikai|Hot(temp)=Tunga|Cold=Chwka|Hot(spicy)=Khusua

HOUSEHOLD: House=Nok|Door=Noko|Window=Nairam/Janala|Pillar=Phak|Mat=Dam|Basket=Doka|Needle=Binji|Umbrella=Chata|Broom=Nobek|Ladle=Konchali|Dish=Thali|Bucket=Baltin|Glass=Gelas|Pot=Lonta|Boat=Rung|Rope=Paga|Hoe=Kodal

SCHOOL: School=Trwngdam|College=Godatrwngdam|University=Bwsatrwngdam|Teacher(m)=Kwtrwnggir|Teacher(f)=Kwtrwngmari|Student(m)=Trynggir|Student(f)=Tryngmari|Book=Kaosa|Word=Thuka/Katha|Language=Khurang|Learn=Twrang

VERBS: Go=Reng|Come=Riba|Eat=Sa|Drink=Rwng|Sit=Nu|Sleep=Gur|Laugh=Mini|Love=Nasi|Give=Rakhu|Listen=Natham|Dance=Phwsa|Sing=Chairung|Learn=Twrang|Speak=Katha man|Stop=Rasam|Wait=Sam|Know=Tarman|Stay=Tong|Take=Ra|Call=Prao|Fly=Pu

ADJECTIVES: Good=Nema|Bad=Nemcha|Little=Chypan|More=Panga|New=Pidan|Old=Maicham|Hard=Raka|Easy=Altua(Rongdani)/Pela(Maituri)|Hot=Tunga|Cold=Chwka|Sweet=Swma|Bitter=Khaa|Sour=Khikai

QUESTIONS: Who=Chang|What=Ato/Ata|Which=Bikai|When=Bedo|Where=Bisi/Bo|Why=Atana/Abana|How=Bekhere

PHRASES: What is your name=Nangi ato mung|My name is=Angi mung|Where are you going=Nang bisini renga dogojo|I am fine=Ame nemeta|I am learning Rabha=Ang Rabha khurang twrangeta|Our language is disappearing=Chingi Rabakatha Jimarangeta|I don't have money=Angi taka tongcha|What are you doing=Nang ato kharita tebe

CULTURE: Baikho=most important Rabha festival|Kham=traditional drum|Barnakai=fire-walking ritual|Choko=rice beer|Rabha subtribes=Rongdani,Maituri,Pati,Dahuri,Kocha,Hana|Clan=Barai/Husuk|Hero/Warrior=Khetri|Rabha also called Raba
`;

const LANGUAGES = [
  { code: "en-rb", label: "English", voice: "en-US", flag: "🇬🇧" },
  { code: "as-rb", label: "Assamese", voice: "as-IN", flag: "🟡" },
  { code: "hi-rb", label: "Hindi", voice: "hi-IN", flag: "🇮🇳" },
  { code: "bn-rb", label: "Bengali", voice: "bn-IN", flag: "🟢" },
  { code: "rb-en", label: "Rabha → English", voice: "en-US", flag: "🥁" },
];

const SYSTEM_PROMPT = `You are Khurang, a Rabha language translation assistant. Translate into Rabha language using the authentic vocabulary database below from 2.5 years of Rabha community field research.

DATABASE:
${RABHA_DATABASE}

RULES:
1. Translate the input into Rabha accurately using the database.
2. Show dialect variants (Rongdani, Maituri, Kocha) when they differ.
3. For Rabha→English direction, give clear English meaning.
4. Respond ONLY with valid JSON, no extra text, no markdown backticks:
{"translation":"main Rabha translation","variants":[{"dialect":"Rongdani","word":"..."},{"dialect":"Maituri","word":"..."}],"example":"short example if helpful","note":"brief cultural note if relevant"}
Only include variants if actual dialect differences exist. Omit example and note if not needed.
If word not in database, be honest and attempt best guess from related words.`;

const QUICK_WORDS = ["Hello", "Mother", "Water", "Friend", "Moon", "Rice", "Good night", "Thank you", "Tiger", "Dance", "Love", "Home"];

export default function Translator() {
  const [input, setInput] = useState("");
  const [fromLang, setFromLang] = useState("en-rb");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [history, setHistory] = useState([]);
  const [listening, setListening] = useState(false);
  const API_KEY = process.env.REACT_APP_GEMINI_KEY;

  const currentLang = LANGUAGES.find(l => l.code === fromLang);

  async function translate(text) {
    if (!text.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    const langLabel = currentLang.label;
    const prompt = fromLang === "rb-en"
      ? `Translate this Rabha text to English: "${text}"`
      : `Translate this ${langLabel} text to Rabha: "${text}"`;
    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            generationConfig: { maxOutputTokens: 500, temperature: 0.3 }
          })
        }
      );
      const data = await res.json();
      const raw = data.candidates?.[0]?.content?.parts?.[0]?.text || "{}";
      const clean = raw.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
      setHistory(h => [{ input: text, fromLang, result: parsed }, ...h.slice(0, 9)]);
    } catch (e) {
      setError("Translation failed. Please try again.");
    }
    setLoading(false);
  }

  function startVoice() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { setError("Voice not supported in this browser."); return; }
    const r = new SR();
    r.lang = currentLang.voice;
    r.onstart = () => setListening(true);
    r.onend = () => setListening(false);
    r.onresult = (e) => { const t = e.results[0][0].transcript; setInput(t); translate(t); };
    r.onerror = () => { setListening(false); setError("Voice input failed."); };
    r.start();
  }

  const BG = "#f9fafb", BORDER = "#e5e7eb", TEXT = "#111827", SUBTEXT = "#6b7280", ACCENT = "#1d4ed8", ACCENT_LIGHT = "#eff6ff";

  return (
    <div style={{ fontFamily: "'Inter','Segoe UI',sans-serif", padding: "0 14px 24px", display: "flex", flexDirection: "column", alignItems: "center" }}>

      {/* Header */}
      <div style={{ width: "100%", maxWidth: "640px", marginBottom: "14px" }}>
        <h1 style={{ margin: 0, fontSize: "20px", fontWeight: "700", color: "white", letterSpacing: "-0.02em" }}>Khurang</h1>
        <p style={{ margin: "3px 0 0", fontSize: "11px", color: "#a16207", fontStyle: "italic" }}>Rabha khurang nasiya — ching nokdrong nalang</p>
      </div>

      {/* Language selector */}
      <div style={{ width: "100%", maxWidth: "640px", display: "flex", gap: "6px", marginBottom: "10px", flexWrap: "wrap" }}>
        {LANGUAGES.map(l => (
          <button key={l.code} onClick={() => { setFromLang(l.code); setResult(null); setInput(""); setError(""); }}
            style={{ padding: "7px 12px", background: fromLang === l.code ? ACCENT : "rgba(255,255,255,0.07)", border: fromLang === l.code ? "none" : "1px solid rgba(255,255,255,0.12)", borderRadius: "8px", color: fromLang === l.code ? "white" : "#9ca3af", fontSize: "12px", fontWeight: "600", cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s" }}>
            {l.flag} {l.label}
          </button>
        ))}
      </div>

      {/* Main card */}
      <div style={{ width: "100%", maxWidth: "640px", background: "white", border: `1px solid ${BORDER}`, borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)" }}>

        {/* Direction label */}
        <div style={{ padding: "10px 16px", borderBottom: `1px solid ${BORDER}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: "600", color: ACCENT }}>{currentLang.flag} {currentLang.label}</span>
          <span style={{ fontSize: "12px", color: SUBTEXT }}>→ Rabha {fromLang === "rb-en" ? "→ English" : ""}</span>
        </div>

        {/* Input */}
        <div style={{ padding: "14px 16px", borderBottom: `1px solid ${BORDER}` }}>
          <textarea value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); translate(input); } }}
            placeholder={fromLang === "rb-en" ? "Type in Rabha..." : `Type in ${currentLang.label}...`}
            rows={2} style={{ width: "100%", border: "none", outline: "none", resize: "none", fontSize: "16px", color: TEXT, fontFamily: "inherit", background: "transparent", lineHeight: 1.6, boxSizing: "border-box" }}
          />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "8px" }}>
            <button onClick={startVoice} style={{ display: "flex", alignItems: "center", gap: "5px", background: listening ? "#fee2e2" : ACCENT_LIGHT, border: "none", borderRadius: "7px", padding: "6px 10px", cursor: "pointer", fontSize: "12px", color: listening ? "#dc2626" : ACCENT, fontFamily: "inherit", fontWeight: "500" }}>
              {listening ? "🔴 Listening..." : `🎤 Speak in ${currentLang.label}`}
            </button>
            <button onClick={() => translate(input)} disabled={loading || !input.trim()}
              style={{ background: loading || !input.trim() ? BORDER : ACCENT, border: "none", borderRadius: "7px", padding: "7px 18px", cursor: loading || !input.trim() ? "not-allowed" : "pointer", fontSize: "13px", color: loading || !input.trim() ? SUBTEXT : "white", fontFamily: "inherit", fontWeight: "600" }}>
              {loading ? "Translating..." : "Translate →"}
            </button>
          </div>
        </div>

        {/* Quick words — only for English */}
        {fromLang === "en-rb" && (
          <div style={{ padding: "10px 14px", borderBottom: `1px solid ${BORDER}`, display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {QUICK_WORDS.map(w => (
              <button key={w} onClick={() => { setInput(w); translate(w); }}
                style={{ padding: "4px 10px", background: ACCENT_LIGHT, border: `1px solid #bfdbfe`, borderRadius: "16px", color: ACCENT, fontSize: "11px", cursor: "pointer", fontFamily: "inherit" }}>{w}</button>
            ))}
          </div>
        )}

        {error && <div style={{ padding: "14px 16px", background: "#fef2f2", color: "#dc2626", fontSize: "13px" }}>{error}</div>}

        {result && (
          <div style={{ padding: "16px" }}>
            <div style={{ marginBottom: "12px" }}>
              <div style={{ fontSize: "11px", fontWeight: "600", color: SUBTEXT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "6px" }}>Translation</div>
              <div style={{ fontSize: "22px", fontWeight: "700", color: TEXT, lineHeight: 1.4 }}>{result.translation}</div>
            </div>
            {result.variants && result.variants.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: SUBTEXT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Dialect Variants</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {result.variants.map((v, i) => (
                    <div key={i} style={{ background: ACCENT_LIGHT, border: `1px solid #bfdbfe`, borderRadius: "7px", padding: "6px 12px" }}>
                      <div style={{ fontSize: "10px", color: ACCENT, fontWeight: "600", marginBottom: "2px" }}>{v.dialect}</div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: TEXT }}>{v.word}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {result.example && (
              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontSize: "11px", fontWeight: "600", color: SUBTEXT, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "4px" }}>Example</div>
                <div style={{ fontSize: "13px", color: TEXT, fontStyle: "italic", lineHeight: 1.5 }}>{result.example}</div>
              </div>
            )}
            {result.note && (
              <div style={{ background: "#fefce8", border: "1px solid #fde68a", borderRadius: "7px", padding: "10px 12px", fontSize: "12px", color: "#92400e", lineHeight: 1.5 }}>
                💡 {result.note}
              </div>
            )}
          </div>
        )}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div style={{ width: "100%", maxWidth: "640px", marginTop: "14px" }}>
          <div style={{ fontSize: "11px", fontWeight: "600", color: "#a16207", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px" }}>Recent</div>
          <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
            {history.map((h, i) => (
              <button key={i} onClick={() => { setInput(h.input); setFromLang(h.fromLang); setResult(h.result); }}
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(249,115,22,0.15)", borderRadius: "8px", padding: "9px 13px", cursor: "pointer", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "13px", color: "white", fontWeight: "500" }}>{h.input}</span>
                <span style={{ fontSize: "13px", color: "#a16207" }}>→ {h.result.translation}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <p style={{ fontSize: "11px", color: "#78350f", marginTop: "16px", fontStyle: "italic" }}>Rabha khurang nasiya — ching nokdrong nalang</p>
    </div>
  );
}
