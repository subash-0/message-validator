
import { HeroSection } from "@/components/HeroSection"
import { HowItWorksSection } from "@/components/HowItWorks"
import { TestimonialsSection } from "@/components/TestimonialsSection"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <main>
        <HeroSection />
        <HowItWorksSection />
        <TestimonialsSection />
      </main>
 
    </div>
  )
}
