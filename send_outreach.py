#!/usr/bin/env python3
"""Send OnboardSuccess integrator outreach emails — Tier 1 (email-ready)."""
import sys, os, time
sys.path.insert(0, os.path.expanduser("~/.openclaw/workspace/nocodelisted"))
from smtp_send import send_email

EMAILS = [
    {
        "to": "hello@ncloudintegrators.com",
        "company": "nCloud Integrators",
        "subject": "nCloud Integrators is listed on OnboardSuccess — claim your profile?",
        "body": """Hi nCloud team,

Wanted to let you know that nCloud Integrators is listed on onboard-success.com/integrators — a CS AI resource hub used by mid-market B2B SaaS teams looking for Gainsight implementation partners exactly like you.

Your listing is live and free. You can claim it anytime to update your description, add your logo, and make sure your specialties (Gainsight CS/PX, health score architecture, playbook design) are accurate.

We also offer a Featured Listing for $49/mo — prominent placement, a "Featured" badge, and priority in filters. Given your position as a market leader in Gainsight implementations, it could drive qualified inbound.

Happy to send the direct link to your listing. No pressure either way.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "success@valuize.co",
        "company": "Valuize",
        "subject": "Valuize is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Valuize team,

Valuize is already listed on onboard-success.com/integrators — a resource hub for CS teams at mid-market B2B SaaS companies evaluating strategy consultants and implementation partners.

The listing highlights your Gainsight expertise, NRR optimization, and CS strategy work — and it's completely free. You can claim it to update info, add your logo, and ensure accuracy.

If you're interested, we also have a Featured Listing option ($49/mo) for prominent placement and a "Featured" badge. Your CS strategy + Gainsight combo is exactly what our audience searches for.

Let me know if you'd like the direct link.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "growth@growthmolecules.com",
        "company": "Growth Molecules",
        "subject": "Growth Molecules is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Growth Molecules team,

Growth Molecules is already listed on onboard-success.com/integrators — a CS resource hub targeting mid-market B2B SaaS companies looking for Gainsight partners and CS enablement experts.

The listing is free and highlights your specialties: Gainsight implementation, team training, scalable CS programs, and onboarding design. You can claim it to update anything and add your logo.

We also have a Featured Listing ($49/mo) for prominent placement and priority in filters. Your enablement focus is a strong match for our audience.

Want me to send the direct link?

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "sales@grazitti.com",
        "company": "Grazitti Interactive",
        "subject": "Grazitti Interactive is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Grazitti team,

Grazitti Interactive is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams evaluating Gainsight implementation partners and custom AI development.

Your listing is live and free, covering your Gainsight work, SearchUnify, and AI development capabilities. You can claim it to update details and add your logo.

We also offer Featured Listings ($49/mo) for prominent placement and a badge. With your large certified team and dual Gainsight/AI focus, it could drive relevant inbound.

Happy to share the link.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "info@satrixsolutions.com",
        "company": "Satrix Solutions",
        "subject": "Satrix Solutions is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Satrix team,

Satrix Solutions is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams. Your NPS programs, CX research, and retention analytics expertise is highlighted.

The listing is free. You can claim it to update details and add your logo. We also have Featured Listings ($49/mo) for prominent placement and priority in filters.

Happy to send the link.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "info@clarkstonconsulting.com",
        "company": "Clarkston Consulting",
        "subject": "Clarkston Consulting is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Clarkston team,

Clarkston Consulting is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams evaluating Salesforce Agentforce and AI implementation partners.

The listing is free and highlights your Salesforce expertise, AI governance, and enterprise transformation work. You can claim it to update details and add your branding.

We also offer Featured Listings ($49/mo) for prominent placement. Let me know if you'd like to see your listing.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "coaches@successcoaching.co",
        "company": "SuccessCOACHING",
        "subject": "SuccessCOACHING is listed on OnboardSuccess — claim your profile?",
        "body": """Hi SuccessCOACHING team,

SuccessCOACHING is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams looking for CS strategy consulting and training.

The listing is free and highlights your leadership consulting, platform adoption, and CS training work. Claim it to update info and add your logo.

Featured Listings ($49/mo) are available for prominent placement if you're interested.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "solutions@logic2020.com",
        "company": "Logic20/20",
        "subject": "Logic20/20 is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Logic20/20 team,

Logic20/20 is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams evaluating Salesforce Service Cloud and digital transformation partners.

The listing is free. Claim it to update your details and add branding. Featured Listings ($49/mo) are available for premium placement.

Happy to send the link.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "info@coastalcloud.us",
        "company": "Coastal Cloud",
        "subject": "Coastal Cloud is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Coastal Cloud team,

Coastal Cloud is listed on onboard-success.com/integrators — a CS AI resource hub for mid-market B2B SaaS teams evaluating Salesforce Service Cloud partners.

The listing is free and highlights your Salesforce platinum partnership and AI integration capabilities. Claim it to update details and add your logo.

Featured Listings ($49/mo) are available for prominent placement. Let me know if you want the link.

Best,
Fikret
fikret@nocodelisted.com"""
    },
    {
        "to": "kaneanalyticsllc@gmail.com",
        "company": "Kane Analytics",
        "subject": "Kane Analytics is listed on OnboardSuccess — claim your profile?",
        "body": """Hi Kane Analytics team,

Kane Analytics is listed on onboard-success.com/integrators — a CS resource hub for mid-market B2B SaaS teams. Your CS operations and AI-driven customer success expertise is highlighted.

The listing is free. Claim it to update info and add your logo. Featured Listings ($49/mo) are available for prominent placement.

Happy to send the link.

Best,
Fikret
fikret@nocodelisted.com"""
    },
]

if __name__ == "__main__":
    sent = []
    failed = []
    for i, e in enumerate(EMAILS):
        print(f"[{i+1}/{len(EMAILS)}] Sending to {e['company']} ({e['to']})...")
        try:
            send_email(to=e["to"], subject=e["subject"], body=e["body"], delay=15.0)
            sent.append(e["company"])
            print(f"  ✅ Sent to {e['company']}")
        except Exception as ex:
            failed.append((e["company"], str(ex)))
            print(f"  ❌ FAILED: {e['company']} — {ex}")
    
    print(f"\n{'='*50}")
    print(f"RESULTS: {len(sent)} sent, {len(failed)} failed")
    print(f"Sent: {', '.join(sent)}")
    if failed:
        print(f"Failed:")
        for name, err in failed:
            print(f"  - {name}: {err}")
