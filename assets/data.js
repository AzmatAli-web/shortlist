/* Generated from the Shortlist dataset. */
window.SL = {
  "version": "1.0",
  "count": 40,
  "categories": [
    {
      "s": "write",
      "n": "Writing & research",
      "code": "WR",
      "d": "Assistants and research desks for drafting, reading and checking a claim."
    },
    {
      "s": "design",
      "n": "Design & images",
      "code": "DS",
      "d": "Image, interface and site tools for work that has to look like something."
    },
    {
      "s": "code",
      "n": "Code & build",
      "code": "CD",
      "d": "Editors, agents and app builders for writing and shipping software."
    },
    {
      "s": "video",
      "n": "Video & motion",
      "code": "VD",
      "d": "Generation and editing for moving pictures, from one shot to a finished cut."
    },
    {
      "s": "audio",
      "n": "Audio & voice",
      "code": "AU",
      "d": "Speech, music and cleanup for the sound you would otherwise re-record."
    },
    {
      "s": "work",
      "n": "Work & meetings",
      "code": "WK",
      "d": "Notes, meetings and the daily queue, with AI where it earns its place."
    },
    {
      "s": "auto",
      "n": "Automation & agents",
      "code": "AT",
      "d": "Workflows, agents and integrations for the copy-paste you should not do again."
    },
    {
      "s": "data",
      "n": "Data & analysis",
      "code": "DT",
      "d": "Analysis and dashboards for questions that need a number."
    }
  ],
  "tools": [
    {
      "id": "chatgpt",
      "n": "ChatGPT",
      "ab": "CG",
      "c": "write",
      "t": "The default assistant, best when you give it a real brief.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop",
        "mobile",
        "api"
      ],
      "tags": "assistant, drafting",
      "url": "https://chatgpt.com",
      "note": "It is the tool most people mean when they say AI. The reason it stays is breadth: a fast draft, a spreadsheet formula, a second opinion on a contract clause, all in one tab.",
      "good": [
        "Fast first drafts in almost any format",
        "Voice mode and file uploads on mobile"
      ],
      "watch": "Long projects drift. Keep the source files attached and restate the brief.",
      "newRank": -1
    },
    {
      "id": "claude",
      "n": "Claude",
      "ab": "CL",
      "c": "write",
      "t": "Long documents, careful edits, and code that survives review.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop",
        "mobile",
        "api"
      ],
      "tags": "assistant, long context",
      "url": "https://claude.ai",
      "pick": 1,
      "pickNote": "The one I trust with a long document.",
      "note": "Claude is the one we hand a 60-page document to. Projects keep the context, Artifacts put the draft beside the source, and the writing voice needs less cleanup than most.",
      "good": [
        "Long context that holds up",
        "Artifacts for side-by-side drafting"
      ],
      "watch": "Usage limits arrive sooner than you expect on the free plan.",
      "newRank": -1
    },
    {
      "id": "gemini",
      "n": "Gemini",
      "ab": "GE",
      "c": "write",
      "t": "Google's assistant, useful mostly because it lives where your files are.",
      "p": "freemium",
      "pl": [
        "web",
        "mobile",
        "api"
      ],
      "tags": "assistant, workspace",
      "url": "https://gemini.google.com",
      "note": "The advantage is not the model, it is the plumbing. Gmail, Docs, Drive and Calendar are one prompt away. If your work already lives in Google Workspace, this is the least friction you can buy.",
      "good": [
        "Works across Gmail, Docs and Drive",
        "Image and video models in the same app"
      ],
      "watch": "Feature names and availability change by plan and region.",
      "newRank": -1
    },
    {
      "id": "perplexity",
      "n": "Perplexity",
      "ab": "PX",
      "c": "write",
      "t": "An answer engine that shows its sources, so you can check the claim.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop",
        "mobile"
      ],
      "tags": "search, citations",
      "url": "https://www.perplexity.ai",
      "pick": 1,
      "pickNote": "Search that shows its work.",
      "note": "Search with citations attached. We use it for market scans and for any question where being wrong is expensive, because every paragraph links to the page it came from.",
      "good": [
        "Inline citations on every answer",
        "Deep Research builds a sourced brief"
      ],
      "watch": "It summarises, it does not verify. Open the sources before you cite them.",
      "newRank": -1
    },
    {
      "id": "notebooklm",
      "n": "NotebookLM",
      "ab": "NL",
      "c": "write",
      "t": "A research desk that only answers from the sources you give it.",
      "p": "freemium",
      "pl": [
        "web",
        "mobile"
      ],
      "tags": "research, pdf",
      "url": "https://notebooklm.google.com",
      "note": "Upload PDFs, notes or a URL and it answers inside that set. The audio overview is the party trick, but the grounded citations are the reason to keep it.",
      "good": [
        "Answers stay inside your sources",
        "Audio overviews for long reports"
      ],
      "watch": "It will not bring outside knowledge unless you add it as a source.",
      "newRank": -1
    },
    {
      "id": "midjourney",
      "n": "Midjourney",
      "ab": "MJ",
      "c": "design",
      "t": "The image model with a point of view, still the fastest route to a mood.",
      "p": "paid",
      "pl": [
        "web"
      ],
      "tags": "image, art direction",
      "url": "https://www.midjourney.com",
      "pick": 1,
      "pickNote": "Still the fastest way to find a look.",
      "note": "Midjourney does not just render a prompt, it has taste. Style references and moodboards make it possible to keep a campaign in one visual language instead of forty lucky accidents.",
      "good": [
        "Distinctive default aesthetics",
        "Style and character references"
      ],
      "watch": "No free tier. Budget for a month before you commit.",
      "newRank": -1
    },
    {
      "id": "figma",
      "n": "Figma",
      "ab": "FI",
      "c": "design",
      "t": "Design, prototype and hand off in one file, with AI in the margins.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop"
      ],
      "tags": "interface, prototyping",
      "url": "https://www.figma.com",
      "note": "Figma AI is not the reason to use Figma. The reason is that the whole team can see the file. First Draft and auto-rename save the boring minutes; the multiplayer canvas does the real work.",
      "good": [
        "Real-time collaboration that holds up",
        "Dev Mode for handoff"
      ],
      "watch": "AI features are still uneven between plans and seats.",
      "newRank": -1
    },
    {
      "id": "canva",
      "n": "Canva",
      "ab": "CV",
      "c": "design",
      "t": "Templates plus AI for the work that does not need a design team.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop",
        "mobile"
      ],
      "tags": "templates, social",
      "url": "https://www.canva.com",
      "note": "Most decks, social posts and one-pagers do not need a designer. Magic Studio gets a non-designer to something presentable, and Brand Kit keeps it from looking off-brand.",
      "good": [
        "Huge template library",
        "Magic Write and background removal"
      ],
      "watch": "Template gravity is real. Adjust the grid or every deck looks the same.",
      "newRank": -1
    },
    {
      "id": "framer",
      "n": "Framer",
      "ab": "FR",
      "c": "design",
      "t": "Design a site and publish it without a developer in the loop.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop"
      ],
      "tags": "website, cms",
      "url": "https://www.framer.com",
      "note": "The closest thing to a design tool that ships. Draw the page, wire the CMS, publish to a real domain. AI can start the layout, but the controls are what make it usable.",
      "good": [
        "Publish and host from the canvas",
        "CMS and localisation built in"
      ],
      "watch": "Complex apps will outgrow it. It is a site builder first.",
      "newRank": -1
    },
    {
      "id": "recraft",
      "n": "Recraft",
      "ab": "RC",
      "c": "design",
      "t": "Vector-native generation for logos, icons and illustration sets.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "vector, illustration",
      "url": "https://www.recraft.ai",
      "note": "Most image models produce pixels. Recraft produces vectors you can open and edit, which matters when the same mark has to work at 16px and on a billboard.",
      "good": [
        "True SVG output",
        "Consistent style across a set"
      ],
      "watch": "Photoreal work is not its strength. Use it for marks and illustration.",
      "newRank": -1
    },
    {
      "id": "cursor",
      "n": "Cursor",
      "ab": "CU",
      "c": "code",
      "t": "An editor built around the model, not bolted onto it.",
      "p": "freemium",
      "pl": [
        "desktop"
      ],
      "tags": "editor, code review",
      "url": "https://cursor.com",
      "pick": 1,
      "pickNote": "Six months in, it is still the first app I open.",
      "note": "Cursor reads the repo, not just the open file. Tab completion learns your patterns, Agent mode runs multi-file changes, and you can still fall back on VS Code muscle memory.",
      "good": [
        "Codebase-wide context",
        "Agent mode for multi-file edits"
      ],
      "watch": "Agent edits need review. Read the diff before you accept it.",
      "newRank": -1
    },
    {
      "id": "copilot",
      "n": "GitHub Copilot",
      "ab": "GC",
      "c": "code",
      "t": "The safe default for completions and chat inside the IDE you already use.",
      "p": "freemium",
      "pl": [
        "desktop",
        "web",
        "api"
      ],
      "tags": "autocomplete, ide",
      "url": "https://github.com/features/copilot",
      "note": "It is the least disruptive way to add AI to a team: same editor, same review flow, a free tier that covers the basics. Copilot Chat handles the explain-this-code questions well.",
      "good": [
        "Works across major IDEs",
        "Free tier for occasional use"
      ],
      "watch": "Suggestions are only as good as the surrounding code. Quiet repos get quiet help.",
      "newRank": -1
    },
    {
      "id": "claudecode",
      "n": "Claude Code",
      "ab": "CC",
      "c": "code",
      "t": "A coding agent that lives in the terminal and works on your actual repo.",
      "p": "paid",
      "pl": [
        "desktop",
        "api"
      ],
      "tags": "agent, refactor",
      "url": "https://www.claude.com/product/claude-code",
      "added": "Oct 21",
      "note": "Point it at a repo, describe the change, and it reads, edits, runs tests and reports back. Best for refactors and test coverage, where the work is broad and the steps are boring.",
      "good": [
        "Multi-file changes with a plan",
        "Runs tests and fixes its own output"
      ],
      "watch": "It is a paid tool with real token usage. Scope the task.",
      "newRank": 0
    },
    {
      "id": "v0",
      "n": "v0",
      "ab": "V0",
      "c": "code",
      "t": "Describe a screen, get React and Tailwind you can paste into a project.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "ui, react",
      "url": "https://v0.dev",
      "note": "The output is not a picture of a UI, it is code. That makes v0 the fastest way to move from a rough idea to a component you can actually edit.",
      "good": [
        "Generates React and Tailwind",
        "Iterate by chatting on the preview"
      ],
      "watch": "Generated markup is a draft. Expect to clean up structure and states.",
      "newRank": -1
    },
    {
      "id": "lovable",
      "n": "Lovable",
      "ab": "LV",
      "c": "code",
      "t": "A full-stack app from a prompt, with a database and deploy attached.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "app builder, full stack",
      "url": "https://lovable.dev",
      "note": "Lovable handles the boring half of a small product: auth, tables, hosting. You still own the data model and the edge cases, but the first deploy is hours, not weeks.",
      "good": [
        "Supabase-backed apps",
        "Visual edit plus chat"
      ],
      "watch": "Custom logic gets cramped. Know when to export the code.",
      "newRank": -1
    },
    {
      "id": "runway",
      "n": "Runway",
      "ab": "RW",
      "c": "video",
      "t": "A video studio for shots that would otherwise need a crew.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "video, generation",
      "url": "https://runwayml.com",
      "note": "Image-to-video is where Runway earns its keep: take a still you already like, give it motion, keep the composition. The editing tools around it make it a workspace, not a toy.",
      "good": [
        "Image-to-video with camera control",
        "Motion brush for local movement"
      ],
      "watch": "Credits disappear fast at high resolution. Draft low, finish high.",
      "newRank": -1
    },
    {
      "id": "sora",
      "n": "Sora",
      "ab": "SO",
      "c": "video",
      "t": "OpenAI's video model, strongest on short, strange, single-shot ideas.",
      "p": "paid",
      "pl": [
        "web",
        "mobile"
      ],
      "tags": "video, generation",
      "url": "https://sora.com",
      "note": "Sora is good at the shot you can describe in one sentence. Cameos and remixes make it social, but the practical use is quick concept footage before a real shoot.",
      "good": [
        "Strong prompt adherence for short shots",
        "Storyboard and remix tools"
      ],
      "watch": "Long sequences lose coherence. Cut around it.",
      "newRank": -1
    },
    {
      "id": "veo",
      "n": "Veo",
      "ab": "VE",
      "c": "video",
      "t": "Google's video model, with sound, inside the Gemini and Flow tools.",
      "p": "paid",
      "pl": [
        "web"
      ],
      "tags": "video, audio",
      "url": "https://deepmind.google/models/veo/",
      "added": "Oct 9",
      "note": "Veo is the one to try when the clip needs audio and a camera direction. Flow gives you the shot list, Veo gives you the frames, and the two stay in the same project.",
      "good": [
        "Native audio with video",
        "Camera and shot controls in Flow"
      ],
      "watch": "Access and quotas depend on your Google plan and region.",
      "newRank": 2
    },
    {
      "id": "descript",
      "n": "Descript",
      "ab": "DS",
      "c": "video",
      "t": "Edit video by editing the transcript, not the timeline.",
      "p": "freemium",
      "pl": [
        "desktop",
        "web"
      ],
      "tags": "podcast, editing",
      "url": "https://www.descript.com",
      "note": "Delete a sentence in the transcript and the video cuts with it. For interviews, tutorials and podcasts, that one idea removes hours of timeline work.",
      "good": [
        "Transcript-based editing",
        "Studio Sound cleans up bad audio"
      ],
      "watch": "Heavy projects get slow. Keep long recordings in chunks.",
      "newRank": -1
    },
    {
      "id": "heygen",
      "n": "HeyGen",
      "ab": "HG",
      "c": "video",
      "t": "Talking-head video and translation without booking a studio.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "avatar, dubbing",
      "url": "https://www.heygen.com",
      "added": "Oct 2",
      "note": "Use it for the videos that need a person but not a shoot: onboarding, product updates, localised training. Avatar quality is good enough for internal use and getting close for marketing.",
      "good": [
        "Avatars from a short recording",
        "Video translation with lip sync"
      ],
      "watch": "Uncanny moments remain. Keep shots short and scripted.",
      "newRank": 3
    },
    {
      "id": "elevenlabs",
      "n": "ElevenLabs",
      "ab": "EL",
      "c": "audio",
      "t": "Text to speech that sounds like a person, with cloning and dubbing.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "voice, tts",
      "url": "https://elevenlabs.io",
      "pick": 1,
      "pickNote": "The demo that made the room go quiet.",
      "note": "The voice quality is the point, but the workflow is what keeps it in the stack: paste a script, pick a voice, export a clean file, or call it from an API at scale.",
      "good": [
        "Natural voices in many languages",
        "Voice cloning with consent controls"
      ],
      "watch": "Cloning needs explicit rights. Set the rule before the team starts.",
      "newRank": -1
    },
    {
      "id": "suno",
      "n": "Suno",
      "ab": "SU",
      "c": "audio",
      "t": "Full songs from a sentence, including the vocals.",
      "p": "freemium",
      "pl": [
        "web",
        "mobile"
      ],
      "tags": "music, songwriting",
      "url": "https://suno.com",
      "note": "Suno is for the jingle, the demo, the background track you would otherwise license badly. Structure and style tags give you more control than the one-box prompt suggests.",
      "good": [
        "Vocals and instrumentation together",
        "Style and lyric controls"
      ],
      "watch": "Downloads and commercial rights depend on the plan.",
      "newRank": -1
    },
    {
      "id": "udio",
      "n": "Udio",
      "ab": "UD",
      "c": "audio",
      "t": "Music generation with more room to steer the arrangement.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "music, editing",
      "url": "https://www.udio.com",
      "note": "Udio sounds a little more produced than its rivals, and section editing lets you fix the chorus without regenerating the whole track. Worth an A/B against Suno for brand work.",
      "good": [
        "Section-level regeneration",
        "Clean mixes"
      ],
      "watch": "The free tier is for listening and testing, not releases.",
      "newRank": -1
    },
    {
      "id": "murf",
      "n": "Murf",
      "ab": "MU",
      "c": "audio",
      "t": "Voiceover for decks, courses and ads, built for teams.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "voiceover, e-learning",
      "url": "https://murf.ai",
      "note": "Less experimental than the music tools and better for a 40-slide course. The editor lets you pace pauses and emphasis, and the library covers the corporate voices you actually need.",
      "good": [
        "Fine control over pacing and emphasis",
        "Team seats and shared projects"
      ],
      "watch": "The best voices sit behind higher tiers.",
      "newRank": -1
    },
    {
      "id": "whisper",
      "n": "Whisper",
      "ab": "WH",
      "c": "audio",
      "t": "Open-source speech recognition you can run yourself.",
      "p": "oss",
      "pl": [
        "desktop",
        "api"
      ],
      "tags": "transcription, open source",
      "url": "https://github.com/openai/whisper",
      "note": "Whisper is the reason a lot of meeting tools exist. If you need transcripts and cannot send audio to a vendor, run it locally. Accuracy is good; timestamps and speaker labels need extra work.",
      "good": [
        "Runs offline on your own machine",
        "Broad language coverage"
      ],
      "watch": "No speaker labels out of the box. Plan for diarisation.",
      "newRank": -1
    },
    {
      "id": "notion",
      "n": "Notion",
      "ab": "NO",
      "c": "work",
      "t": "Docs, databases and project pages, now with AI in the same workspace.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop",
        "mobile",
        "api"
      ],
      "tags": "docs, wiki",
      "url": "https://www.notion.com",
      "note": "Notion AI is most useful when it can see the page, the database and the meeting note at once. The reason it stays is structural: the same place holds the plan and the work.",
      "good": [
        "One workspace for docs and databases",
        "AI search across your pages"
      ],
      "watch": "AI is an add-on cost. Check seats before you roll it out.",
      "newRank": -1
    },
    {
      "id": "granola",
      "n": "Granola",
      "ab": "GR",
      "c": "work",
      "t": "Meeting notes that merge the transcript with what you actually typed.",
      "p": "paid",
      "pl": [
        "desktop"
      ],
      "tags": "meetings, notes",
      "url": "https://www.granola.ai",
      "pick": 1,
      "pickNote": "Notes that read like notes, not a transcript.",
      "note": "Granola listens, but it does not take over. You type your own notes and it fills in the detail, names and numbers from the transcript. The result reads like you were paying attention.",
      "good": [
        "Merges your notes with the transcript",
        "Local-first and fast"
      ],
      "watch": "It is a paid tool. Try a week of real meetings first.",
      "newRank": -1
    },
    {
      "id": "otter",
      "n": "Otter.ai",
      "ab": "OT",
      "c": "work",
      "t": "Transcription and meeting notes across Zoom, Meet and Teams.",
      "p": "freemium",
      "pl": [
        "web",
        "mobile"
      ],
      "tags": "meetings, transcription",
      "url": "https://otter.ai",
      "note": "The most straightforward transcription workflow: join the call, get a transcript, get a summary with action items. Useful when the meeting matters more than the note-taking style.",
      "good": [
        "Automatic join and record",
        "Speaker labels and highlights"
      ],
      "watch": "Free minutes run out quickly. Check the monthly cap.",
      "newRank": -1
    },
    {
      "id": "raycast",
      "n": "Raycast",
      "ab": "RY",
      "c": "work",
      "t": "A launcher that became the fastest way to run small AI jobs.",
      "p": "freemium",
      "pl": [
        "desktop"
      ],
      "tags": "launcher, shortcuts",
      "url": "https://www.raycast.com",
      "note": "Quick AI actions without leaving the keyboard: rewrite the selected text, summarise the page, ask a question. It is the least ceremonial AI tool on this list.",
      "good": [
        "Keyboard-first everything",
        "AI commands on selected text"
      ],
      "watch": "The best extensions are platform-specific. Check yours.",
      "newRank": -1
    },
    {
      "id": "linear",
      "n": "Linear",
      "ab": "LI",
      "c": "work",
      "t": "Issue tracking with an opinion, plus AI that drafts the boring parts.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop",
        "mobile",
        "api"
      ],
      "tags": "issues, product",
      "url": "https://linear.app",
      "note": "Linear is fast, which sounds trivial until you use a slow tracker. The AI writes issue descriptions from a sentence and summarises a project, but the real win is that the team actually updates it.",
      "good": [
        "Fast keyboard-driven UI",
        "Clean cycles and roadmap views"
      ],
      "watch": "Opinionated workflow. Read the method before you migrate.",
      "newRank": -1
    },
    {
      "id": "zapier",
      "n": "Zapier",
      "ab": "ZP",
      "c": "auto",
      "t": "Connect the apps you already pay for, with AI steps in between.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "integrations, workflows",
      "url": "https://zapier.com",
      "note": "The breadth is the product: thousands of apps, a builder a non-engineer can finish, and AI steps that classify or draft inside the flow. Start here when the integration is boring.",
      "good": [
        "Huge app directory",
        "AI steps inside Zaps"
      ],
      "watch": "Task pricing adds up on high-volume loops.",
      "newRank": -1
    },
    {
      "id": "make",
      "n": "Make",
      "ab": "MK",
      "c": "auto",
      "t": "A visual automation canvas for flows that branch.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "automation, visual",
      "url": "https://www.make.com",
      "note": "Make shows the whole scenario at once, which is better than a list when the logic has five branches. More setup than Zapier, more control per dollar.",
      "good": [
        "Visual branching and iterators",
        "Cheaper at volume"
      ],
      "watch": "The canvas can become a maze. Name every module.",
      "newRank": -1
    },
    {
      "id": "n8n",
      "n": "n8n",
      "ab": "N8",
      "c": "auto",
      "t": "Open-source automation you can self-host and put code inside.",
      "p": "oss",
      "pl": [
        "web",
        "desktop",
        "api"
      ],
      "tags": "open source, self-host",
      "url": "https://n8n.io",
      "note": "The escape hatch from per-task pricing. Run it on your own server, keep credentials in your infrastructure, and drop into JavaScript when a node is not enough.",
      "good": [
        "Self-host with no task fees",
        "Code nodes in JavaScript or Python"
      ],
      "watch": "You own upgrades, backups and uptime. Budget for that.",
      "newRank": -1
    },
    {
      "id": "lindy",
      "n": "Lindy",
      "ab": "LD",
      "c": "auto",
      "t": "Email and ops agents that run a sequence without a human in the loop.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "agents, email",
      "url": "https://www.lindy.ai",
      "note": "Lindy is built for the work that arrives in an inbox: qualify a lead, draft a reply, book the call. Agents are assembled from triggers and actions, closer to a VA than a workflow tool.",
      "good": [
        "Email-first triggers and drafting",
        "Templates for sales and support"
      ],
      "watch": "Autonomy needs guardrails. Start with approval on every send.",
      "newRank": -1
    },
    {
      "id": "gumloop",
      "n": "Gumloop",
      "ab": "GL",
      "c": "auto",
      "t": "No-code AI workflows that combine models, files and the web.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "workflows, scraping",
      "url": "https://www.gumloop.com",
      "note": "The missing middle between a chat window and a script: scrape a page, run three models, write to a sheet, repeat. Built for analysts who do not want to maintain infrastructure.",
      "good": [
        "Model-agnostic steps",
        "Scraping and file inputs"
      ],
      "watch": "Debugging a long flow is still a skill. Keep steps small.",
      "newRank": -1
    },
    {
      "id": "julius",
      "n": "Julius AI",
      "ab": "JU",
      "c": "data",
      "t": "Chat with a spreadsheet or a dataset, and get the chart back.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "spreadsheet, charts",
      "url": "https://julius.ai",
      "note": "Upload a CSV, ask a question, get Python behind the answer and a chart you can export. It is the quickest way to answer a data question without opening a notebook.",
      "good": [
        "Python analysis in the chat",
        "Charts you can export"
      ],
      "watch": "Check the generated code on anything that matters.",
      "newRank": -1
    },
    {
      "id": "hex",
      "n": "Hex",
      "ab": "HX",
      "c": "data",
      "t": "A notebook for data teams, with an assistant that knows the schema.",
      "p": "freemium",
      "pl": [
        "web",
        "api"
      ],
      "tags": "notebook, sql",
      "url": "https://hex.tech",
      "note": "Hex keeps SQL, Python and charts in one shareable canvas. The AI writes queries against your actual warehouse, which is more useful than a generic chat window.",
      "good": [
        "SQL and Python in one notebook",
        "Schema-aware AI"
      ],
      "watch": "Setup wants a warehouse. Not a weekend tool.",
      "newRank": -1
    },
    {
      "id": "deepnote",
      "n": "Deepnote",
      "ab": "DN",
      "c": "data",
      "t": "Collaborative notebooks that run in the browser and publish as apps.",
      "p": "freemium",
      "pl": [
        "web"
      ],
      "tags": "notebooks, collaboration",
      "url": "https://deepnote.com",
      "note": "The collaboration is the difference: comments, versions, and a shared environment that does not break when a teammate opens it. Good for a small analytics team without platform support.",
      "good": [
        "Real-time notebook collaboration",
        "One-click publish as an app"
      ],
      "watch": "Very large datasets need a proper compute plan.",
      "newRank": -1
    },
    {
      "id": "thoughtspot",
      "n": "ThoughtSpot",
      "ab": "TS",
      "c": "data",
      "t": "Natural-language search over a governed data model.",
      "p": "paid",
      "pl": [
        "web",
        "api"
      ],
      "tags": "analytics, search",
      "url": "https://www.thoughtspot.com",
      "note": "This is the enterprise answer to ask-your-data: search in plain language, get a chart, drill in, and keep permissions intact. The value depends on the data model underneath.",
      "good": [
        "Search-first analytics",
        "Row-level permissions"
      ],
      "watch": "It is priced for companies. The model needs an owner.",
      "newRank": -1
    },
    {
      "id": "quadratic",
      "n": "Quadratic",
      "ab": "QT",
      "c": "data",
      "t": "A spreadsheet that speaks Python and SQL.",
      "p": "freemium",
      "pl": [
        "web",
        "desktop"
      ],
      "tags": "spreadsheet, python",
      "url": "https://www.quadratichq.com",
      "added": "Oct 16",
      "note": "The familiar grid, with formulas that call Python and SQL when a spreadsheet formula is the wrong tool. Good for analysts who live in cells but need a dataframe.",
      "good": [
        "Python and SQL in cells",
        "Real spreadsheet shortcuts"
      ],
      "watch": "It is not Excel. Check the functions your team depends on.",
      "newRank": 1
    }
  ]
};
