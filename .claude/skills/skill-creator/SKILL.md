---
name: skill-creator
description: Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Claude's capabilities with specialized knowledge, workflows, or tool integrations.
license: Complete terms in LICENSE.txt
---

# Skill Creator

This skill provides guidance for creating effective skills.

## About Skills

Skills are modular packages that extend Claude with specialized workflows, foundational domain knowledge, and reusable tools. They serve as structured onboarding guides for specific areas, enabling procedural execution that general-purpose models cannot reliably recall or infer.

### What Skills Provide

1. Specialized workflows and repeatable procedures
2. Tool integrations and deterministic scripts
3. Domain expertise and custom schemas
4. Bundled reusable assets and templates

### Anatomy of a Skill

```
skill-name/
├── SKILL.md (required)
│   ├── YAML frontmatter metadata (required)
│   └── High-level instructions and workflow index (required)
└── Bundled Resources (optional)
    ├── scripts/      - Executable code
    ├── references/   - Loadable reference docs
    └── assets/       - Output assets/templates
```

### SKILL.md (required)

**Purpose:** High-level instruction layer and navigation hub.

**Required behavior:**

* Act as the top-level index and control surface
* Stay concise; link out to references, workflows, and checklists for depth
* Store core workflow logic, trigger conditions, and usage rules
* Reference local files instead of embedding verbose detail

### Bundled Resources

#### Scripts (`scripts/`)

Deterministic code for repeated tasks.
Include when repeated code rewriting or reliability is required.
Claude may patch scripts, but keeps them external to minimize token load.

#### References (`references/`)

Context-loaded documentation, schemas, and domain details.
Store depth here; SKILL.md should point to these files, not duplicate content.

Use cases: schema docs, policy manuals, API docs, domain rules.

#### Assets (`assets/`)

Files used in outputs (templates, icons, boilerplate).
Not intended for model context — used as external output material.

### Progressive Disclosure

Skills follow a 3-layer load strategy:

1. Metadata (always present)
2. SKILL.md (loaded when triggered, <5k words)
3. Bundled resources (loaded selectively as needed)

## Skill Creation Process

### Step 1: Understand the Skill with Concrete Examples

Define real usage patterns and trigger phrases.
Gather or generate example tasks to clarify the scope before writing.

Stop when usage patterns and triggers are clearly defined.

### Step 2: Plan Reusable Contents

For each expected workflow:

1. Break it down into execution steps
2. Identify scripts, references, and assets needed

Goal: design reusable building blocks once, then automate their reuse.

### Step 3: Initialize the Skill

When new: run `init_skill.py` to scaffold structure.

```bash
scripts/init_skill.py <skill-name> --path <output-directory>
```

Outputs template directories and placeholders to customize.

### Step 4: Edit the Skill

#### Build reusable resources first

Create scripts, references, and assets that implement your workflows.
Remove default placeholders not required.

#### Update SKILL.md

**Writing rules:**

* Imperative/objective voice
* Verb-first, instructional tone
* No second-person phrasing

SKILL.md must:

1. State the skill’s purpose
2. Define trigger conditions
3. Refer to scripts/references/assets as execution steps
4. Enumerate the key workflows and explicitly link each workflow to its corresponding workflow file and checklist file

**Workflows and checklists requirements:**

* Define workflows as concrete, stepwise procedures stored in separate files (for example under `references/workflows/`)
* For every workflow, create a paired checklist file that captures the same procedure as concise verification steps
* In SKILL.md, reference both the workflow document and its checklist so Claude knows where to load detailed steps vs. quick validation lists
* Treat SKILL.md as the index of “which workflows exist and when to use them,” and treat workflow/checklist files as “how to execute and verify them in detail”

SKILL.md is the index; depth lives in referenced files.

### Step 5: Package the Skill

```bash
scripts/package_skill.py <path/to/skill-folder>
```

Validates structure, metadata, references, and quality.
Creates `<skill-name>.zip` when valid.

### Step 6: Iterate

Use the skill, observe failures or friction, then refine:

* Improve workflows
* Add or adjust resources
* Update guidance based on real interaction feedback

Repeat until the skill performs reliably in real usage.
