// FAQ data for comparison articles — used for FAQ schema markup
export interface FAQ {
  question: string;
  answer: string;
}

const faqMap: Record<string, FAQ[]> = {
  "churnzero-vs-gainsight": [
    {
      question: "What is the main difference between ChurnZero and Gainsight?",
      answer: "ChurnZero is designed for faster deployment and mid-market teams with leaner CS ops, while Gainsight offers deeper enterprise-grade customization and is better suited for organizations with dedicated CS operations teams and larger budgets.",
    },
    {
      question: "Which platform is better for mid-market SaaS companies?",
      answer: "ChurnZero is generally a better fit for mid-market SaaS companies due to its faster time-to-value, more transparent pricing, and lower CS ops overhead. Gainsight excels at enterprise scale but requires more resources to implement.",
    },
    {
      question: "How do ChurnZero and Gainsight compare on AI capabilities?",
      answer: "Both platforms offer AI-driven health scoring and automation. ChurnZero provides operational AI agents that can take autonomous action, while Gainsight Atlas offers advanced analytics and AI-powered insights with deeper customization options.",
    },
  ],
  "churnzero-vs-vitally": [
    {
      question: "Is Vitally or ChurnZero easier to set up?",
      answer: "Vitally is generally quicker to set up with its modern, lightweight architecture. ChurnZero also offers reasonable deployment speed but has more configuration options that may extend initial setup time.",
    },
    {
      question: "Which is more affordable, ChurnZero or Vitally?",
      answer: "Both platforms offer competitive mid-market pricing. Vitally tends to be more transparent with pricing and may be more cost-effective for smaller teams, while ChurnZero's pricing scales with feature usage and customer volume.",
    },
  ],
  "churnzero-vs-oliv-ai": [
    {
      question: "What is Oliv.ai and how does it compare to ChurnZero?",
      answer: "Oliv.ai is an AI-native Customer Success platform that takes an agent-first approach to CS automation. Unlike ChurnZero which evolved from a traditional CSP, Oliv.ai was built from the ground up with agentic AI at its core, offering autonomous task execution and intelligent workflow orchestration.",
    },
    {
      question: "Which platform has better AI capabilities?",
      answer: "Oliv.ai leads in native AI agent capabilities with autonomous task execution and multi-agent orchestration. ChurnZero offers strong operational AI features but its AI capabilities are more focused on augmenting existing CS workflows rather than autonomous operation.",
    },
  ],
  "gainsight-vs-oliv-ai": [
    {
      question: "Is Oliv.ai a good Gainsight alternative in 2026?",
      answer: "Yes, Oliv.ai is a strong Gainsight alternative for mid-market teams that prioritize AI-native capabilities and faster deployment. However, Gainsight remains superior for organizations needing deep enterprise customization and mature CS ops tooling.",
    },
    {
      question: "How do Gainsight and Oliv.ai differ in deployment complexity?",
      answer: "Gainsight typically requires 3-6 months for full deployment with dedicated CS ops resources. Oliv.ai can be deployed in weeks due to its AI-native architecture that requires less manual configuration and rule-building.",
    },
  ],
  "gainsight-vs-vitally": [
    {
      question: "Should mid-market teams choose Gainsight or Vitally?",
      answer: "Vitally is typically the better choice for mid-market teams due to its modern interface, faster deployment, and lower total cost of ownership. Gainsight is better suited for larger mid-market or enterprise organizations with dedicated CS ops resources.",
    },
    {
      question: "What are the pricing differences between Gainsight and Vitally?",
      answer: "Vitally offers more transparent, predictable pricing suited for mid-market budgets. Gainsight's pricing is typically higher and involves custom enterprise contracts that can vary significantly based on features and user count.",
    },
  ],
  "totango-vs-gainsight": [
    {
      question: "Is Totango cheaper than Gainsight?",
      answer: "Totango generally offers more accessible pricing for mid-market teams, including a free tier for small teams. Gainsight's pricing is typically higher but includes more enterprise features and deeper customization capabilities.",
    },
    {
      question: "Which platform has better AI features in 2026?",
      answer: "Gainsight has invested more heavily in AI with its Atlas platform, offering advanced analytics and AI-powered predictions. Totango's AI capabilities are improving but currently trail Gainsight in depth and sophistication.",
    },
  ],
  "agents-vs-copilots": [
    {
      question: "What is the difference between AI agents and AI copilots in Customer Success?",
      answer: "AI copilots surface recommendations and insights but require human action to execute. AI agents can autonomously execute tasks — such as sending emails, updating records, or triggering workflows — without human intervention. True agents operate with agency, not just intelligence.",
    },
    {
      question: "Should my CS team use AI agents or copilots?",
      answer: "It depends on your maturity and risk tolerance. Start with copilots for high-stakes decisions where human oversight matters. Deploy agents for repetitive, high-volume tasks like long-tail account monitoring, automated check-ins, and data enrichment where autonomous action saves significant CSM time.",
    },
  ],
  "best-cs-platforms-2026": [
    {
      question: "What is the best Customer Success platform in 2026?",
      answer: "There is no single best platform — it depends on your team size, budget, and needs. ChurnZero and Vitally excel for mid-market teams seeking fast deployment. Gainsight leads for enterprise customization. Oliv.ai is the top AI-native option. Velaris offers a strong balance of features and pricing.",
    },
    {
      question: "How much do Customer Success platforms cost in 2026?",
      answer: "Pricing varies widely. Expect $15,000-$50,000/year for mid-market plans. Vitally and ChurnZero offer the most transparent pricing. Gainsight requires custom enterprise quotes. Many platforms offer free trials or scaled pricing based on customer count.",
    },
  ],
  "best-cs-ai-agents-2026": [
    {
      question: "What are the best AI agents for Customer Success in 2026?",
      answer: "The top AI agents for CS in 2026 are ChurnZero AI Agents (best for mid-market operational automation), Gainsight Atlas (best for enterprise analytics), Oliv.ai Agents (best for AI-native autonomous workflows), and Forethought AI (best for support-focused CS automation).",
    },
    {
      question: "Can AI agents replace Customer Success Managers?",
      answer: "AI agents are designed to augment CSMs, not replace them. They handle repetitive, data-heavy tasks like QBR prep, health monitoring, and long-tail account coverage, freeing CSMs to focus on strategic relationship-building and complex problem-solving.",
    },
  ],
  "saas-onboarding-checklist-2026": [
    {
      question: "What is the most important metric for SaaS onboarding success?",
      answer: "Time-to-value (TTV) is the most important onboarding metric. Customers who reach their 'aha moment' within the first 14 days retain at 4.2x the rate of those who don't, according to Gainsight PX 2026 data.",
    },
    {
      question: "What are the key phases of SaaS customer onboarding?",
      answer: "SaaS onboarding typically has four phases: Pre-onboarding (before Day 1 — welcome emails, account setup, stakeholder identification), Week 1 Foundation (kickoff call, core feature activation, quick wins), Weeks 2-4 Adoption (feature milestones, health score baseline, user training), and Day 30-90 Expansion (usage benchmarking, ROI documentation, first QBR prep).",
    },
    {
      question: "When should SaaS companies use self-serve vs high-touch onboarding?",
      answer: "Use high-touch onboarding (1:1 CSM) for enterprise accounts with complex needs and high ACV. Use self-serve onboarding for SMB accounts with straightforward use cases. Mid-market accounts benefit from a hybrid approach combining automated sequences with periodic CSM check-ins.",
    },
    {
      question: "What percentage of SaaS churn happens during onboarding?",
      answer: "According to OpenView Partners, 67% of net churn occurs within the first 90 days, overwhelmingly among users who never activated key features during onboarding. This makes onboarding the #1 predictor of long-term retention.",
    },
  ],
  "churn-prediction-affordable-2026": [
    {
      question: "How can mid-market SaaS companies predict churn without expensive tools?",
      answer: "Mid-market SaaS companies can build effective churn prediction using a DIY health scoring framework that combines product usage signals (login frequency, feature adoption), support signals (ticket volume, sentiment), engagement signals (email opens, meeting attendance), and business signals (renewal dates, stakeholder changes). Affordable tools like PostHog, Vitally, Planhat, and Custify can power this without enterprise-grade pricing.",
    },
    {
      question: "What are the best affordable alternatives to Gainsight for churn prediction?",
      answer: "For mid-market teams, the best alternatives include Vitally, Planhat, and Custify for CS platforms, PostHog or Mixpanel for product analytics, and GPT/Claude APIs for support ticket sentiment analysis. These can be connected via Make.com or Zapier to build a comprehensive early warning system at a fraction of Gainsight's $50K+/year cost.",
    },
    {
      question: "What signals best predict customer churn in B2B SaaS?",
      answer: "The strongest churn predictors are: declining product usage (login frequency, feature adoption depth, session duration), increasing support ticket volume with negative sentiment, decreasing engagement (missed meetings, unopened emails), and business signals like approaching renewal dates without expansion conversations or key stakeholder departures.",
    },
  ],
  "digital-cs-playbook-2026": [
    {
      question: "What is Digital Customer Success?",
      answer: "Digital Customer Success (Digital CS) is a strategy for serving customers primarily through automated, tech-driven touchpoints rather than 1:1 human interactions. It goes beyond email automation to include automated onboarding sequences, health-score-triggered campaigns, self-serve knowledge bases, AI chatbots, automated QBR data collection, and community-led support.",
    },
    {
      question: "How many customers can one CSM manage with digital CS?",
      answer: "With a digital-first approach, CSM-to-account ratios can scale significantly. Traditional high-touch models support ~50 accounts per CSM. With hybrid digital CS, CSMs can manage 200-500 mid-market accounts. Fully digital (SMB tier) can support 1,000+ accounts with automated workflows and escalation paths to human CSMs when needed.",
    },
    {
      question: "What is the right segmentation for digital vs high-touch CS?",
      answer: "A common segmentation model is: Enterprise accounts (high-touch, 1:1 CSM), Mid-market accounts (hybrid — CSM + automation), and SMB accounts (digital-first, mostly automated with human escalation paths). The thresholds depend on ACV, product complexity, and customer needs.",
    },
  ],
};

export function getFAQsForSlug(slug: string): FAQ[] | null {
  return faqMap[slug] || null;
}
