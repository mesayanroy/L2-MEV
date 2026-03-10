import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { HowItWorks } from "@/components/HowItWorks";
import { SupportedDexes } from "@/components/SupportedDexes";
import { CtaBanner } from "@/components/CtaBanner";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <HowItWorks />
      <SupportedDexes />
      <CtaBanner />
    </>
  );
}
