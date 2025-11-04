#!/usr/bin/env python3
"""
Initialize a new slash command with interactive prompts.
Usage: python init_command.py [command-name] [--project|--user]
"""

import argparse
import os
import sys
from pathlib import Path


TEMPLATES = {
    "basic": """---
description: {description}
---

{prompt}

$ARGUMENTS
""",
    "file-analysis": """---
description: {description}
argument-hint: <filepath>
allowed-tools: [View]
---

Analyze the file: @$1

{prompt}

Provide specific recommendations and actionable feedback.
""",
    "multi-arg": """---
description: {description}
argument-hint: {arg_hint}
allowed-tools: [{tools}]
---

Execute command with parameters:

**Argument 1:** $1
**Argument 2:** $2

{prompt}
""",
    "git-workflow": """---
description: {description}
allowed-tools: [Bash]
---

Analyze the git repository state:

Current status:
!git status

Recent commits:
!git log --oneline -5

{prompt}
""",
}


def get_command_dir(is_project: bool) -> Path:
    """Get the appropriate commands directory."""
    if is_project:
        return Path(".claude/commands")
    else:
        return Path.home() / ".claude/commands"


def create_command(name: str, template_type: str, is_project: bool):
    """Create a new slash command file."""
    
    # Get user input
    print(f"\nCreating slash command: /{name}")
    print(f"Type: {template_type}")
    print(f"Scope: {'project' if is_project else 'user'}")
    print()
    
    description = input("Description (shown in /help): ").strip()
    if not description:
        print("Error: Description is required")
        sys.exit(1)
    
    prompt = input("Main prompt/instructions: ").strip()
    if not prompt:
        print("Error: Prompt is required")
        sys.exit(1)
    
    # Template-specific fields
    kwargs = {
        "description": description,
        "prompt": prompt,
    }
    
    if template_type == "multi-arg":
        arg_hint = input("Argument hint (e.g., '<arg1> <arg2>'): ").strip()
        tools = input("Allowed tools (e.g., 'CreateFile, Edit, View'): ").strip()
        kwargs["arg_hint"] = arg_hint or "<arg1> <arg2>"
        kwargs["tools"] = tools or "CreateFile, Edit"
    
    # Generate content
    content = TEMPLATES[template_type].format(**kwargs)
    
    # Determine output path
    cmd_dir = get_command_dir(is_project)
    cmd_dir.mkdir(parents=True, exist_ok=True)
    
    output_path = cmd_dir / f"{name}.md"
    
    if output_path.exists():
        overwrite = input(f"\n{output_path} already exists. Overwrite? (y/N): ")
        if overwrite.lower() != 'y':
            print("Cancelled.")
            sys.exit(0)
    
    # Write file
    output_path.write_text(content)
    
    print(f"\n✅ Created slash command: {output_path}")
    print(f"\nYou can now use it with: /{name}")
    print(f"\nEdit the file to customize further: {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Initialize a new slash command")
    parser.add_argument("name", help="Command name (without /)")
    parser.add_argument(
        "--project", 
        action="store_true", 
        help="Create project-level command (.claude/commands/)"
    )
    parser.add_argument(
        "--user", 
        action="store_true", 
        help="Create user-level command (~/.claude/commands/)"
    )
    parser.add_argument(
        "--template",
        choices=list(TEMPLATES.keys()),
        default="basic",
        help="Template type to use"
    )
    
    args = parser.parse_args()
    
    # Validate scope
    if args.project and args.user:
        print("Error: Cannot specify both --project and --user")
        sys.exit(1)
    
    is_project = args.project or not args.user
    
    # Validate command name
    if not args.name.replace("-", "").replace("_", "").isalnum():
        print("Error: Command name must be alphanumeric (with - or _)")
        sys.exit(1)
    
    create_command(args.name, args.template, is_project)


if __name__ == "__main__":
    main()
