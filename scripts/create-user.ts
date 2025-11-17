#!/usr/bin/env tsx

import * as readline from "readline/promises";
import { stdin as input, stdout as output } from "process";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { eq } from "drizzle-orm";

/**
 * CLI script to create a new authentication user
 *
 * Usage:
 *   pnpm create-user
 *   pnpm tsx scripts/create-user.ts
 */

// Color codes for terminal output
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message: string, color: keyof typeof colors = "reset") {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function error(message: string) {
  log(`✗ ${message}`, "red");
}

function success(message: string) {
  log(`✓ ${message}`, "green");
}

function info(message: string) {
  log(`ℹ ${message}`, "cyan");
}

function warning(message: string) {
  log(`⚠ ${message}`, "yellow");
}

// Validate email format
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Validate password requirements
function isValidPassword(password: string): { valid: boolean; error?: string } {
  if (password.length < 8) {
    return { valid: false, error: "Password must be at least 8 characters long" };
  }
  if (password.length > 128) {
    return { valid: false, error: "Password must be less than 128 characters" };
  }
  return { valid: true };
}

async function createUser() {
  const rl = readline.createInterface({ input, output });

  try {
    log("\n" + "=".repeat(50), "bright");
    log("       Create New Authentication User", "bright");
    log("=".repeat(50) + "\n", "bright");

    // Prompt for user details
    const name = await rl.question("Name: ");
    if (!name.trim()) {
      error("Name is required");
      process.exit(1);
    }

    const email = await rl.question("Email: ");
    if (!isValidEmail(email)) {
      error("Invalid email format");
      process.exit(1);
    }

    const password = await rl.question("Password (min 8 chars): ");
    const passwordValidation = isValidPassword(password);
    if (!passwordValidation.valid) {
      error(passwordValidation.error!);
      process.exit(1);
    }

    const emailVerifiedInput = await rl.question("Email verified? (y/N): ");
    const shouldVerifyEmail = emailVerifiedInput.toLowerCase() === "y";

    rl.close();

    console.log();
    info("Checking if user already exists...");

    // Check if user already exists
    const existingUser = await db.query.user.findFirst({
      where: eq(user.email, email.toLowerCase().trim()),
    });

    if (existingUser) {
      error(`User with email ${email} already exists`);
      process.exit(1);
    }

    info("Creating user with Better Auth...");

    // Use Better Auth's API to create the user
    // This ensures password is hashed correctly and all relations are set up properly
    const request = new Request("http://localhost:3000/api/auth/sign-up/email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.toLowerCase().trim(),
        password: password,
        name: name.trim(),
      }),
    });

    const response = await auth.handler(request);
    const result = await response.json();

    if (!response.ok) {
      error(`Failed to create user: ${result.error || "Unknown error"}`);
      console.error(result);
      process.exit(1);
    }

    success("User created successfully!");

    // Get the created user to show details
    const createdUser = await db.query.user.findFirst({
      where: eq(user.email, email.toLowerCase().trim()),
    });

    if (!createdUser) {
      error("User was created but could not be retrieved");
      process.exit(1);
    }

    // Update email verification status if requested
    if (shouldVerifyEmail && !createdUser.emailVerified) {
      info("Marking email as verified...");
      await db
        .update(user)
        .set({ emailVerified: true })
        .where(eq(user.id, createdUser.id));
      success("Email marked as verified");
    }

    console.log();
    log("=".repeat(50), "green");
    success("User created successfully!");
    log("=".repeat(50), "green");
    console.log();
    log("User Details:", "bright");
    log(`  ID:             ${createdUser.id}`);
    log(`  Name:           ${createdUser.name}`);
    log(`  Email:          ${createdUser.email}`);
    log(`  Email Verified: ${shouldVerifyEmail ? "Yes" : "No"}`);
    log(`  Created At:     ${createdUser.createdAt.toISOString()}`);
    console.log();

    info("User can now sign in at http://localhost:3000/admin/signin");

  } catch (err) {
    console.log();
    error("Failed to create user");
    if (err instanceof Error) {
      error(err.message);
      console.error(err);
    }
    process.exit(1);
  }
}

// Run the script
createUser();
