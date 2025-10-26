import { ReactNode } from "react";
import { Navbar } from "@/components/NavBar";

interface LayoutPublicProps {
  children: ReactNode;
}

export default function LayoutPublic({ children }: LayoutPublicProps) {
  return (
    <div>
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
