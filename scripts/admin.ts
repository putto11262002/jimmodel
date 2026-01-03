#!/usr/bin/env tsx

// Load environment variables from .env.local before any other imports
import { config } from "dotenv";
config({ path: ".env.local" });

import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import {
  createUser,
  listUsers,
  updateUser,
  setPassword,
  deleteUser,
  type CreateArgs,
  type ListArgs,
  type UpdateArgs,
  type SetPasswordArgs,
  type DeleteArgs,
} from "./commands/user";

/**
 * Admin CLI Tool for JimModel
 *
 * Usage:
 *   pnpm admin user create [--name] [--email] [--password] [--verified]
 *   pnpm admin user list [--json]
 *   pnpm admin user update <email> [--name] [--email] [--verified/--unverified]
 *   pnpm admin user set-password <email> [--password]
 *   pnpm admin user delete <email> [--force]
 */

yargs(hideBin(process.argv))
  .scriptName("admin")
  .usage("$0 <command> [options]")
  .command("user", "User management commands", (yargs) => {
    return yargs
      .command<CreateArgs>(
        "create",
        "Create a new user",
        (yargs) => {
          return yargs
            .option("name", {
              type: "string",
              description: "User's name",
            })
            .option("email", {
              type: "string",
              description: "User's email address",
            })
            .option("password", {
              type: "string",
              description: "User's password (min 8 characters)",
            })
            .option("verified", {
              type: "boolean",
              description: "Mark email as verified",
              default: false,
            });
        },
        createUser
      )
      .command<ListArgs>(
        "list",
        "List all users",
        (yargs) => {
          return yargs.option("json", {
            type: "boolean",
            description: "Output as JSON",
            default: false,
          });
        },
        listUsers
      )
      .command<UpdateArgs>(
        "update <email>",
        "Update a user",
        (yargs) => {
          return yargs
            .positional("email", {
              type: "string",
              description: "Email of the user to update",
              demandOption: true,
            })
            .option("name", {
              type: "string",
              description: "New name for the user",
            })
            .option("new-email", {
              type: "string",
              description: "New email address for the user",
            })
            .option("verified", {
              type: "boolean",
              description: "Mark email as verified",
            })
            .option("unverified", {
              type: "boolean",
              description: "Mark email as unverified",
            })
            .conflicts("verified", "unverified");
        },
        updateUser
      )
      .command<SetPasswordArgs>(
        "set-password <email>",
        "Set a user's password",
        (yargs) => {
          return yargs
            .positional("email", {
              type: "string",
              description: "Email of the user",
              demandOption: true,
            })
            .option("password", {
              type: "string",
              description: "New password (min 8 characters)",
            });
        },
        setPassword
      )
      .command<DeleteArgs>(
        "delete <email>",
        "Delete a user",
        (yargs) => {
          return yargs
            .positional("email", {
              type: "string",
              description: "Email of the user to delete",
              demandOption: true,
            })
            .option("force", {
              type: "boolean",
              alias: "f",
              description: "Skip confirmation prompt",
              default: false,
            });
        },
        deleteUser
      )
      .demandCommand(1, "You must specify a user command")
      .help();
  })
  .demandCommand(1, "You must specify a command")
  .strict()
  .help()
  .version(false)
  .parse();
