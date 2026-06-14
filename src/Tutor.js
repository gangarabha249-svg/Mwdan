import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

const SYSTEM_PROMPT = `You are Mwdan, a warm and expert AI tutor for the Rabha language. You have access to an authentic vocabulary database.
DATABASE: ${RABHA_DATABASE}
RULES:
- Always use the database as your primary source.
- Provide the Rabha word, pronunciation hint, meaning, and an example sentence.
- Keep responses concise but rich.
- Greet the user warmly in Rabha when they start.`;

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
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (textToSend) => {
    const messageContent = textToSend || input;
    if (!messageContent.trim()) return;

    if (!textToSend) setInput("");

    const newMessages = [...messages, { role: "user", content: messageContent }];
    setMessages(newMessages);
    setLoading(true);

    try {
      // Initialize Google AI with the variable name matching Vercel
      const genAI = new GoogleGenerativeAI(process.env.REACT_APP_GEMINI_API_KEY);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const chat = model.startChat({
        history: [
          { role: "user", parts: [{ text: SYSTEM_PROMPT }] },
          { role: "model", parts: [{ text: "I understand. I am ready to teach Rabha." }] },
          ...newMessages.map(msg => ({
            role: msg.role === "user" ? "user" : "model",
            parts: [{ text: msg.content }]
          }))
        ]
      });

      const result = await chat.sendMessage(messageContent);
      const responseText = await result.response.text();

      setMessages([...newMessages, { role: "model", content: responseText }]);
    } catch (error) {
      console.error(error);
      setMessages([...newMessages, { role: "model", content: "Sorry, I couldn't respond. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <div style={{ border: "1px solid #ccc", borderRadius: "8px", height: "400px", overflowY: "auto", padding: "15px", marginBottom: "15px", backgroundColor: "#f9f9f9" }}>
        {messages.length === 0 && <p style={{ color: "#777", textAlign: "center" }}>Hello! I want to learn Rabha language and culture. 🥁</p>}
        {messages.map((msg, index) => (
          <div key={index} style={{ marginBottom: "10px", textAlign: msg.role === "user" ? "right" : "left" }}>
            <span style={{ display: "inline-block", padding: "8px 12px", borderRadius: "12px", backgroundColor: msg.role === "user" ? "#007bff" : "#e9ecef", color: msg.role === "user" ? "#fff" : "#000" }}>
              {msg.content}
            </span>
          </div>
        ))}
        {loading && <p style={{ color: "#777" }}>Mwdan is thinking...</p>}
        <div ref={chatEndRef} />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "15px" }}>
        {SUGGESTED.map((prompt, index) => (
          <button key={index} onClick={() => handleSend(prompt)} disabled={loading} style={{ padding: "6px 12px", borderRadius: "15px", border: "1px solid #007bff", backgroundColor: "#fff", color: "#007bff", cursor: "pointer", fontSize: "12px" }}>
            {prompt}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "10px" }}>
        <input type="text" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSend()} placeholder="Ask about Rabha words, grammar, culture..." style={{ flex: 1, padding: "10px", borderRadius: "4px", border: "1px solid #ccc" }} disabled={loading} />
        <button onClick={() => handleSend()} style={{ padding: "10px 20px", borderRadius: "4px", border: "none", backgroundColor: "#007bff", color: "#fff", cursor: "pointer" }} disabled={loading}>→</button>
      </div>
    </div>
  );
}
