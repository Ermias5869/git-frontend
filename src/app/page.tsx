// src/app/page.tsx
import { ModeToggle } from "@/components/darkToggle";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">CommitForge</h1>
          <ModeToggle />
        </div>
      </header>

      <main className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl font-bold mb-4">Welcome to CommitForge</h2>
        <p className="text-muted-foreground mb-8">
          AI-powered Git commit generation
        </p>
        <Button size="lg">Get Started</Button>
      </main>
    </div>
  );
}
