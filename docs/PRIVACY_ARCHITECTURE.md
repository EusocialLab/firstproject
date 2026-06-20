# Privacy Architecture

## Ownership

Users own all stories.

---

## Consent

Users explicitly consent before interviews begin.
Consent must be captured and stored separately from user content.

---

## AI Training

User stories are never used to train AI models without explicit opt-in.

---

## Export

Users may export their legacy.
Export requests must be audited and user-approved.

---

## Deletion

Users may permanently delete stories.
Deletion must remove both active data and secondary backups consistent with the data retention policy.

---

## Public Sharing

Private by default.

Nothing is shared without explicit permission.

---

## Data Retention

Define a clear data retention policy for stored legacy data, drafts, and metadata.

- Active user content should be retained while the user account is active.
- Drafts may be retained for a limited period after inactivity before automatic cleanup.
- Permanently deleted content must be removed from both primary storage and retention archives.
- Retention decisions should balance user trust, regulatory requirements, and recovery needs.

---

## Access Control

Access to user legacy data must be restricted by role and purpose.

- Users can access and manage their own stories.
- Administrators may only access content when necessary for support, compliance, or recovery, and must follow strict approval procedures.
- Service components must enforce least-privilege access to data stores and AI pipelines.
- All access should be authenticated, authorized, and logged.

---

## Audit and Logging

All privacy-relevant actions must be logged for auditability.

- Consent changes
- Export requests
- Deletion requests
- Data access by support or administrative personnel
- AI processing of user content

Logs should preserve user privacy and be retained according to policy.
Audit records must enable investigation of incidents and verification of compliance.

---

## AI Training Approval

Any use of user content for model training or improvement must require explicit, documented approval.

- Default behavior: user content is not used for training.
- Explicit consent must be captured before any training use.
- Training approval should include scope, duration, and data categories.
- Users can revoke training consent at any time.

---

## Privacy by Design

Privacy must be integrated into every architectural decision.

- Minimize data collection and retention.
- Separate sensitive content from non-sensitive metadata.
- Use encryption in transit and at rest where appropriate.
- Design export and sharing flows to default to the most private option.
