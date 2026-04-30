#!/usr/bin/env python3
"""Send Day 3 follow-up emails to Tier 1 OnboardSuccess integrators."""
import sys, os, time, datetime
sys.path.insert(0, os.path.expanduser("~/.openclaw/workspace/nocodelisted"))
from smtp_send import send_email

FOLLOWUPS = [
    {
        "to": "hello@ncloudintegrators.com",
        "company": "nCloud Integrators",
        "subject": "Re: nCloud Integrators is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "success@valuize.co",
        "company": "Valuize",
        "subject": "Re: Valuize is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "growth@growthmolecules.com",
        "company": "Growth Molecules",
        "subject": "Re: Growth Molecules is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "sales@grazitti.com",
        "company": "Grazitti Interactive",
        "subject": "Re: Grazitti Interactive is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "info@satrixsolutions.com",
        "company": "Satrix Solutions",
        "subject": "Re: Satrix Solutions is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "info@clarkstonconsulting.com",
        "company": "Clarkston Consulting",
        "subject": "Re: Clarkston Consulting is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "coaches@successcoaching.co",
        "company": "SuccessCOACHING",
        "subject": "Re: SuccessCOACHING is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "solutions@logic2020.com",
        "company": "Logic20/20",
        "subject": "Re: Logic20/20 is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "info@coastalcloud.us",
        "company": "Coastal Cloud",
        "subject": "Re: Coastal Cloud is listed on OnboardSuccess — claim your profile?",
    },
    {
        "to": "kaneanalyticsllc@gmail.com",
        "company": "Kane Analytics",
        "subject": "Re: Kane Analytics is listed on OnboardSuccess — claim your profile?",
    },
]

BODY = """Just following up on my email from Sunday — wanted to make sure you saw your listing on OnboardSuccess. Happy to update anything if the details need tweaking.

Best,
Fikret
fikret@nocodelisted.com"""

if __name__ == "__main__":
    sent = []
    failed = []
    for i, e in enumerate(FOLLOWUPS):
        print(f"[{i+1}/{len(FOLLOWUPS)}] Sending follow-up to {e['company']} ({e['to']})...")
        try:
            send_email(to=e["to"], subject=e["subject"], body=BODY, delay=15.0)
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

    # Log results
    log_path = os.path.expanduser("~/.openclaw/workspace/memory/outreach-log.md")
    ts = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M UTC")
    entry = f"\n## {ts} — OnboardSuccess Tier 1 Day 3 Follow-up\n"
    entry += f"- **Sent:** {len(sent)} | **Failed:** {len(failed)}\n"
    for name in sent:
        entry += f"  - ✅ {name}\n"
    for name, err in failed:
        entry += f"  - ❌ {name}: {err}\n"
    entry += "\n"

    if not os.path.exists(log_path):
        with open(log_path, "w") as f:
            f.write("# Outreach Log\n")
    with open(log_path, "a") as f:
        f.write(entry)
    print(f"Logged to {log_path}")
