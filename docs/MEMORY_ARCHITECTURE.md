# MEMORY_ARCHITECTURE.md

# Legacy Sky Memory Architecture

## Purpose

This document defines how memories, stories, values, lessons, wisdom, and legacy artifacts are represented, stored, validated, evolved, and retrieved throughout the Legacy Sky platform.

This architecture exists to ensure:

- Consistency across AI providers
- Long-term maintainability
- Explainable AI outputs
- User trust
- Future schema evolution
- Data portability

This document is intended for:

- AI Coding Agents
- Human Developers
- AI Prompt Engineers
- Future Data Architects

---

# Core Principle

Legacy Sky does not store conversations.

Legacy Sky stores structured human knowledge extracted from conversations.

The conversation is temporary.

The legacy is permanent.

---

# Memory Hierarchy

All memories should fit into one of the following layers.

```text
Life Event
    ↓
Story
    ↓
Lesson
    ↓
Value
    ↓
Wisdom
    ↓
Legacy
```

Each layer becomes more abstract and more meaningful.

---

# Memory Types

## Canonical Memory Types

```typescript
enum MemoryType {
  LIFE_EVENT,
  STORY,
  LESSON,
  VALUE,
  WISDOM,
  RELATIONSHIP,
  LEGACY_PORTRAIT
}
```

No additional memory types should be introduced without updating this document.

---

# Memory Ownership Model

Every memory must have a source.

A memory is never treated as objective truth without provenance.

---

## Source Types

```typescript
enum SourceType {
  USER_EXPLICIT,
  USER_APPROVED,
  AI_INFERRED,
  AI_GENERATED,
  SYSTEM_CREATED
}
```

### USER_EXPLICIT

Directly stated by the user.

Example:

> Family is more important than career.

---

### USER_APPROVED

Originally generated or inferred by AI but later confirmed by the user.

Example:

AI:

> Family appears to be your highest priority.

User:

> Yes, that's accurate.

---

### AI_INFERRED

Reasonable interpretation based on multiple stories.

Example:

> User appears to value responsibility.

Must remain editable and reviewable.

---

### AI_GENERATED

Generated content such as:

- Legacy Portraits
- Letters
- Story Summaries

Represents AI writing, not user facts.

---

### SYSTEM_CREATED

Metadata generated internally.

Examples:

- timestamps
- derived relationships
- indexes

---

# Memory Status Lifecycle

Every memory must have a status.

```typescript
enum MemoryStatus {
  DRAFT,
  INFERRED,
  REVIEWED,
  APPROVED,
  ARCHIVED
}
```

---

## Lifecycle

```text
DRAFT
  ↓

INFERRED
  ↓

REVIEWED
  ↓

APPROVED
  ↓

ARCHIVED
```

---

### DRAFT

Raw content.

May contain incomplete information.

---

### INFERRED

Created by AI.

Not yet verified by the user.

---

### REVIEWED

User has viewed the memory.

No approval yet.

---

### APPROVED

Explicitly accepted by the user.

This becomes part of the user's official legacy.

---

### ARCHIVED

Frozen historical record.

No automatic modifications allowed.

---

# Canonical Memory Schema

All memory objects inherit from this schema.

```typescript
interface Memory {
  id: string;

  type: MemoryType;

  content: string;

  source: SourceType;

  status: MemoryStatus;

  confidence: number;

  evidenceIds: string[];

  schemaVersion: string;

  createdAt: string;

  updatedAt: string;
}
```

---

# Confidence Model

AI confidence must never be binary.

Every inferred memory requires a confidence score.

```typescript
confidence: number;
```

Range:

```text
0.0 → 1.0
```

---

## Suggested Interpretation

| Confidence | Meaning |
|------------|----------|
| 0.90+ | Strongly supported |
| 0.75-0.89 | Likely |
| 0.50-0.74 | Possible |
| Below 0.50 | Weak hypothesis |

---

# Evidence Architecture

## Principle

No meaningful interpretation should exist without evidence.

This is one of the most important rules in Legacy Sky.

---

Bad:

```json
{
  "value": "Family First"
}
```

---

Good:

```json
{
  "value": "Family First",
  "evidenceIds": [
    "story_101",
    "story_204",
    "story_319"
  ]
}
```

---

# Explainability Requirement

The system must always be able to answer:

> Why do we believe this?

---

Example

Value:

```text
Family First
```

Evidence:

```text
Story A:
Turned down promotion to spend time with daughter.

Story B:
Moved cities for family.

Story C:
Repeated references to family priorities.
```

---

# Story Schema

Stories are the foundational memory object.

Everything else should derive from stories.

```typescript
interface StoryMemory extends Memory {
  title: string;

  summary: string;

  participants: string[];

  dateRange?: string;

  tags: string[];
}
```

---

# Life Event Schema

Represents factual events.

Examples:

- Marriage
- Immigration
- Graduation
- Promotion

```typescript
interface LifeEventMemory extends Memory {
  eventDate?: string;

  location?: string;

  participants?: string[];
}
```

---

# Lesson Schema

Represents learned experience.

Example:

> Courage often comes before certainty.

```typescript
interface LessonMemory extends Memory {
  derivedFromStories: string[];
}
```

---

# Value Schema

Represents recurring priorities.

Examples:

- Family
- Responsibility
- Freedom
- Curiosity

```typescript
interface ValueMemory extends Memory {
  evidenceIds: string[];
}
```

---

# Wisdom Schema

Represents generalized life guidance.

Example:

> Success means little if nobody is there to share it with.

```typescript
interface WisdomMemory extends Memory {
  evidenceIds: string[];
}
```

---

# Relationship Schema

Represents important people.

Examples:

- Spouse
- Parent
- Child
- Mentor
- Friend

```typescript
interface RelationshipMemory extends Memory {
  relationshipType: string;

  personName?: string;
}
```

---

# Legacy Portrait Schema

Represents high-level synthesis.

Example:

> The Builder Who Chose Responsibility Over Comfort

```typescript
interface LegacyPortrait extends Memory {
  generatedFromMemoryIds: string[];
}
```

---

# AI Interpretation Rules

AI must never overwrite approved memories.

Allowed:

```text
Create
Suggest
Infer
Draft
```

Not Allowed:

```text
Rewrite approved memories
Delete approved memories
Modify archived memories
```

---

# Human Review Requirement

AI-generated content is always a draft.

Official legacy content requires user approval.

Workflow:

```text
Story
  ↓

AI Draft
  ↓

User Review
  ↓

User Approval
  ↓

Legacy Archive
```

---

# Memory Retrieval Priority

When retrieving memories for prompts:

Priority Order:

```text
APPROVED
  ↓

REVIEWED
  ↓

INFERRED
  ↓

DRAFT
```

Never prioritize unapproved AI interpretations over approved user content.

---

# Versioning Strategy

All memory objects require versioning.

```typescript
schemaVersion: string;
```

Example:

```text
1.0
1.1
2.0
```

---

# Migration Strategy

Future schema changes must:

- preserve existing data
- remain backward compatible
- include migration scripts

Never silently mutate historical records.

---

# Multi-Provider Consistency

Memory architecture must remain independent from:

- OpenAI
- Claude
- Gemini
- Local Models

AI providers may change.

Memory structures must not.

---

# Export Compatibility

Every memory object should be exportable as:

- JSON
- Markdown
- PDF
- Legacy Book

Memory architecture should remain provider-independent and human-readable.

## Export Type Mapping

Export types should map to the memory schema explicitly so the memory architecture supports the values needed by each export.

- Story Export
  - Includes: `StoryMemory`, `LifeEventMemory`, `RelationshipMemory`
  - Outputs a single story package with related facts, participants, timeline, reflections, and evidence.

- Legacy Collection
  - Includes: `StoryMemory`, `LessonMemory`, `ValueMemory`, `WisdomMemory`, `RelationshipMemory`
  - Outputs a curated collection of stories, lessons, values, and wisdom centered on a theme or time period.

- Legacy Book
  - Includes: all approved memory objects:
    - `StoryMemory`
    - `LessonMemory`
    - `ValueMemory`
    - `WisdomMemory`
    - `RelationshipMemory`
    - `LegacyPortrait`
    - `LifeEventMemory`
    - `RegretMemory`
    - `DreamMemory`
  - Outputs a complete life archive that can be rendered as PDF, Markdown, JSON, or other future formats.

## Export Format Compatibility

Each memory object should support the following output formats:

- JSON: complete structured export for portability and integration
- Markdown: human-readable archive for editing and migration
- PDF: print-ready document for preservation and sharing

Metadata for export should include:

- export version
- generatedAt
- exportType
- memory schema version
- included memory ids

---

# Guiding Principle

Stories are the source of truth.

AI interpretations are suggestions.

Users determine meaning.

Approved memories become legacy.