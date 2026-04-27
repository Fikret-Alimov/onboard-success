#!/usr/bin/env python3
"""Send Tier 2 integrator outreach instructions to Fikret."""
import sys, os
sys.path.insert(0, os.path.expanduser("~/.openclaw/workspace/nocodelisted"))
from smtp_send import send_email

BODY = """Hi Fikret,

Here are the 12 Tier 2 integrators that need manual contact form submissions (no public email found). Each has a draft message ready — just paste it into their contact form.

I've also noted 2 skips (Accenture, Indra — too large, won't care about a $49/mo listing).

——————————————————————————————

1. CSM PRACTICE
   Form: https://csmpractice.com/contact
   Subject: CSM Practice is listed on OnboardSuccess — claim your profile?
   Message:
   Hi CSM Practice team,
   CSM Practice is listed on onboard-success.com/integrators — a CS AI resource hub used by mid-market B2B SaaS teams looking for CS transformation consultants. Your listing covers your work in CS transformation, Gainsight implementation, and retention strategy — all free. You can claim it to update details, add your logo, and ensure accuracy. We also offer Featured Listings ($49/mo) for prominent placement and a badge. Given your focus on building and restructuring CS functions, it could be a strong fit. Happy to share your listing link.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

2. WINNING BY DESIGN
   Form: https://winningbydesign.com/contact
   Subject: Winning by Design is listed on OnboardSuccess — claim your profile?
   Message:
   Hi WbD team,
   Winning by Design is listed on onboard-success.com/integrators — a resource hub for CS teams at mid-market B2B SaaS companies. Your SPICED framework and revenue architecture expertise is exactly what this audience looks for. The listing is free. You can claim it to update info and add your branding. We also offer a Featured Listing ($49/mo) for prominent placement. Let me know if you'd like the direct link.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

3. REVPARTNERS
   Form: https://revpartners.io/contact
   Subject: RevPartners is listed on OnboardSuccess — claim your profile?
   Message:
   Hi RevPartners team,
   RevPartners is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams. Your HubSpot Service Hub expertise and RevOps automation work is highlighted. The listing is free. Claim it to update info and add your logo. Featured Listings are available for $49/mo if you want prominent placement. Happy to share the link.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

4. COMPLETECSM
   Form: https://completecsm.com (use site contact form)
   Subject: CompleteCSM is listed on OnboardSuccess — claim your profile?
   Message:
   Hi CompleteCSM team,
   CompleteCSM is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams. Your human-first AI frameworks and CS methodology work is exactly what this audience needs. The listing is free. Claim it to update your info and add branding. We also offer Featured Listings ($49/mo) for premium placement. Let me know if you want the direct link.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

5. CUSTOMER SUCCESS ASSOCIATES
   Form: https://www.customersuccessassociates.com/contact
   Subject: Customer Success Associates is listed on OnboardSuccess — claim your profile?
   Message:
   Hi CS Associates team,
   Customer Success Associates is listed on onboard-success.com/integrators — a resource hub for CS teams at mid-market B2B SaaS companies looking for CS platform implementation partners. The listing is free. Claim it to update details and add your logo. Featured Listings ($49/mo) are available for prominent placement. Happy to send the link.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

6. TOTANGO
   Form: https://www.totango.com/contact-us
   Subject: Totango is listed on OnboardSuccess — claim your profile?
   Message:
   Hi Totango team,
   Totango is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams. Your customer success platform and AI-driven retention capabilities are highlighted. The listing is free. You can claim it to update details and ensure accuracy. Featured Listings ($49/mo) are available for prominent placement. Let me know if you'd like the link.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

7. SERVICEROCKET
   Form: https://www.servicerocket.com/contact/
   Subject: ServiceRocket is listed on OnboardSuccess — claim your profile?
   Message:
   Hi ServiceRocket team,
   ServiceRocket is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams. Your Gainsight and Salesforce implementation expertise is highlighted. The listing is free. Claim it to update info and add your logo. Featured Listings ($49/mo) available for prominent placement.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

8. CLOUDTASK
   Form: https://www.cloudtask.com/contact-us/
   Subject: CloudTask is listed on OnboardSuccess — claim your profile?
   Message:
   Hi CloudTask team,
   CloudTask is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams. Your HubSpot and RevOps consulting work is highlighted. The listing is free. Claim it to update details and add branding. Featured Listings ($49/mo) for premium placement.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

9. KGP ADVISORY
   Form: https://kgpadvisory.com (site contact form or LinkedIn)
   Subject: KGP Advisory is listed on OnboardSuccess — claim your profile?
   Message:
   Hi KGP Advisory team,
   KGP Advisory is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams evaluating CS operations consultants. The listing is free and highlights your SaaS customer strategy and CS scaling expertise across Europe. Claim it to update details and add your branding. Featured Listings ($49/mo) available for prominent placement.
   Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

10. THE DIGITAL TRANSFORMATION HUB
    Form: https://digitaltransformationhub.ai (site contact form)
    Subject: Digital Transformation Hub is listed on OnboardSuccess — claim your profile?
    Message:
    Hi DTH team,
    The Digital Transformation Hub is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams. Your AI-led customer success solutions are highlighted. The listing is free. Claim it to update info. Featured Listings ($49/mo) for premium placement.
    Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

11. CES PARTNERS
    Form: https://www.cespartners.co.uk (site contact form or LinkedIn)
    Subject: CES Partners is listed on OnboardSuccess — claim your profile?
    Message:
    Hi CES Partners team,
    CES Partners is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams. Your CS operations, training, and enablement expertise across the UK and Europe is highlighted. The listing is free. Claim it to update info and add your logo. Featured Listings ($49/mo) for prominent placement.
    Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

12. CLOUDBRIDGE CONSULTING
    Form: https://www.cloudbridgeconsulting.com (site contact form or LinkedIn)
    Subject: CloudBridge Consulting is listed on OnboardSuccess — claim your profile?
    Message:
    Hi CloudBridge team,
    CloudBridge Consulting is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams. Your AI transformation and cloud enablement work in APAC is highlighted. The listing is free. Claim it to update info. Featured Listings ($49/mo) for premium placement.
    Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

13. TRANSFORM AI CX
    Form: https://transformaicx.com (site contact form or LinkedIn)
    Subject: Transform AI CX is listed on OnboardSuccess — claim your profile?
    Message:
    Hi Transform AI CX team,
    Transform AI CX is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams. Your AI-powered CX work and ML-driven engagement optimization is highlighted. The listing is free. Claim it to update info. Featured Listings ($49/mo) for premium placement.
    Best, Fikret — fikret@nocodelisted.com

——————————————————————————————

SKIPPED (too large — won't respond to this type of outreach):
- Accenture Customer Experience
- Indra Asia Pacific

——————————————————————————————

HOW TO DO IT:
1. Open each contact form URL in your browser
2. Paste the subject into the subject/topic field (if available)
3. Paste the message into the message body
4. Use fikret@nocodelisted.com as your email
5. Submit

Tips:
- Some forms won't have a subject field — just paste the message
- If a form requires a phone number, use any placeholder
- LinkedIn DMs are a good alternative if the form looks broken or overly complex
- Do maybe 3-4 per sitting to avoid fatigue

——————————————————————————————

TIER 1 STATUS (sent this morning by Peter):
All 10 emails sent successfully at 09:00 your time. Copies in your Sent folder (fikret@nocodelisted.com).

I'll monitor the inbox for replies and flag anything that comes back.

— Peter
"""

send_email(
    to="fikret.second@gmail.com",
    subject="OnboardSuccess Tier 2 Outreach — 13 Contact Forms Ready (instructions inside)",
    body=BODY,
    delay=0,
)
print("✅ Instructions sent to fikret.second@gmail.com")
