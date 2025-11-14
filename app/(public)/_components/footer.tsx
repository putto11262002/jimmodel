"use client";

import { Mail, Instagram, Linkedin, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="w-full bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-4">
              JimModel
            </h3>
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
                <a href="#" className="hover:text-foreground transition-colors">
                  Models
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Gallery
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  About
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* For Models */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              For Models
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Apply Now
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Requirements
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Benefits
                </a>
              </li>
            </ul>
          </div>

          {/* For Brands */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-4">
              For Brands
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Hire Talent
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Services
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-foreground transition-colors">
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border mb-12" />

        {/* Bottom Section */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-sm text-muted-foreground">
            © 2024 JimModel Agency. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-6">
            <a
              href="mailto:contact@jimmodel.com"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
