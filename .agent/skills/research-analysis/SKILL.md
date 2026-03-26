---
name: research-analysis
description: Guides document analysis workflow — extracting key findings, identifying missing context, detecting conflicting information, formulating open questions, and structuring concise research briefs. Use when analyzing documents, creating summaries, preparing briefs, or reviewing research materials from Google Drive.
metadata:
  autoload: true
  version: "1.0"
---

# Research Analysis Workflow

Follow this structured workflow when analyzing documents and preparing research briefs.

## Step 1: Document Retrieval

When the user requests analysis of a document:
1. Search for the document in Google Drive using the available MCP tools
2. If found, download/export the document content
3. If the document is a Google Workspace file (Docs, Sheets, Slides), export it as plain text
4. Confirm the document identity with the user before proceeding

## Step 2: Content Extraction & Analysis

Read the full document carefully. As you read, identify and categorize:

**Key Findings** — Statements, data points, or conclusions that carry substantive weight. For each finding, assess importance:
- **High**: Core conclusions, critical data, primary arguments
- **Medium**: Supporting evidence, secondary conclusions, notable patterns
- **Low**: Minor details, background context, peripheral observations

**Missing Context** — Information that should exist but is absent:
- Referenced data or sources that are not provided
- Assumptions stated without evidence
- Undefined terms or unexplained acronyms
- Time periods, geographic scope, or populations not specified
- Methodology details that are incomplete

**Conflicting Information** — Contradictions within the document:
- Data points that disagree with stated conclusions
- Inconsistent figures or statistics
- Contradictory claims in different sections
- Logical inconsistencies in arguments

**Open Questions** — Issues requiring human judgment or further research:
- Ambiguous statements that could be interpreted multiple ways
- Claims that need external verification
- Strategic decisions implied but not addressed
- Dependencies on unknown future events

## Step 3: Brief Construction

Structure the output as a `ResearchBrief` component with:
1. A clear, specific title (not just the document name — describe the analysis)
2. Source document name and type
3. An executive summary of 2-4 sentences capturing the document's main message and significance
4. Key findings ordered by importance (high first)
5. All flags: missing context, conflicts, and open questions
6. Suggested action items when applicable (next steps the user should consider)

## Step 4: Saving to Notion

When the user wants to save a brief to Notion:
1. Create a new page in the user's Notion workspace
2. Structure the page with clear headings matching the brief sections
3. Use appropriate Notion blocks (headings, bulleted lists, callouts for flags)
4. Confirm success and provide the page reference

## Quality Standards

- Be specific — "Revenue figures are missing for Q3" not "Some data is missing"
- Distinguish between facts in the document and your interpretations
- When flagging conflicts, cite where in the document each side of the conflict appears
- Keep the executive summary genuinely concise — it should be readable in 15 seconds
- Action items should be concrete and actionable, not vague suggestions
