# AI Research Assistant — Technical Specification

## Overview
An AI Research Assistant that helps users turn documents and notes into clear, actionable outputs. Uses Google Drive to read source documents and Notion to store summaries and briefs. Reads documents, extracts key findings, summarizes what matters, prepares concise reviewable briefs, and highlights missing context, conflicting information, or open questions.

## Architecture

### MCP Integrations
- **Google Drive**: Read/search/download source documents
  - `GOOGLEDRIVE_FIND_FILE` — Search for documents
  - `GOOGLEDRIVE_DOWNLOAD_FILE` — Download file content
  - `GOOGLEDRIVE_EXPORT_GOOGLE_WORKSPACE_FILE` — Export Google Docs/Sheets as text
  - `GOOGLEDRIVE_GET_FILE_METADATA` — Get file info
- **Notion**: Store summaries and briefs
  - `NOTION_CREATE_NOTION_PAGE` — Create new pages for briefs
  - `NOTION_ADD_MULTIPLE_PAGE_CONTENT` — Add structured content blocks
  - `NOTION_SEARCH_NOTION_PAGE` — Search existing pages
  - `NOTION_FETCH_DATA` — Fetch workspace data
  - `NOTION_APPEND_TEXT_BLOCKS` — Append text content
  - `NOTION_APPEND_TABLE_BLOCKS` — Append tables

### Skill: research-analysis
Workflow guide for the agent covering:
- How to extract key findings from documents
- How to identify gaps, conflicts, and open questions
- How to structure a research brief
- Best practices for summarization

### Component: ResearchBrief
Rich UI component displaying analysis results with sections:
- Document metadata header (source, type, date)
- Executive summary
- Key findings (with importance badges)
- Flags section: missing context, conflicts, open questions
- Expandable sections via accordion

### Theme
Professional scholarly aesthetic: deep slate palette with warm amber accents for flags/alerts. Clean typography with clear hierarchy.

### Instruction
Define agent's role as Research Assistant, workflow for processing documents, and how/when to use components and integrations.

## Implementation Steps
1. Create theme and style foundation
2. Build ResearchBrief component
3. Create research-analysis skill
4. Write agent instruction
5. Connect Google Drive MCP
6. Connect Notion MCP
