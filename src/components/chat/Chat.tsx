import { useEffect, useRef, useState, forwardRef } from "react";
import { Send } from "lucide-react";
import { signInAnonymously, onAuthStateChanged, type User } from "firebase/auth";
import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";
import { cn } from "@/lib/utils";
import { auth, db, isFirebaseConfigured } from "@/lib/firebase";
import managerAvatar from "@/assets/manager-avatar.jpg";

type Role = "manager" | "user";

interface Message {
  id: string;
  role: Role;
  text: string;
  createdAt: Date | null;
}

const WELCOME_TEXT =
  "Здравствуйте! Я на связи. Расскажите, какую вакансию вы ищете?";

const AUTO_REPLIES = [
  "Спасибо! Уточните, пожалуйста, желаемый город и формат работы — офис, удалёнка или гибрид?",
  "Понял вас. Какой у вас опыт работы и ожидания по зарплате?",
  "Отлично! Я подготовлю подборку из 3–5 проверенных вакансий и пришлю в течение 48 часов.",
  "Если удобно, оставьте Telegram или номер телефона — HR-эксперт свяжется лично.",
];

function formatTime(d: Date | null): string {
  const date = d ?? new Date();
  return date.toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
}

export const Chat = forwardRef<HTMLDivElement>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const replyIndex = useRef(0);
  const welcomeSeeded = useRef(false);

  // Auth: sign in anonymously
  useEffect(() => {
    if (!isFirebaseConfigured || !auth) {
      // Fallback: local-only mode
      setMessages([
        { id: "local-welcome", role: "manager", text: WELCOME_TEXT, createdAt: new Date() },
      ]);
      return;
    }
    const unsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u);
      } else {
        signInAnonymously(auth!).catch((e) => {
          console.error(e);
          setError("Не удалось подключиться к чату. Проверьте настройки Firebase.");
        });
      }
    });
    return unsub;
  }, []);

  // Subscribe to this user's message thread
  useEffect(() => {
    if (!isFirebaseConfigured || !db || !user) return;

    const messagesRef = collection(db, "chats", user.uid, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsub = onSnapshot(
      q,
      async (snap) => {
        const next: Message[] = snap.docs.map((d) => {
          const data = d.data() as {
            role: Role;
            text: string;
            createdAt: Timestamp | null;
          };
          return {
            id: d.id,
            role: data.role,
            text: data.text,
            createdAt: data.createdAt?.toDate() ?? null,
          };
        });

        // Seed welcome message on first visit
        if (next.length === 0 && !welcomeSeeded.current) {
          welcomeSeeded.current = true;
          try {
            await addDoc(messagesRef, {
              role: "manager",
              text: WELCOME_TEXT,
              createdAt: serverTimestamp(),
            });
          } catch (e) {
            console.error(e);
          }
          return;
        }
        setMessages(next);
      },
      (e) => {
        console.error(e);
        setError("Ошибка загрузки сообщений. Проверьте правила Firestore.");
      }
    );
    return unsub;
  }, [user]);

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  async function send() {
    const text = input.trim();
    if (!text) return;
    setInput("");

    if (isFirebaseConfigured && db && user) {
      const messagesRef = collection(db, "chats", user.uid, "messages");
      try {
        await addDoc(messagesRef, {
          role: "user",
          text,
          createdAt: serverTimestamp(),
        });
        setTyping(true);
        const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
        replyIndex.current += 1;
        window.setTimeout(async () => {
          setTyping(false);
          try {
            await addDoc(messagesRef, {
              role: "manager",
              text: reply,
              createdAt: serverTimestamp(),
            });
          } catch (e) {
            console.error(e);
          }
        }, 1100 + Math.random() * 700);
      } catch (e) {
        console.error(e);
        setError("Не удалось отправить сообщение.");
      }
      return;
    }

    // Local fallback
    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      text,
      createdAt: new Date(),
    };
    setMessages((m) => [...m, userMsg]);
    setTyping(true);
    const reply = AUTO_REPLIES[replyIndex.current % AUTO_REPLIES.length];
    replyIndex.current += 1;
    window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [
        ...m,
        { id: crypto.randomUUID(), role: "manager", text: reply, createdAt: new Date() },
      ]);
    }, 1100 + Math.random() * 700);
  }

  return (
    <section ref={ref} className="mx-auto w-full max-w-2xl px-4 pb-16">
      <div className="overflow-hidden rounded-3xl border border-border bg-surface shadow-glow">
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-border bg-surface-elevated/80 px-4 py-3 backdrop-blur">
          <div className="relative">
            <img
              src={managerAvatar}
              alt="Менеджер по подбору вакансий"
              loading="lazy"
              width={40}
              height={40}
              className="h-10 w-10 rounded-full object-cover ring-2 ring-primary/30"
            />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-elevated bg-success animate-pulse-dot" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-foreground">Анна, менеджер по подбору</p>
            <p className="text-xs text-success">онлайн</p>
          </div>
        </header>

        {!isFirebaseConfigured && (
          <div className="border-b border-border bg-accent/40 px-4 py-2 text-xs text-muted-foreground">
            ⚠️ Firebase не настроен — чат работает в локальном режиме. Заполните{" "}
            <code className="rounded bg-background/60 px-1">src/lib/firebase.ts</code>.
          </div>
        )}

        {error && (
          <div className="border-b border-border bg-destructive/15 px-4 py-2 text-xs text-destructive">
            {error}
          </div>
        )}

        {/* Messages */}
        <div
          ref={scrollRef}
          className="h-[480px] space-y-3 overflow-y-auto bg-background/40 px-4 py-5"
        >
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {typing && <TypingIndicator />}
        </div>

        {/* Input */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="flex items-center gap-2 border-t border-border bg-surface-elevated/80 p-3 backdrop-blur"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Напишите сообщение..."
            aria-label="Сообщение"
            className="flex-1 rounded-full border border-border bg-background/60 px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-ring/40"
          />
          <button
            type="submit"
            disabled={!input.trim()}
            aria-label="Отправить"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-primary text-primary-foreground shadow-glow transition hover:opacity-95 active:scale-95 disabled:opacity-40 disabled:hover:opacity-40"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </section>
  );
});
Chat.displayName = "Chat";

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";
  return (
    <div className={cn("flex w-full animate-bubble-in", isUser ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[78%] rounded-2xl px-4 py-2.5 shadow-bubble",
          isUser
            ? "bg-bubble-user rounded-br-sm"
            : "bg-bubble-manager text-bubble-manager-foreground rounded-bl-sm"
        )}
      >
        <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{message.text}</p>
        <p
          className={cn(
            "mt-1 text-right text-[10px]",
            isUser ? "text-primary-foreground/70" : "text-muted-foreground"
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex justify-start animate-bubble-in">
      <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-sm bg-bubble-manager px-4 py-3 shadow-bubble">
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: "0ms" }} />
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: "150ms" }} />
        <span className="typing-dot inline-block h-1.5 w-1.5 rounded-full bg-muted-foreground" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
