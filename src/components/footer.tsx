import { MessageSquare } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquare className="h-6 w-6 text-primary" />
              <span className="text-lg font-bold text-foreground">Session Message</span>
            </div>
            <p className="text-muted-foreground text-pretty max-w-md">
              The safest and easiest way to receive anonymous messages. Connect with your audience without barriers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-2">
              <li>
                <a href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
                  Loves
                </a>
              </li>
              
            </ul>
          </div>

        
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} Session Message. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
