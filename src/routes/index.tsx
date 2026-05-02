import { createFileRoute } from "@tanstack/react-router";
import { useRef } from "react";
import { Hero } from "@/components/chat/Hero";
import { Chat } from "@/components/chat/Chat";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const chatRef = useRef<HTMLDivElement>(null);

  function scrollToChat() {
    chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    // focus input
    window.setTimeout(() => {
      const input = chatRef.current?.querySelector<HTMLInputElement>('input[type="text"]');
      input?.focus();
    }, 500);
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Hero onCtaClick={scrollToChat} />
      <Chat ref={chatRef} />
      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Подбор вакансий по России и СНГ
      </footer>
    </main>
  );
}
