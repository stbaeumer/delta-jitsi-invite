# Jitsi Invite for webxdc

## Title
Jitsi Invite for webxdc

## Goal
Create and share meeting invites in Delta Chat (or another webxdc host) from a structured form.

The app lets users:
1. Fill in meeting details (title, description, date, time, duration, room, agenda).
2. Preview the invitation in real time.
3. Send the preview as a chat draft via `webxdc.sendToChat()`.

## Images
Screenshots will be added soon.

Planned image slots:
1. Form view
2. Preview card
3. Chat draft output in Delta Chat

## Usage

### Run locally (browser preview)
1. Start the VS Code task `Start Jitsi Invite Preview`.
2. Open the forwarded port URL (port `5000`).

Alternative terminal command:

```bash
python3 -m http.server 5000
```

Note:
In normal browser preview, the webxdc API is not available. The app falls back to copying the message text.

### Build the `.xdc` package
Use the VS Code task `Build webxdc Package` or run:

```bash
zip -9 -r delta-jitsi-invite.xdc . -x ".git/*" ".github/*" ".vscode/*" "webxdc.js" "*.xdc"
```

Then share `delta-jitsi-invite.xdc` in your chat and start the app.

### Release automation
On every push, GitHub Actions:
1. Creates the next version tag (`0.0.1`, `0.0.2`, ...).
2. Builds a fresh `.xdc` artifact from the pushed commit.
3. Publishes a GitHub Release and attaches `delta-jitsi-invite.xdc`.