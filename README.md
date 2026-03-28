# delta-jitsi-invite

Webxdc-App zum Erstellen einer Jitsi-Einladung direkt in einem Chat.

Die App erzeugt aus der Vorschau einen Nachrichtentext und uebergibt ihn per webxdc an den Chat. In einer echten webxdc-Umgebung oeffnet der Hauptbutton einen Chat-Entwurf. Im normalen Browser-Preview steht diese API nicht zur Verfuegung; dort wird derselbe Text stattdessen in die Zwischenablage kopiert.

Lokale Vorschau in VS Code:

1. Task Run Task ausfuehren.
2. Die Task Start Jitsi Invite Preview waehlen.
3. Danach die weitergeleitete Port-5000-URL im Browser oeffnen.

Alternativ im Terminal:

python3 -m http.server 5000

webxdc-Datei bauen:

1. Im Projektordner die Build-Task ausfuehren oder den folgenden Befehl verwenden.
2. Die erzeugte Datei delta-jitsi-invite.xdc in Delta Chat oder einem anderen webxdc-faehigen Messenger teilen.

zip -9 -r delta-jitsi-invite.xdc . -x ".git/*" ".vscode/*" "webxdc.js" "*.xdc"

Hinweis:

Die Datei webxdc.js im Repository ist nur ein lokaler Preview-Stub und darf nicht in die finale .xdc-Datei gepackt werden.