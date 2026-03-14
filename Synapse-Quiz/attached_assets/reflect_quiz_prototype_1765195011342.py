"""
Reflect Quiz Prototype  –  45 MCQs + 5 Scenarios
================================================
Run with:
    pip install streamlit
    streamlit run reflect_quiz_prototype.py
Features
--------
• 45 multiple-choice questions (4 modules)
• 5 written “Crucible” scenarios (≥200 chars, 15-min timer)
• Two rounds  (self  →  empathy-as-partner)
• 10-second cooldown on MCQs
• Vague-answer detection for scenarios (“idk”, “whatever”, etc.)
• Answer-time capture for Instinct vs Intellect insight
NOTE: comparison heat-map & AI prompts come in the next build.
"""

import streamlit as st
import time, uuid, re
from datetime import datetime, timedelta

# ---------------------------- Question Bank -----------------------------
# each dict: id, category, question text, options list
QUESTIONS = [
    # Module 1 – Everyday Preferences & Pet Peeves (1-15)
    {"id": 1,  "cat": "Daily", "text": "Energy peaks…",
     "opts": ["Morning", "Mid-day", "Evening", "Late night"]},
    {"id": 2,  "cat": "Daily", "text": "Clutter tolerance…",
     "opts": ["Very low", "Moderate", "High", "Only my space"]},
    {"id": 3,  "cat": "Daily", "text": "Stress first instinct…",
     "opts": ["Talk it out", "Be alone", "Distract", "Seek a hug"]},
    {"id": 4,  "cat": "Daily", "text": "Ideal weekend vibe…",
     "opts": ["Party", "Small hang", "Solo recharge", "Adventure out"]},
    {"id": 5,  "cat": "Daily", "text": "Noise while working…",
     "opts": ["Need silence", "Soft music", "Background TV", "Does not matter"]},
    {"id": 6,  "cat": "Daily", "text": "Morning routine must…",
     "opts": ["Coffee", "Workout", "Meditation", "Sleep til last minute"]},
    {"id": 7,  "cat": "Daily", "text": "Punctuality…",
     "opts": ["Always early", "On time", "5-10 min late", "Flexible"]},
    {"id": 8,  "cat": "Daily", "text": "Phone call feelings…",
     "opts": ["Love calls", "Prefer text", "Depends", "Avoid calls"]},
    {"id": 9,  "cat": "Daily", "text": "Pet ownership…",
     "opts": ["Have & love", "Want someday", "Indifferent", "Not for me"]},
    {"id": 10, "cat": "Daily", "text": "Spicy-food scale…",
     "opts": ["Mild only", "Medium", "Bring heat", "All spice all day"]},
    {"id": 11, "cat": "Daily", "text": "Social-media usage…",
     "opts": ["Heavy", "Moderate", "Rare", "None"]},
    {"id": 12, "cat": "Daily", "text": "Driving style…",
     "opts": ["Cautious", "Normal", "Fast", "I do not drive"]},
    {"id": 13, "cat": "Daily", "text": "TV preference…",
     "opts": ["Series binge", "Movies", "Reality", "Docs / news"]},
    {"id": 14, "cat": "Daily", "text": "Clothing style…",
     "opts": ["Athleisure", "Trendy", "Classic", "Whatever is comfy"]},
    {"id": 15, "cat": "Daily", "text": "Loud sudden noises make me…",
     "opts": ["Fine", "Anxious", "Angry", "Jump then laugh"]},

    # Module 2 – Love & Partnership Dynamics (16-30)
    {"id": 16, "cat": "Partner", "text": "Top love language…",
     "opts": ["Words", "Acts", "Gifts", "Time", "Touch"]},
    {"id": 17, "cat": "Partner", "text": "Best reconnection method…",
     "opts": ["Deep talk", "Fun date", "Physical intimacy", "Joint project"]},
    {"id": 18, "cat": "Partner", "text": "PDA level…",
     "opts": ["Love it", "Small gestures", "Private only", "Never"]},
    {"id": 19, "cat": "Partner", "text": "Argue style…",
     "opts": ["Raise voice", "Withdraw", "Logical", "Sarcastic"]},
    {"id": 20, "cat": "Partner", "text": "Cooling-off time need…",
     "opts": ["<10 min", "30 min", "Few hours", "Overnight"]},
    {"id": 21, "cat": "Partner", "text": "Apology language…",
     "opts": ["Own fault", "Make amends", "Explain lesson", "Promise no repeat"]},
    {"id": 22, "cat": "Partner", "text": "Daily texting expectation…",
     "opts": ["All day chat", "Few check-ins", "Night recap", "Only urgent"]},
    {"id": 23, "cat": "Partner", "text": "Handling money stress…",
     "opts": ["Budget", "Ignore", "Talk it out", "Work extra"]},
    {"id": 24, "cat": "Partner", "text": "Jealousy level…",
     "opts": ["Low", "Situational", "Medium", "High"]},
    {"id": 25, "cat": "Partner", "text": "Start tough convo…",
     "opts": ["Immediately", "When calm", "Write first", "Avoid"]},
    {"id": 26, "cat": "Partner", "text": "Date-night frequency…",
     "opts": ["Daily", "2-3 per week", "Weekly", "Twice a month"]},
    {"id": 27, "cat": "Partner", "text": "Partner’s bad-day response…",
     "opts": ["Cheer up", "Give space", "Ask needs", "Distract"]},
    {"id": 28, "cat": "Partner", "text": "When anxious I want…",
     "opts": ["Talk me through", "Sit quietly", "Give space", "Humor"]},
    {"id": 29, "cat": "Partner", "text": "Instant turn-off…",
     "opts": ["Hygiene", "Arrogance", "Clingy", "Poor listening"]},
    {"id": 30, "cat": "Partner", "text": "Meeting families timing…",
     "opts": ["Early", "Few months", "Committed stage", "Only very serious"]},

    # Module 3 – Intimacy & Desire (31-40)
    {"id": 31, "cat": "Vellum", "text": "Intimacy initiation…",
     "opts": ["I start", "Partner starts", "50-50", "Planned talk"]},
    {"id": 32, "cat": "Vellum", "text": "Most important element…",
     "opts": ["Emotional", "Novelty", "Feeling desired", "Playfulness"]},
    {"id": 33, "cat": "Vellum", "text": "Aftercare importance…",
     "opts": ["Non-negotiable", "Some affection", "Quick hug", "Alone time"]},
    {"id": 34, "cat": "Vellum", "text": "Spontaneity vs planning…",
     "opts": ["Spontaneous", "Light plan", "Scheduled", "Need notice"]},
    {"id": 35, "cat": "Vellum", "text": "Talking fantasies…",
     "opts": ["Easy", "When asked", "Rare", "Uncomfortable"]},
    {"id": 36, "cat": "Vellum", "text": "Porn together…",
     "opts": ["Yes", "Solo fine", "Occasional", "Not comfy"]},
    {"id": 37, "cat": "Vellum", "text": "Role-play interest…",
     "opts": ["Love it", "Maybe", "Not now", "No"]},
    {"id": 38, "cat": "Vellum", "text": "Kink openness…",
     "opts": ["Very", "Some", "Little", "None"]},
    {"id": 39, "cat": "Vellum", "text": "Ideal frequency…",
     "opts": ["Daily", "Few per week", "Weekly", "Varies"]},
    {"id": 40, "cat": "Vellum", "text": "Rejection feels like…",
     "opts": ["Understand", "Disappointed", "Rejected", "Angry"]},

    # Module 4 – Vision & Purpose (41-45)
    {"id": 41, "cat": "Vision", "text": "Primary long-term goal…",
     "opts": ["Marriage", "Raise kids", "Adventure growth", "Companionship"]},
    {"id": 42, "cat": "Vision", "text": "Five-year picture…",
     "opts": ["Settled home", "Nomadic", "Career focus", "Open flow"]},
    {"id": 43, "cat": "Vision", "text": "Partnership reason…",
     "opts": ["Stability", "Synergy", "Shared purpose", "Expectation"]},
    {"id": 44, "cat": "Vision", "text": "Deal-breaker mismatch…",
     "opts": ["Kids decision", "Travel vs roots", "Risk tolerance", "Adaptable"]},
    {"id": 45, "cat": "Vision", "text": "Legacy desire…",
     "opts": ["Family traditions", "Impactful work", "Adventures", "Community"]}
]

# 5 written scenarios
SCENARIOS = [
    {"id": "S1", "prompt": "Partner comes home upset but says 'I don’t want to talk.' Describe your next 60 minutes."},
    {"id": "S2", "prompt": "Shared account overdraft of $500. Draft your first conversation."},
    {"id": "S3", "prompt": "An ex messages you at midnight. Explain your response and how you inform your partner."},
    {"id": "S4", "prompt": "You are exhausted, partner needs urgent support. Detail how you balance both needs tonight."},
    {"id": "S5", "prompt": "Partner proposes a fantasy you are unsure about. Describe how you explore consent and boundaries."}
]

TOTAL = len(QUESTIONS)
ROUND = {"self": "Answer for YOURSELF", "empathy": "Answer AS YOUR PARTNER"}

# ------------------------- Session Init -------------------------
if "uid" not in st.session_state:
    st.session_state.uid = str(uuid.uuid4())
    st.session_state.round = "self"
    st.session_state.page = 0
    st.session_state.answers = {"self": {}, "empathy": {}}
    st.session_state.timer = None

# ------------------------- Helper funcs -------------------------
def start_timer():
    st.session_state.timer = time.time()

def secs():
    return 0.0 if st.session_state.timer is None else time.time() - st.session_state.timer

def vague(txt):
    return bool(re.search(r"\b(idk|i don.?t know|whatever|not sure)\b", txt.strip(), re.I))

# ------------------------- UI flow ------------------------------
st.title("The Synapse Quiz  (prototype)")
st.caption(ROUND[st.session_state.round])

p = st.session_state.page

# ---------- multiple-choice ----------
if p < TOTAL:
    q = QUESTIONS[p]
    st.markdown(f"**{p+1}. {q['text']}**")
    choice = st.radio("Choose one:", q["opts"], index=-1)

    if choice:
        if st.session_state.timer is None:
            start_timer()
        st.session_state.answers[st.session_state.round][q["id"]] = {"ans": choice, "t": round(secs(), 1)}

        remain = 10 - secs()
        disabled = remain > 0
        if disabled:
            st.info(f"Reflect {int(remain)} s…")
        if st.button("Next", disabled=disabled):
            st.session_state.page += 1
            st.session_state.timer = None
    else:
        st.button("Next", disabled=True)

# ---------- scenario ----------
elif p < TOTAL + len(SCENARIOS):
    s = SCENARIOS[p - TOTAL]
    st.subheader(f"Scenario {s['id']}")
    st.write(s["prompt"])

    if st.session_state.timer is None:
        st.session_state.timer_start = datetime.utcnow()
        st.session_state.timer = time.time()

    txt = st.text_area("Your answer (≥200 chars):", height=200)
    chars = len(txt)
    st.caption(f"{chars}/200")

    elapsed = datetime.utcnow() - st.session_state.timer_start
    remain = timedelta(minutes=15) - elapsed
    ready = chars >= 200 and remain.total_seconds() <= 0 and not vague(txt)

    if chars < 200:
        st.warning("Need at least 200 characters.")
    elif vague(txt):
        st.warning("Please avoid 'idk', 'whatever', etc.")
    elif remain.total_seconds() > 0:
        st.info(f"Reflection time: {int(remain.total_seconds())} s left")

    if st.button("Next", disabled=not ready):
        st.session_state.answers[st.session_state.round][s["id"]] = {"ans": txt, "chars": chars, "t": round(secs(), 1)}
        st.session_state.page += 1
        st.session_state.timer = None

# ---------- done ----------
else:
    st.success("Round complete!")
    if st.session_state.round == "self":
        st.session_state.round = "empathy"
        st.session_state.page = 0
        st.write("Now repeat the quiz **as your partner**.")
    else:
        st.write("Both rounds finished – raw data:")
        st.json(st.session_state.answers)
