import { Card, CardContent } from "@/components/ui/card"
import { Star } from "lucide-react"

export function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah M.",
      role: "Content Creator",
      content:
        "Finally, a way to get honest feedback without the fear of judgment. My audience loves sharing their thoughts anonymously!",
      rating: 5,
    },
    {
      name: "Alex K.",
      role: "Student",
      content:
        "Perfect for getting anonymous questions during my study groups. It's made our discussions so much more open and helpful.",
      rating: 5,
    },
    {
      name: "Jordan P.",
      role: "Small Business Owner",
      content:
        "Customer feedback has never been easier to collect. People are more honest when they can share anonymously.",
      rating: 5,
    },
  ]

  return (
    <section id="testimonials" className="py-20 sm:py-32">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance">
            Loved by Thousands
          </h2>
          <p className="mt-4 text-lg text-muted-foreground text-pretty">
            See what our users are saying about Session Message
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                    ))}
                  </div>
                  <blockquote className="text-card-foreground mb-4 text-pretty">{testimonial.content}</blockquote>
                  <div>
                    <div className="font-semibold text-card-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
