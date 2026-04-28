import Link from 'next/link';

export function Footer() {
  return (
    <footer className="border-t bg-muted/20">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-xl text-primary tracking-tight">
              Hustlix
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              The premium destination for connecting top-tier talent with ambitious companies worldwide.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-sm">For Clients</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/find-talent" className="hover:text-primary transition-colors">Find Freelancers</Link></li>
              <li><Link href="/dashboard/client" className="hover:text-primary transition-colors">Post a Project</Link></li>
              <li><Link href="/pricing" className="hover:text-primary transition-colors">Pricing</Link></li>
              <li><Link href="/dashboard/client" className="hover:text-primary transition-colors">Client Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">For Freelancers</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/projects" className="hover:text-primary transition-colors">Find Work</Link></li>
              <li><Link href="/profile" className="hover:text-primary transition-colors">Create Profile</Link></li>
              <li><Link href="/success-stories" className="hover:text-primary transition-colors">Success Stories</Link></li>
              <li><Link href="/dashboard/freelancer" className="hover:text-primary transition-colors">Freelancer Dashboard</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-sm">Company</h3>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-primary transition-colors">Careers</Link></li>
              <li><Link href="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
          <p>© {new Date().getFullYear()} Hustlix. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            {/* Social Icons Placeholder */}
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">X</div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">In</div>
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">Fb</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
