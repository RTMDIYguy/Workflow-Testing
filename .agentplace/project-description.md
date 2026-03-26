# AI Research Assistant

## Overview
An AI-powered research assistant that turns documents and notes into clear, actionable outputs. Reads source documents from Google Drive, analyzes them for key findings and gaps, presents structured briefs via a custom UI component, and saves results to Notion.

## Architecture

### Integrations
- **Google Drive (MCP)**: Search, read, export, and download documents — supports Google Docs, Sheets, PDFs, and plain text files
- **Notion (MCP)**: Create pages, add structured content blocks, append text and tables for storing research briefs

### Components
- **ResearchBrief**: Rich card displaying executive summary, key findings (with importance ratings), review flags (missing context, conflicting information, open questions), suggested action items, and a "Save to Notion" CTA button

### Skills
- **research-analysis** (autoloaded): Step-by-step workflow for document analysis — extraction, categorization, brief construction, quality standards

### Theme
- Scholarly warm light palette: ivory backgrounds, deep slate text, amber accents
- Typography: DM Serif Display (headings) + DM Sans (body)
- Warm radial gradient background with token-based colors

## Key Features
1. Search and retrieve documents from Google Drive
2. Extract key findings with importance levels (high/medium/low)
3. Flag missing context, conflicting information, and open questions
4. Present results in a structured, collapsible ResearchBrief component
5. Save completed briefs to Notion with structured page formatting
6. Multi-document cross-analysis support
