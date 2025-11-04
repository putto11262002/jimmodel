# Checklist: Component Documentation Completeness

Use this checklist to validate that component documentation is complete and ready.

## Essential Sections

- [ ] **Overview** - Clear 1-2 sentence description of what was implemented
- [ ] **Files & Locations** - All key files listed with relative paths (e.g., `app/lib/auth.ts`)
- [ ] **Technologies & Libraries** - All libraries/services mentioned with versions
- [ ] **Configuration** - Environment variables, config files, setup steps documented
- [ ] **How It Works** - Brief explanation of implementation/flow with file references

## Validation Checks

- [ ] All file paths are correct and exist in the project
- [ ] Library versions match what's in `package.json`
- [ ] External documentation links are included (if applicable)
- [ ] No placeholder text remains
- [ ] Language is clear for developers unfamiliar with this component
- [ ] Related documentation links are included (internal and external)

## Optional but Recommended

- [ ] **Future Considerations** - Known limitations, tech debt, or planned improvements
- [ ] **Examples** - Code snippets showing how to use the component (if applicable)
- [ ] **Related Components** - Links to related features in the project

## File Location & Naming

- [ ] File is at: `docs/components/[component-name].md`
- [ ] File name is in kebab-case: `component-name.md` (not CamelCase or snake_case)
- [ ] Parent directory `docs/components/` exists

## Final Review

- [ ] File created/updated successfully
- [ ] Content matches git exploration findings
- [ ] Future developer can understand the implementation from this doc alone
- [ ] Ready for commit and sharing with team
