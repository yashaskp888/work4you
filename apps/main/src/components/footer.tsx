import Link from "next/link";
import { Mail, Phone, MapPin } from "lucide-react";
import { Logo } from "@/components/logo";
import { REQUEST_URL } from "@/lib/utils";

const footerLinks = {
  Services: [
    "Custom Website Development",
    "Website Management",
    "E-Commerce Solutions",
    "Real Estate, Plots & Construction",
  ],
  Company: [
    { label: "About Us", href: "#about" },
    { label: "Our Process", href: "#process" },
    { label: "Contact", href: "#contact" },
  ],
  Resources: [
    { label: "Let's Get Started", href: REQUEST_URL },
    { label: "Admin Panel", href: "/admin" },
    { label: "Support", href: "#contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12 pb-12 border-b border-border/50">
          <p className="text-xl sm:text-2xl font-medium italic text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            &ldquo;Your Vision. Our Expertise. One Powerful Digital Presence.&rdquo;
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <Logo variant="footer" className="inline-block" />
            </div>
            <p className="text-muted-foreground max-w-sm mb-6">
              Premium websites, scalable solutions, and end-to-end website management for
              organizations and growing businesses.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" /> connect@work4you.co.in
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" /> +91 81057 12548
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" /> Bengaluru, India
              </p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.Services.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.Company.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {footerLinks.Resources.map((item) => (
                <li key={item.label}>
                  <Link href={item.href} className="hover:text-primary transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Work4You. All rights reserved.</p>
          <p>Crafted with precision for the digital age.</p>
        </div>
      </div>
    </footer>
  );
}
