---
description: [Command that uses MCP tools]
argument-hint: [expected arguments]
allowed-tools: [mcp__servername__toolname]
---

[Your command that integrates with MCP tools]

Example MCP tool patterns:

# Approve all tools from a server:
# allowed-tools: [mcp__github]

# Approve specific tools:
# allowed-tools: [mcp__github__get_issue, mcp__github__search_issues]

# Mix built-in and MCP tools:
# allowed-tools: [View, mcp__github__create_pr, mcp__slack__send_message]

$ARGUMENTS
