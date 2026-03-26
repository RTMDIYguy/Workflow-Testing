import React, { type FC, useState, useEffect } from 'react';
import {
  FileText,
  Lightbulb,
  AlertTriangle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  BookOpen,
  Clock,
  Tag,
  Shield,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { Card } from '../shadcdn/card';
import { Badge } from '../shadcdn/badge';
import type { AsArgumentsProps, ComponentConfigT } from '@/app/lib/types';
import { registerComponent } from '@/app/lib/components/registry';

// ── Config ──────────────────────────────────────────────────────────────────

const config: ComponentConfigT = {
  type: 'component',
  isStreaming: true,
  componentName: 'ResearchBrief',
  name: 'ResearchBrief',
  isStrictSchema: true,
  description:
    'Displays a structured research brief with executive summary, key findings, flags for missing context, conflicting information, and open questions.',
  parameters: {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        description: 'Title of the research brief',
      },
      sourceDocument: {
        type: 'string',
        description: 'Name or identifier of the source document',
      },
      documentType: {
        type: 'string',
        description: 'Type of document (e.g., Report, Memo, Article, Notes)',
      },
      dateAnalyzed: {
        type: 'string',
        description: 'Date the analysis was performed (ISO or human-readable)',
      },
      executiveSummary: {
        type: 'string',
        description: 'A concise executive summary of the document (2-4 sentences)',
      },
      keyFindings: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            finding: { type: 'string', description: 'The key finding statement' },
            importance: {
              type: 'string',
              enum: ['high', 'medium', 'low'],
              description: 'Importance level of this finding',
            },
            detail: {
              type: 'string',
              description: 'Additional context or explanation for the finding',
            },
          },
          required: ['finding', 'importance'],
        },
        description: 'List of key findings extracted from the document',
      },
      missingContext: {
        type: 'array',
        items: { type: 'string' },
        description:
          'List of areas where context is missing or information is incomplete',
      },
      conflicts: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            description: {
              type: 'string',
              description: 'Description of the conflicting information',
            },
            sources: {
              type: 'string',
              description: 'Where in the document the conflict appears',
            },
          },
          required: ['description'],
        },
        description: 'List of conflicting or contradictory information found',
      },
      openQuestions: {
        type: 'array',
        items: { type: 'string' },
        description: 'Open questions that require manual review or further research',
      },
      actionItems: {
        type: 'array',
        items: { type: 'string' },
        description: 'Suggested next steps or action items based on the analysis',
      },
    },
    additionalProperties: false,
    required: [
      'title',
      'sourceDocument',
      'executiveSummary',
      'keyFindings',
      'missingContext',
      'conflicts',
      'openQuestions',
    ],
  },
};

// ── Types ────────────────────────────────────────────────────────────────────

type KeyFinding = {
  finding: string;
  importance: 'high' | 'medium' | 'low';
  detail?: string;
};

type Conflict = {
  description: string;
  sources?: string;
};

type ResearchBriefProps = {
  title: string;
  sourceDocument: string;
  documentType?: string;
  dateAnalyzed?: string;
  executiveSummary: string;
  keyFindings: KeyFinding[];
  missingContext: string[];
  conflicts: Conflict[];
  openQuestions: string[];
  actionItems?: string[];
};

// ── Static styles (module scope — not recreated per render) ──────────────────

const IMPORTANCE_STYLES: Record<string, string> = {
  high: 'bg-[hsl(var(--red-bg))] text-[hsl(var(--red-soft))] border-[hsl(var(--red-soft)/0.2)]',
  medium:
    'bg-[hsl(var(--amber-bg))] text-[hsl(var(--amber-soft))] border-[hsl(var(--amber-soft)/0.2)]',
  low: 'bg-[hsl(var(--blue-bg))] text-[hsl(var(--blue-soft))] border-[hsl(var(--blue-soft)/0.2)]',
};

// ── Subcomponents ────────────────────────────────────────────────────────────

const ImportanceBadge: FC<{ level: string }> = ({ level }) => {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${IMPORTANCE_STYLES[level] || IMPORTANCE_STYLES.low}`}
    >
      {level}
    </span>
  );
};

const CollapsibleSection: FC<{
  title: string;
  icon: React.ReactNode;
  count: number;
  accentColor: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, icon, count, accentColor, defaultOpen = false, children }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const sectionId = `section-${title.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div className="border border-border/60 rounded-lg overflow-hidden transition-all duration-200">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls={sectionId}
        className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors duration-150 hover:bg-muted/50 ${accentColor}`}
      >
        <div className="flex items-center gap-2.5">
          {icon}
          <span className="font-semibold text-sm text-foreground">
            {title}
          </span>
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted text-muted-foreground text-xs font-medium">
            {count}
          </span>
        </div>
        {isOpen ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>
      {isOpen && <div id={sectionId} className="px-4 pb-4 pt-2">{children}</div>}
    </div>
  );
};

// ── Main Component ───────────────────────────────────────────────────────────

const ResearchBriefComponent: FC<AsArgumentsProps<ResearchBriefProps>> = ({
  argumentsProps,
  handleSendMessage,
}) => {
  const [props, setProps] = useState<ResearchBriefProps>(argumentsProps);

  useEffect(() => {
    setProps(argumentsProps);
  }, [argumentsProps]);

  const {
    title = 'Research Brief',
    sourceDocument = '',
    documentType,
    dateAnalyzed,
    executiveSummary = '',
    keyFindings = [],
    missingContext = [],
    conflicts = [],
    openQuestions = [],
    actionItems = [],
  } = props;

  const flagCount = missingContext.length + conflicts.length + openQuestions.length;

  const handleSaveToNotion = () => {
    handleSendMessage({
      instruction: JSON.stringify({
        action: 'save_brief_to_notion',
        title,
        sourceDocument,
        documentType,
        dateAnalyzed,
        executiveSummary,
        keyFindings,
        missingContext,
        conflicts,
        openQuestions,
        actionItems,
      }),
    });
  };

  return (
    <div className="w-full max-w-full pb-12" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <Card className="overflow-hidden border border-border/50 bg-card/80 backdrop-blur-sm shadow-sm">
        {/* ── Header ─────────────────────────────────────────────────── */}
        <div className="relative px-5 pt-5 pb-4">
          {/* Subtle top accent line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[hsl(var(--amber-soft)/0.6)] via-[hsl(var(--amber-soft)/0.2)] to-transparent" />

          <div className="flex items-start gap-3.5">
            <div className="flex-shrink-0 mt-0.5 w-9 h-9 rounded-lg bg-[hsl(var(--amber-bg))] flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-[hsl(var(--amber-soft))]" />
            </div>
            <div className="flex-1 min-w-0">
              <h2
                className="text-lg font-bold text-foreground leading-tight tracking-tight"
                style={{ fontFamily: "'DM Serif Display', serif" }}
              >
                {title}
              </h2>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1.5">
                <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                  <FileText className="w-3 h-3" />
                  {sourceDocument}
                </span>
                {documentType && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Tag className="w-3 h-3" />
                    {documentType}
                  </span>
                )}
                {dateAnalyzed && (
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {dateAnalyzed}
                  </span>
                )}
              </div>
            </div>
            {flagCount > 0 && (
              <div className="flex-shrink-0">
                <Badge
                  variant="outline"
                  className="bg-[hsl(var(--amber-bg))] text-[hsl(var(--amber-soft))] border-[hsl(var(--amber-soft)/0.25)] text-xs font-medium"
                >
                  <Shield className="w-3 h-3 mr-1" />
                  {flagCount} flag{flagCount !== 1 ? 's' : ''}
                </Badge>
              </div>
            )}
          </div>
        </div>

        {/* ── Executive Summary ───────────────────────────────────── */}
        <div className="px-5 py-4 border-t border-border/40">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
            Executive Summary
          </h3>
          <p className="text-sm text-foreground/90 leading-relaxed">{executiveSummary}</p>
        </div>

        {/* ── Key Findings ────────────────────────────────────────── */}
        {keyFindings.length > 0 && (
          <div className="px-5 py-4 border-t border-border/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Key Findings
            </h3>
            <div className="space-y-2.5">
              {keyFindings.map((item, idx) => (
                <div
                  key={`finding-${idx}-${item.finding?.slice(0, 20)}`}
                  className="group flex items-start gap-3 p-3 rounded-lg bg-muted/30 border border-border/30 transition-colors duration-150 hover:bg-muted/50"
                >
                  <div className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Lightbulb className="w-3 h-3 text-[hsl(var(--amber-soft))]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-medium text-foreground leading-snug">
                        {item.finding}
                      </span>
                      <ImportanceBadge level={item.importance} />
                    </div>
                    {item.detail && (
                      <p className="text-xs text-muted-foreground leading-relaxed mt-1">
                        {item.detail}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Flags Section ───────────────────────────────────────── */}
        {flagCount > 0 && (
          <div className="px-5 py-4 border-t border-border/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Review Flags
            </h3>
            <div className="space-y-2.5">
              {/* Missing Context */}
              {missingContext.length > 0 && (
                <CollapsibleSection
                  title="Missing Context"
                  icon={<AlertTriangle className="w-4 h-4 text-[hsl(var(--amber-soft))]" />}
                  count={missingContext.length}
                  accentColor="bg-[hsl(var(--amber-bg)/0.3)]"
                  defaultOpen={true}
                >
                  <ul className="space-y-1.5">
                    {missingContext.map((item, idx) => (
                      <li key={`context-${idx}-${item?.slice(0, 20)}`} className="flex items-start gap-2 text-sm text-foreground/85">
                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[hsl(var(--amber-soft))]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              )}

              {/* Conflicts */}
              {conflicts.length > 0 && (
                <CollapsibleSection
                  title="Conflicting Information"
                  icon={<Shield className="w-4 h-4 text-[hsl(var(--red-soft))]" />}
                  count={conflicts.length}
                  accentColor="bg-[hsl(var(--red-bg)/0.3)]"
                  defaultOpen={true}
                >
                  <ul className="space-y-2">
                    {conflicts.map((item, idx) => (
                      <li key={`conflict-${idx}-${item.description?.slice(0, 20)}`} className="flex items-start gap-2 text-sm">
                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[hsl(var(--red-soft))]" />
                        <div>
                          <span className="text-foreground/85">{item.description}</span>
                          {item.sources && (
                            <span className="block text-xs text-muted-foreground mt-0.5">
                              Source: {item.sources}
                            </span>
                          )}
                        </div>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              )}

              {/* Open Questions */}
              {openQuestions.length > 0 && (
                <CollapsibleSection
                  title="Open Questions"
                  icon={<HelpCircle className="w-4 h-4 text-[hsl(var(--blue-soft))]" />}
                  count={openQuestions.length}
                  accentColor="bg-[hsl(var(--blue-bg)/0.3)]"
                  defaultOpen={true}
                >
                  <ul className="space-y-1.5">
                    {openQuestions.map((item, idx) => (
                      <li key={`question-${idx}-${item?.slice(0, 20)}`} className="flex items-start gap-2 text-sm text-foreground/85">
                        <ArrowRight className="w-3.5 h-3.5 mt-0.5 flex-shrink-0 text-[hsl(var(--blue-soft))]" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </CollapsibleSection>
              )}
            </div>
          </div>
        )}

        {/* ── Action Items ────────────────────────────────────────── */}
        {actionItems && actionItems.length > 0 && (
          <div className="px-5 py-4 border-t border-border/40">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
              Suggested Next Steps
            </h3>
            <div className="space-y-1.5">
              {actionItems.map((item, idx) => (
                <div
                  key={`action-${idx}-${item?.slice(0, 20)}`}
                  className="flex items-start gap-2.5 p-2 rounded-md bg-[hsl(var(--green-bg)/0.4)] border border-[hsl(var(--green-soft)/0.12)]"
                >
                  <span className="flex-shrink-0 mt-0.5 w-5 h-5 rounded-full bg-[hsl(var(--green-soft)/0.12)] flex items-center justify-center text-xs font-semibold text-[hsl(var(--green-soft))]">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground/85">{item}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Footer with Save to Notion CTA ──────────────────────── */}
        <div className="px-5 py-3 border-t border-border/40 bg-muted/20">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {keyFindings.length} finding{keyFindings.length !== 1 ? 's' : ''} · {flagCount} flag
              {flagCount !== 1 ? 's' : ''}
              {actionItems && actionItems.length > 0
                ? ` · ${actionItems.length} action item${actionItems.length !== 1 ? 's' : ''}`
                : ''}
            </span>
            <button
              type="button"
              onClick={handleSaveToNotion}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium bg-primary text-primary-foreground hover:bg-primary/90 transition-colors duration-150"
            >
              <ExternalLink className="w-3 h-3" />
              Save to Notion
            </button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default registerComponent(config)(function ResearchBrief(
  props: AsArgumentsProps<ResearchBriefProps>,
) {
  return <ResearchBriefComponent {...props} />;
});
