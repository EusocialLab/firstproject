# ARCHITECTURE.md

# Legacy Sky Architecture

## Purpose

This document defines the technical architecture, folder structure, design principles, and implementation rules for Legacy Sky.

This file is written for AI coding agents and human developers.

The goal is to maximize:

* Maintainability
* Readability
* Extensibility
* AI Agent effectiveness

Product requirements and business goals belong in PRODUCT.md.

This document focuses on implementation.

---

## Technical Architecture

This project uses Next.js 

---


# Core Architectural Principles

## 1. Scene-Driven Architecture

Legacy Sky is not a traditional dashboard application.

The product is organized around immersive scenes.

Current scenes:

* Legacy Sky (landing page)
* Legacy Study (logged-in experience)

Future scenes:

* Constellation View
* Legacy Book
* Family Archive

Each scene should be independently maintainable.

---

## 2. UI and Business Logic Separation

Never mix:

* visual presentation
* AI logic
* persistence logic

Example:

Bad:

Page component directly calls OpenAI and updates database.

Good:

UI
→ Service
→ AI Layer
→ Repository

---

## 3. Story First

The primary entity of the system is not chat messages.

The primary entity is:

Story

Everything else derives from stories.

Examples:

Story
→ Lesson

Story
→ Value

Story
→ Wisdom

Story
→ Legacy Portrait

---

## 4. Future AI Provider Independence

AI providers may change.

Never tightly couple business logic to:

* OpenAI
* Claude
* Gemini

Always use adapters.

Example:

AIService
├── OpenAIProvider
├── ClaudeProvider
└── FutureProvider

---

## 5. Component Lines Limit

No component larger than 300 lines

If component exceeds 300 lines:

split into smaller components

---

## 6. AI Calls Rule

All AI calls go through services/ai

Bad:

fetch(OpenAI)

inside components

Good:

services/ai/chat.ts

---

## 7. Storage Rule

No direct localStorage usage

Always use:

services/memory/

Example:

saveConversation()

loadConversation()

clearConversation()

---

## 8. Abstraction Rule

Avoid duplicated code

If copied twice:

consider abstraction

If copied three times:

must abstract
Reuse existing components
Do not duplicate logic

---

## 9. TypeScript Rule

Use TypeScript

---

## 10. Folder Structure Rule

Follow folder structure strictly
If unsure: favor maintainability over speed.

---

# Project Structure

src/

├── app/
│
├── scenes/
│   ├── legacy-sky/
│   ├── legacy-study/
│   ├── constellation/
│   └── legacy-book/
│
├── components/
│   ├── ui/
│   ├── stars/
│   ├── desk/
│   ├── recorder/
│   └── paper/
│
├── features/
│   ├── interview/
│   ├── memory/
│   ├── legacy/
│   ├── constellation/
│   └── authentication/
│
├── services/
│   ├── ai/
│   ├── storage/
│   ├── analytics/
│   └── export/
│
├── repositories/
│
├── hooks/
│
├── types/
│
├── lib/
│
└── constants/

---

# Scene Architecture

## Legacy Sky

Purpose:

Public landing page.

Responsibilities:

* Display star field
* Display historical legacies
* Display "Your Legacy" entry point
* Handle sign-in entry

Must NOT:

* Run interviews
* Store memories
* Generate legacy content

---

## Legacy Study

Purpose:

Conduct legacy interviews.

Responsibilities:

* Recorder interactions
* Paper interactions
* Story capture
* Story editing
* Reflection generation

Must remain focused on storytelling.

---

# Component Rules

Components should be categorized as:

## Presentational

Pure UI.

Examples:

Star
Lamp
Paper
Recorder

No business logic.

---

## Feature Components

Contain user workflows.

Examples:

InterviewSession
StoryEditor
LegacyPreview

May use hooks and services.

---

# State Management

Prefer local state first.

Order of preference:

1. Component state
2. Context
3. Global state

Avoid global state unless truly shared.

Examples:

Good global state:

* Authentication
* User profile

Bad global state:

* Paper draft content
* Temporary interview answers

---

# AI Architecture

All AI calls must flow through:

AIService

Example:

UI
→ InterviewService
→ AIService
→ Provider
→ Response

Never call AI directly from React components.

---

# Memory Architecture

Memory is organized into domains.

memory/

├── life-events
├── stories
├── values
├── lessons
├── wisdom
├── relationships
└── legacy-portraits

Avoid storing raw conversation history as the primary source of truth.

Store structured memories.

---

# Persistence Architecture

Repository Pattern Required.

Examples:

StoryRepository

ValueRepository

MemoryRepository

LegacyRepository

UI must never directly access the database.

---

# Animation Architecture

Animations are part of storytelling.

Animations must be:

* slow
* subtle
* meaningful

Examples:

Allowed:

* recorder reel rotation
* star glow
* paper writing effect
* lamp breathing effect

Avoid:

* flashy transitions
* game-like effects
* excessive motion

Animations should support reflection, not excitement.

---

# Interview State Architecture

Legacy interviews are long-running sessions.

The system must assume users may leave and return at any time.

Interview progress should survive:

- page refresh
- browser restart
- temporary network loss
- user logout
- device sleep

The interview experience should feel continuous.

## Autosave

The system must automatically save:

- story drafts
- user edits
- AI drafts
- interview progress

without requiring manual save actions.

Autosave interval:

- 5–10 seconds after inactivity

or

- immediately after major state changes

## Local Persistence

During active interviews:

local storage may be used as the primary working copy,
but only through the memory abstraction layer in `services/memory/`.

The application must not call `localStorage` directly from UI or feature code.
All direct client storage access must be encapsulated inside memory services.

Examples:

- IndexedDB via `services/memory/`
- local draft cache via `services/memory/`

The UI should remain usable during temporary network outages.

## Synchronization

Background synchronization should occur automatically.

State Flow:

Client Draft
→ Local Cache
→ Sync Queue
→ Server Draft

## Conflict Resolution

Single-user editing is assumed.

If conflicting edits occur:

Latest Version Wins

while preserving:

- previous draft snapshot
- edit history

Future versions may support merge workflows.

## Session Resume

Users should always be able to resume:

- unfinished interviews
- incomplete stories
- pending reviews

When returning:

the system restores the exact interview context whenever possible.

## Snapshot System

The system periodically captures immutable snapshots.

Examples:

- Story v1
- Story v2
- Story v3

Snapshots allow:

- recovery
- comparison
- historical preservation

---

# Design System

Theme:

Warm Interior + Infinite Cosmos

Color groups:

Interior:

* warm amber
* parchment
* walnut wood

Exterior:

* deep navy
* starlight white
* subtle gold

Maintain consistency across all scenes.

---

# Extensibility Rules

When adding new features:

1. Create new feature folder.
2. Avoid modifying existing scene logic.
3. Reuse services whenever possible.
4. Preserve scene boundaries.

Example:

Future Family Archive

features/family-archive/

instead of expanding interview feature endlessly.

---

# Testing Strategy

Unit Tests

* Services
* Repositories
* Memory processing

Integration Tests

* Interview flow
* Story generation
* Authentication

E2E Tests

* Landing page
* Login
* Interview completion
* Legacy generation

---

# Guiding Principle

Legacy Sky is not a chat application.

It is a legacy preservation platform.

Code should be organized around:

Stories
→ Meaning
→ Preservation

not around chat messages.

---

# Human Review Required

AI-generated content must never be automatically promoted to permanent legacy records.

Workflow:

Raw Story
→ AI Draft
→ User Review
→ User Approval
→ Permanent Archive

Required States:

draft
inferred
review
approved
archived

AI outputs should always indicate:

Generated by AI
Last edited by user

---

# AI Reliability

## AI Outputs Are Suggestions

AI-generated content is not treated as truth.

Examples:

* Story Summaries
* Lessons
* Values
* Wisdom
* Legacy Portraits

Users must review and approve AI-generated content before it becomes part of their permanent legacy.

---

## Provider Independence

Business logic must not depend on a specific AI provider.

All AI calls should go through:

UI → Service Layer → AI Service → Provider

Supported providers may change over time.

---

## Structured Outputs

AI responses should follow predefined schemas whenever possible.

Applications should depend on structured data, not response wording.

---

## Graceful Failure

AI failures must never cause data loss.

If AI generation fails:

* Save user content
* Preserve interview progress
* Show a friendly error message

Story preservation is more important than AI generation.

---

## Human Review

Workflow:

Story → AI Draft → User Review → User Approval → Archive

Only approved content becomes part of a user's legacy.

---

## Privacy

User stories must never be used for model training without explicit consent.

Sensitive data should never be exposed beyond approved AI processing.

---

## Guiding Principle

AI helps discover meaning.

Users decide meaning.

---

# Subscription Architecture

The system must support:

- Free users
- Paid users
- Usage limits
- Feature access control
- Future subscription plans

Business rules should be configurable and not hardcoded.

# Accessibility & Internationalization

## Accessibility

The application should be designed with accessibility in mind.

Requirements:

- Scalable typography
- Keyboard navigation support
- Screen reader compatibility
- High contrast support
- Reduced motion support
- Voice interaction support

Accessibility should be considered during component design rather than added later.

---

## Internationalization

All user-facing text should be externalized.

Avoid hardcoded strings in components.

Translation architecture should support:

- English
- Chinese
- Future languages

Date, time, and formatting should be locale-aware.

The system should be able to support multiple languages without major architectural changes.