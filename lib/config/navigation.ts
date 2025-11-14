/**
 * Navigation Configuration
 *
 * This file defines the navigation structure for the public website.
 * Routes support hierarchy through the `children` property for nested navigation.
 *
 * Usage:
 * - Add new routes by adding objects to the array
 * - Create hierarchical navigation by adding `children` array
 * - Remove routes by deleting the corresponding object
 * - Reorder by moving objects in the array
 */

export interface NavItem {
  /** Display label for the navigation item */
  label: string;
  /** URL path (use "#" for items that only have children) */
  href: string;
  /** Optional children for nested navigation */
  children?: NavItem[];
  /** Optional icon (lucide-react icon name) */
  icon?: string;
  /** Optional description for dropdown items */
  description?: string;
}

export const publicNavigation: NavItem[] = [
  {
    label: "Models",
    href: "#",
    description: "Browse our diverse talent roster",
    children: [
      {
        label: "Female",
        href: "/models/female",
        description: "Female models and talent",
      },
      {
        label: "Male",
        href: "/models/male",
        description: "Male models and talent",
      },
      {
        label: "Kids",
        href: "/models/kids",
        description: "Child models and talent",
      },
      {
        label: "Seniors",
        href: "/models/seniors",
        description: "Senior models and talent",
      },
      {
        label: "Non-Binary",
        href: "/models/non-binary",
        description: "Non-binary models and talent",
      },
    ],
  },
  {
    label: "About Us",
    href: "/about",
    description: "Learn about our agency",
  },
  {
    label: "Apply",
    href: "/apply",
    description: "Join our talent roster",
  },
  {
    label: "Contact",
    href: "/contact",
    description: "Get in touch with us",
  },
];
