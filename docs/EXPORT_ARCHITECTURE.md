# EXPORT_ARCHITECTURE.md

# Legacy Sky Export Architecture

## Purpose

This document defines how approved legacy content can be exported, shared, preserved, and transferred beyond the Legacy Sky platform.

Legacy content belongs to the user.

Users should never be locked into Legacy Sky.

The goal of export is not only preservation, but also sharing legacy with future generations.

---

# Core Principles

## User Ownership

Users own all approved legacy content.

Legacy Sky stores and organizes legacy content but does not own it.

Users may export, share, or delete their content at any time.

---

## Portability

Legacy content should remain accessible even if:

* Legacy Sky no longer exists
* AI providers change
* Storage systems change

Export formats should be open and portable whenever possible.

---

## Human Readability

Exported content should remain understandable without specialized software.

Human-readable formats are preferred over proprietary formats.

---

## Future Generation Accessibility

Legacy content should be accessible not only to the user, but also to:

* Children
* Grandchildren
* Family members
* Friends

Sharing and preservation are equally important goals.

---

# Export Types

## Story Export

A single story.

Examples:

* First Job
* Immigration Journey
* Meeting My Spouse

Contents:

* Story
* Reflection
* Lessons
* Photos (future)

Memory objects:

* `StoryMemory`
* `LifeEventMemory`
* `RelationshipMemory`

---

## Legacy Collection

A curated collection of stories.

Examples:

* Family Stories
* Career Stories
* Life Turning Points

Contents:

* Multiple stories
* Lessons
* Values

Memory objects:

* `StoryMemory`
* `LessonMemory`
* `ValueMemory`
* `WisdomMemory`
* `RelationshipMemory`

---

## Legacy Book

A complete life archive.

Contents:

* Legacy Portrait
* Major Stories
* Life Lessons
* Core Values
* Wisdom
* Letters to Future Generations

Represents the highest level of preservation.

Memory objects:

* `StoryMemory`
* `LessonMemory`
* `ValueMemory`
* `WisdomMemory`
* `RelationshipMemory`
* `LegacyPortrait`
* `LifeEventMemory`
* `RegretMemory`
* `DreamMemory`

---

# Export Formats

## PDF

Purpose:

* Printing
* Family keepsakes
* Long-term archiving

Characteristics:

* Human-readable
* Beautiful formatting
* Easy sharing

---

## Markdown

Purpose:

* Backup
* Editing
* Migration

Characteristics:

* Plain text
* Future-proof
* Platform independent

---

## JSON

Purpose:

* Data portability
* Integrations
* Future products

Characteristics:

* Machine-readable
* Structured data
* Complete archive

---

## Future Formats

Potential future formats:

* EPUB
* Audiobook
* Voice Legacy
* Video Legacy
* Family Archive Bundle

Architecture should remain flexible enough to support new export formats.

---

# Social Sharing Architecture

## Purpose

Sharing legacy is an important part of preservation.

Many family members and younger generations engage through social media rather than long-form documents.

Legacy Sky should support meaningful social sharing without exposing private content.

---

## Shareable Content Types

### Legacy Quote

Example:

> "Success means little if nobody is there to share it with."

Short and easily shareable.

---

### Legacy Lesson

Example:

> What I learned after 40 years in business.

Highlights a specific life lesson.

---

### Legacy Story Card

Contains:

* Story title
* Short summary
* Legacy quote

Optimized for social platforms.

---

### Legacy Portrait Card

Contains:

* Portrait title
* Key values
* Signature wisdom

Acts as a shareable personal identity snapshot.

---

### Legacy Milestone

Examples:

* Legacy Completed
* First Story Published
* Legacy Book Created

Celebrates important moments.

---

# Privacy-Aware Sharing

## Private By Default

All content is private unless explicitly shared.

No content should become public automatically.

---

## User Approval Required

Users must approve content before sharing.

Nothing should be published automatically.

---

## Granular Sharing

Future sharing options may include:

* Private
* Family Only
* Public Link
* Public Legacy Library

---

# Export Pipeline

Approved Memories
↓
Content Assembly
↓
Template Selection
↓
Renderer
↓
Export Format

Possible outputs:

* PDF
* Markdown
* JSON
* Social Card
* Future Media Formats

---

# Template Architecture

Templates should remain separate from content.

Examples:

* Classic
* Memoir
* Modern
* Family Archive

Future templates should not require changes to memory structures.

---

# Versioning

All exports should contain metadata.

Example:

{
"version": "1.0",
"generatedAt": "...",
"exportType": "LegacyBook"
}

This ensures future compatibility.

---

# Future Vision

Legacy Sky is not only a place to record stories.

It is a platform that helps people:

Preserve their memories.

Share their wisdom.

Pass their legacy to future generations.
