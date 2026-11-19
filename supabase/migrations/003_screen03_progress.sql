-- Digital Detective World · Screen 03 Induction Progress Extension
-- Preserves existing RLS policies on public.students while storing Screen 03 induction state cleanly.

alter table public.students
  add column if not exists screen03_progress jsonb not null default '{
    "hqEntered": false,
    "missionBriefingCompleted": false,
    "videoCompleted": false,
    "problemIdentified": false,
    "decisionChoice": null,
    "decisionCompleted": false,
    "safetyIntroDone": false,
    "rulesCompleted": {
      "rule1": false,
      "rule2": false,
      "rule3": false
    },
    "knowledgeCheckCompleted": false,
    "inductionCompleted": false,
    "redFlagCentreUnlocked": false,
    "currentStage": "entrance"
  }'::jsonb;
