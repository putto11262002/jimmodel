import { Facebook, Instagram, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="w-full bg-background">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="mb-4">
              <Logo size="md" showText={true} className="w-fit" />
            </div>
            <p className="text-sm text-muted-foreground">
              Connecting exceptional talent with world-class opportunities
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/models"
                  className="hover:text-foreground transition-colors"
                >
                  Models
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-foreground transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-foreground transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Talents */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Talents
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/models/female"
                  className="hover:text-foreground transition-colors"
                >
                  Female
                </Link>
              </li>
              <li>
                <Link
                  href="/models/male"
                  className="hover:text-foreground transition-colors"
                >
                  Male
                </Link>
              </li>
              <li>
                <Link
                  href="/models/kids"
                  className="hover:text-foreground transition-colors"
                >
                  Kids
                </Link>
              </li>
              <li>
                <Link
                  href="/models/seniors"
                  className="hover:text-foreground transition-colors"
                >
                  Seniors
                </Link>
              </li>
              <li>
                <Link
                  href="/models/non-binary"
                  className="hover:text-foreground transition-colors"
                >
                  Non-Binary
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              Contact
            </h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a
                  href="tel:+66815565126"
                  className="hover:text-foreground transition-colors"
                >
                  +66 81-556-5126
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a
                  href="mailto:jim@jimmodel.com"
                  className="hover:text-foreground transition-colors"
                >
                  jim@jimmodel.com
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Instagram className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://instagram.com/jim_model"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  @jim_model
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Facebook className="w-4 h-4 flex-shrink-0" />
                <a
                  href="https://facebook.com/jimmodeling"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-foreground transition-colors"
                >
                  jimmodeling
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-12" />

        {/* Bottom Section */}
        <div className="flex items-center justify-center gap-4 flex-col text-left lg:text-center">
          <p className="text-sm text-muted-foreground ">
            1201/5 Town in town soi 2, Phlabphla, Wang Thonglang, Bangkok, 10310
          </p>
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 J.I.M. Modeling Agency. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
