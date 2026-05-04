/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Bot, Sparkles } from 'lucide-react';
import styles from './Chatbot.module.css';
import { recoveryApi } from '@/services/apiClient';

interface Message {
  id: string;
  sender: 'bot' | 'user';
  text: string;
}

const GENERAL_QA = [
  { keywords: ['wasser', 'trinken', 'flüssigkeit', 'durst'], answer: "Wir empfehlen 2,5 bis 3 Liter täglich, am besten Wasser oder ungesüßte Tees, um die Nieren während der Therapie gut zu spülen." },
  { keywords: ['übel', 'übelkeit', 'brechen', 'schlecht'], answer: "Ingwertee, kleine Portionen über den Tag verteilt und das Vermeiden von stark riechenden Speisen können helfen. Auch Zwieback oder trockene Cracker sind oft gut verträglich." },
  { keywords: ['kalorien', 'gewicht', 'abnehmen'], answer: "Therapien können den Appetit mindern und den Stoffwechsel verändern. Versuche, kalorienreiche Snacks wie Nüsse oder Avocado in deinen Tag einzubauen." },
  { keywords: ['protein', 'eiweiß', 'muskeln'], answer: "Protein hilft beim Aufbau und der Reparatur von Gewebe, was besonders nach OPs oder während Therapien wichtig für dein Immunsystem und den Muskelerhalt ist." },
  { keywords: ['geschmack', 'metallisch', 'schmeckt'], answer: "Verwende Plastikbesteck statt Metall. Frische Kräuter, ein Spritzer Zitrone oder säuerliche Bonbons können helfen, den Geschmackssinn wieder anzuregen." },
  { keywords: ['müde', 'müdigkeit', 'fatigue', 'erschöpft'], answer: "Setze auf komplexe Kohlenhydrate (z.B. Haferflocken) für gleichmäßige Energie und vermeide schwere, fettige Mahlzeiten." },
  { keywords: ['durchfall', 'stuhl'], answer: "Leichte Kost ist wichtig: Bananen, Reis, geriebener Apfel und Zwieback (BRAT-Diät). Bitte viel trinken, um den Flüssigkeitsverlust auszugleichen!" },
  { keywords: ['verstopfung', 'verdauung'], answer: "Ballaststoffreiche Ernährung (Vollkorn, Flohsamenschalen), viel Flüssigkeit und leichte Bewegung können die Verdauung anregen." },
  { keywords: ['mund', 'entzündet', 'schlucken', 'schmerzen'], answer: "Vermeide scharfe, heiße, saure oder sehr salzige Speisen. Lauwarme Suppen, Pürees, Joghurt und weiche Speisen sind jetzt ideal." },
  { keywords: ['vitamine', 'nahrungsergänzung', 'tabletten', 'präparate'], answer: "Nahrungsergänzungsmittel solltest du immer zuerst mit deinem behandelnden Arzt absprechen. Eine ausgewogene Ernährung ist die beste Basis." }
];

const CHEMO_BOX_QA = [
  { q: "Warum ist der Haferbrei so mild?", keywords: ['haferbrei', 'mild'], answer: "Während der Chemo sind Schleimhäute oft gereizt. Milder, weicher Haferbrei schont den Magen und ist leicht zu schlucken." },
  { q: "Wofür ist die Knochenbrühe gut?", keywords: ['knochenbrühe', 'brühe'], answer: "Sie liefert hochkonzentrierte Nährstoffe, Kollagen und Elektrolyte, die den Körper stärken, ohne die Verdauung zu belasten." },
  { q: "Was bei wenig Appetit auf die Box?", keywords: ['appetit', 'kein hunger', 'portion'], answer: "Versuche unsere Mahlzeiten in sehr kleinen Portionen zu essen. Der Kartoffel-Auflauf schmeckt z.B. auch lauwarm in kleinen Bissen." },
  { q: "Warum ist die Box kaloriendicht?", keywords: ['kaloriendicht', 'viel kalorien'], answer: "Therapien zehren extrem an den Reserven. Mit 2100 kcal stellen wir sicher, dass du auch bei kleinen Portionen genug Energie bekommst." },
  { q: "Ist das Essen keimarm?", keywords: ['keime', 'keimarm', 'sicher', 'rohkost'], answer: "Ja, bei der Chemo-Box achten wir streng auf keimarme Zubereitungshinweise und meiden kritische Rohkost zur Infektionsprävention." },
  { q: "Darf ich die Brühe kalt trinken?", keywords: ['kalt', 'brühe kalt'], answer: "Lauwarm ist für den Magen am schonendsten, aber wenn dir kalt besser bekommt, ist das absolut in Ordnung." },
  { q: "Wie lange ist das Essen haltbar?", keywords: ['haltbar', 'haltbarkeit', 'einfrieren'], answer: "Die frischen Zutaten solltest du innerhalb von 3 Tagen verbrauchen, Suppen und Aufläufe kannst du problemlos einfrieren." },
  { q: "Warum so wenig Gewürze?", keywords: ['gewürze', 'würzig', 'fade'], answer: "Starke Gewürze können Übelkeit triggern. Wir setzen auf sehr sanfte Aromen, die den Magen beruhigen." },
  { q: "Was tun bei metallischem Geschmack?", keywords: ['metallisch', 'geschmack'], answer: "Solltest du diesen haben, versuche unser Essen mit etwas Zitronensaft (falls verträglich) aufzufrischen und nutze Plastikbesteck." },
  { q: "Wie hilft mir das Protein in der Box?", keywords: ['protein', 'quark', 'muskel'], answer: "Die 90g Protein (z.B. aus dem Quark) sind essentiell, um dem Muskelabbau während der Behandlungsphasen entgegenzuwirken." }
];

const EINFACH_GESUND_BOX_QA = [
  { q: "Warum ist Bircher Müsli gut?", keywords: ['bircher', 'müsli'], answer: "Es liefert komplexe Kohlenhydrate und Ballaststoffe für langanhaltende Energie und unterstützt eine gesunde Verdauung." },
  { q: "Was bringt der Vollkorn-Wrap?", keywords: ['wrap', 'vollkorn'], answer: "Vollkornprodukte halten den Blutzuckerspiegel stabil, während Hummus pflanzliches Protein und gesunde Fette liefert." },
  { q: "Wie hilft die Box im Alltag?", keywords: ['alltag', 'prävention'], answer: "Die Einfach Gesund Box sichert dir eine lückenlose Nährstoffversorgung ohne großen Aufwand, ideal zur allgemeinen Gesundheitsoptimierung." },
  { q: "Sind die Zutaten regional?", keywords: ['regional', 'bio', 'zutaten'], answer: "Wir achten bei der Einfach Gesund Box auf saisonale und nach Möglichkeit regionale Bio-Zutaten." },
  { q: "Kann ich die Mahlzeiten einfrieren?", keywords: ['einfrieren', 'haltbar'], answer: "Die meisten Gerichte wie Wraps oder Eintöpfe lassen sich gut einfrieren, frische Salate solltest du jedoch zeitnah verzehren." },
  { q: "Reichen 1800 kcal für mich?", keywords: ['1800', 'kalorien', 'zu wenig'], answer: "1800 kcal sind ein gesunder Durchschnitt. Bei mehr körperlicher Aktivität kannst du die Gerichte mit Nüssen oder gesunden Ölen ergänzen." },
  { q: "Ist diese Box vegan?", keywords: ['vegan', 'vegetarisch'], answer: "Die Einfach Gesund Box enthält primär pflanzliche Zutaten, kann aber vegetarische Komponenten wie Käse oder Eier enthalten." },
  { q: "Wie wärme ich auf?", keywords: ['aufwärmen', 'mikrowelle', 'warm machen'], answer: "Am besten schonend in der Pfanne oder Mikrowelle (mittlere Stufe). Frische Komponenten vorher abnehmen." },
  { q: "Warum so viele Ballaststoffe?", keywords: ['ballaststoffe', 'verdauung'], answer: "Ballaststoffe sind das 'Futter' für ein gesundes Mikrobiom, welches dein Immunsystem zu 70% steuert." },
  { q: "Welche Vitamine sind hier im Fokus?", keywords: ['vitamine', 'fokus'], answer: "Besonders Vitamin C, Zink und B-Vitamine stehen im Fokus, um dein Energielevel konstant hoch zu halten." }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const [userName, setUserName] = useState('');
  const [activeQA, setActiveQA] = useState(GENERAL_QA);
  const [suggestions, setSuggestions] = useState(["Was hilft gegen Übelkeit?", "Wie viel soll ich trinken?"]);

  useEffect(() => {
    // Load Profile
    recoveryApi.fetchPatientProfile().then(p => {
      if (p.firstName) setUserName(p.firstName);
    }).catch(() => {});

    // Load Purchased Kits to adjust QA
    if (typeof window !== 'undefined') {
      const savedKits = sessionStorage.getItem('f4r_purchased_kits');
      if (savedKits) {
        const kits = JSON.parse(savedKits);
        let newQA = [...GENERAL_QA];
        const newSuggestions: string[] = [];

        const hasChemo = kits.some((k: any) => k.id === 'mk-chemo');
        const hasGesund = kits.some((k: any) => k.id === 'mk-einfach-gesund');

        if (hasChemo) {
          newQA = [...newQA, ...CHEMO_BOX_QA];
          // Show some chemo box specific questions
          newSuggestions.push(CHEMO_BOX_QA[0].q, CHEMO_BOX_QA[1].q, CHEMO_BOX_QA[4].q);
        }
        if (hasGesund) {
          newQA = [...newQA, ...EINFACH_GESUND_BOX_QA];
          // Show some einfach gesund box specific questions
          newSuggestions.push(EINFACH_GESUND_BOX_QA[0].q, EINFACH_GESUND_BOX_QA[2].q, EINFACH_GESUND_BOX_QA[5].q);
        }

        setActiveQA(newQA);
        
        // If they have kits, replace suggestions completely, max 4
        if (newSuggestions.length > 0) {
          setSuggestions(newSuggestions.slice(0, 4));
        }
      }
    }
  }, []);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greeting = userName 
        ? `Hallo ${userName}! 👋 Ich sehe deine Box(en). Frag mich gerne alles zu deinen Gerichten oder deiner Recovery!`
        : `Hallo! 👋 Ich bin dein Food4Recovery KI-Assistent. Wie kann ich dich heute unterstützen?`;
      
      setMessages([{ id: Date.now().toString(), sender: 'bot', text: greeting }]);
    }
  }, [isOpen, userName, messages.length]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const findBestAnswer = (question: string) => {
    const qLower = question.toLowerCase();
    
    // Exact match for the suggested questions first
    const exactChemo = CHEMO_BOX_QA.find(qa => qa.q.toLowerCase() === qLower);
    if (exactChemo) return exactChemo.answer;
    const exactGesund = EINFACH_GESUND_BOX_QA.find(qa => qa.q.toLowerCase() === qLower);
    if (exactGesund) return exactGesund.answer;

    let bestMatch = null;
    let maxMatches = 0;

    for (const qa of activeQA) {
      const matches = qa.keywords.filter(kw => qLower.includes(kw)).length;
      if (matches > maxMatches) {
        maxMatches = matches;
        bestMatch = qa.answer;
      }
    }

    if (bestMatch) return bestMatch;

    return "Das ist eine sehr spezifische Frage. Bei medizinischen Bedenken wende dich bitte immer an dein Behandlungsteam. Hast du weitere Fragen zu deiner Box oder allgemeinen Ernährungstipps?";
  };

  const handleSend = (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), sender: 'user', text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const answer = findBestAnswer(text);
      const botMsg: Message = { id: (Date.now() + 1).toString(), sender: 'bot', text: answer };
      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000); 
  };

  return (
    <div className={styles.chatbotContainer}>
      {isOpen && (
        <div className={styles.chatbotWindow}>
          <div className={styles.chatbotHeader}>
            <div className={styles.headerTitle}>
              <Bot size={20} />
              Recovery Assistent
            </div>
            <button className={styles.closeButton} onClick={() => setIsOpen(false)}>
              <X size={20} />
            </button>
          </div>
          
          <div className={styles.chatbotMessages}>
            {messages.map(msg => (
              <div key={msg.id} className={`${styles.message} ${msg.sender === 'bot' ? styles.messageBot : styles.messageUser}`}>
                {msg.text}
              </div>
            ))}
            {isTyping && (
              <div className={styles.typingIndicator}>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
                <div className={styles.dot}></div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {!isTyping && suggestions.length > 0 && (
            <div style={{ padding: '0 1rem 0.5rem' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Oft gefragt zu deiner Box:</p>
              <div className={styles.suggestions}>
                {suggestions.map((sug, idx) => (
                  <button key={idx} className={styles.suggestionBadge} onClick={() => handleSend(sug)}>
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className={styles.chatbotInputArea}>
            <input 
              type="text" 
              className={styles.chatbotInput}
              placeholder="Frag mich etwas..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend(inputValue)}
            />
            <button className={styles.sendButton} onClick={() => handleSend(inputValue)}>
              <Send size={18} style={{ marginLeft: '-2px' }} />
            </button>
          </div>
          
          <div className={styles.disclaimer}>
            ⚠️ Demo-Modus. Ersetzt keinen ärztlichen Rat.
          </div>
        </div>
      )}

      {!isOpen && (
        <button className={styles.chatbotButton} onClick={() => setIsOpen(true)} aria-label="Chatbot öffnen">
          <MessageSquare size={28} />
        </button>
      )}
    </div>
  );
}
