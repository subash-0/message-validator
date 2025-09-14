import { Card, CardContent } from "@/components/ui/card"
import { UserPlus, Link, MessageCircle } from "lucide-react"

export function HowItWorksSection() {
  const steps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up in seconds with just your email. No personal information required.",
    },
    {
      icon: Link,
      title: "Get Your Link",
      description: "Receive a unique, shareable link that's yours forever. Customize it if you want.",
    },
    {
      icon: MessageCircle,
      title: "Receive Messages",
      description: "Share your link anywhere and start receiving anonymous messages instantly.",
    },
  ]

  return (
    <section id="how-it-works" className="py-20 sm:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">How It Works</h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            Three simple steps to start receiving anonymous messages
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-5xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {steps.map((step, index) => (
              <Card key={index} className="relative bg-card border-border hover:shadow-lg transition-shadow">
                <CardContent className="p-8 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                    <step.icon className="h-8 w-8 text-primary" />
                  </div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-accent text-accent-foreground rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                  <h3 className="text-xl font-semibold text-card-foreground mb-4">{step.title}</h3>
                  <p className="text-muted-foreground text-pretty">{step.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
