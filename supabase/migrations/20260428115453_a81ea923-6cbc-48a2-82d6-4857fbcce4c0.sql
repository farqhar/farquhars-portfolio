-- Projects table for portfolio
CREATE TABLE public.projects (
  slug text PRIMARY KEY,
  title text NOT NULL DEFAULT '',
  role text NOT NULL DEFAULT '',
  timeline text NOT NULL DEFAULT '',
  outcome_metric text NOT NULL DEFAULT '',
  cover text NOT NULL DEFAULT '/placeholder.svg',
  hero text NOT NULL DEFAULT '/placeholder.svg',
  problem text NOT NULL DEFAULT '',
  process text NOT NULL DEFAULT '',
  outcome text NOT NULL DEFAULT '',
  honest text NOT NULL DEFAULT '',
  quotes jsonb NOT NULL DEFAULT '[]'::jsonb,
  files jsonb NOT NULL DEFAULT '[]'::jsonb,
  "order" integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE TRIGGER projects_set_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION public.cms_set_updated_at();

-- Seed
INSERT INTO public.projects (slug, title, role, timeline, outcome_metric, problem, process, outcome, honest, quotes, "order") VALUES
('cjc-digital-construction-landing-page','CJC Digital Construction Landing Page','Creative Direction · Web Design · Stakeholder Management','6 weeks','4,743% engagement',
 'CJC''s digital arm had no way to communicate what it actually did. The existing page collapsed three offerings into one paragraph, and bounce rates told the story.',
 'Mapped the service offering with three department leads, prototyped a narrative-led page in two passes, and pushed for fewer words and more proof. Worked through five rounds of stakeholder feedback without losing the structural spine.',
 'Engagement jumped 4,743% in the first quarter post-launch. The page became the default link in business development conversations.',
 'I underestimated how much internal alignment the page would force. Half the work happened in stakeholder rooms, not in Figma.',
 '["It finally explains what we do without an apology. — Department Lead"]'::jsonb, 0),
('ai-workflow-survey-system','AI Workflow Survey System & Pain Point Analysis','Operations Design · Research · AI Tooling','10 weeks','147 hrs/wk identified',
 'Leadership knew AI could help but had no shared evidence of where time was actually being lost. Anecdotes were driving tooling decisions.',
 'Designed a structured intake survey, ran it across departments, then built a tagging framework that grouped pain points by frequency, severity, and automatability.',
 'Surfaced 147 weekly hours of reclaimable work and a prioritised tooling roadmap leadership now uses to greenlight pilots.',
 'The hardest part wasn''t the analysis — it was getting busy people to answer honestly. I rewrote the intake three times.',
 '["First time we''ve had data instead of opinions on this. — Head of Operations"]'::jsonb, 1),
('cjc-air-and-ports-motion-video','CJC Air & Ports Motion Video','Creative Direction · Motion Design · Script','4 weeks','Multiple million dollar projects won',
 'The Air & Ports division needed a sales-room asset that explained scale and capability in under 90 seconds, without leaning on stock footage.',
 'Wrote the script around three customer truths, storyboarded a motion treatment, and directed the build with a motion designer. Two rounds, no stock.',
 'The video became the opening asset in every Air & Ports pitch deck and is now embedded in the division''s homepage.',
 'I cut the runtime in half on the last revision and the video got better. I should''ve started shorter.',
 '["It actually sounds like us. — Division Director"]'::jsonb, 2),
('brand-touchpoint-audit-ownership-framework','Brand Touchpoint Audit & Ownership Framework','Brand Strategy · Systems · Stakeholder Management','8 weeks','100+ touchpoints tracked',
 'No one could say who owned what across the brand. Templates drifted, signage was inconsistent, and the same fix kept being made in three different places.',
 'Audited every customer-facing surface, built a single ownership matrix, and walked it through with each owner until they agreed it was theirs.',
 'Over 100 touchpoints now have a named owner, a review cadence, and a single source of truth.',
 'Half the work was diplomacy. Naming an owner is easy. Getting them to accept it is the project.',
 '["I finally know what I''m responsible for. — Marketing Manager"]'::jsonb, 3),
('animated-email-signature-suite-case-happy-holidays','Animated Email Signature Suite — CaSE Happy Holidays','Design · Motion · Email Engineering','2 weeks','120+ staff deployed',
 'The annual holiday signature was a 4MB JPEG no one updated. It looked tired, broke on Outlook, and gave nothing back to the brand.',
 'Designed a lightweight animated signature that degraded gracefully on Outlook, then built a one-click install path so 320+ staff could deploy it themselves.',
 'Deployed across the org in under a week. Held up across Outlook, Gmail, and Apple Mail without a single helpdesk ticket.',
 'Email is hostile design territory. Half the time I spent on this was pretending it was 2009.',
 '["First holiday signature that didn''t make me wince. — Internal Comms Lead"]'::jsonb, 4),
('aiq-control-centre-internal-comms-automation','AIQ Control Centre & Internal Comms Automation','Product Design · AI Workflow · Comms Strategy','12 weeks','80% comms automated',
 'Internal comms were stitched together by hand every week — pulling metrics, writing summaries, formatting emails. The work was invisible until it broke.',
 'Designed a control centre that pulls from source systems, drafts the comms with an AI layer, and routes them to a human approver before sending.',
 'Around 80% of weekly internal comms now ship through the control centre. Human time shifted from assembly to editorial.',
 'Automating comms doesn''t remove the editorial judgment — it concentrates it. That part surprised me.',
 '["I get my Fridays back. — Internal Comms Lead"]'::jsonb, 5),
('wollip-email-signature-saas','Wollip — Email Signature SaaS','Founder · Product Design · Brand','Ongoing','In private beta',
 'Every company I worked with had the same email signature problem and no SaaS that solved it without enterprise pricing or an IT project.',
 'Designed the product around a single insight: signatures should be deployed centrally and edited locally. Built the brand, the marketing site, and the onboarding flow in parallel.',
 'Currently in private beta with three paying companies. Validated the central-deploy / local-edit model.',
 'I keep wanting to add features. The product gets better when I delete them.',
 '["This is the thing we''ve been building badly in-house for years. — Beta Customer"]'::jsonb, 6),
('cv-generation-tool-engineering-tender-automation','CV Generation Tool — Engineering Tender Automation','Product Design · AI Workflow · Internal Tooling','9 weeks','From 3 days to 20 mins',
 'Every engineering tender required tailored CVs for 8–20 staff, hand-assembled in Word. The process took three days and blocked bid teams.',
 'Designed a structured CV database, a tender-brief intake, and an AI layer that drafts the tailored CV. Bid leads review and ship.',
 'Tailored-CV turnaround dropped from three days to twenty minutes. Bid teams now spend that time on the win themes.',
 'The AI was the easy part. The hard part was convincing engineers their CV deserved a database row.',
 '["I''d never go back to the old process. — Bid Manager"]'::jsonb, 7);