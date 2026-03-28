const translations = {
  de: {
    pageTitle: 'Jitsi-Einladung erstellen',
    pageSubtitle: 'Alle Angaben werden direkt darunter als Einladungsvorschau dargestellt oder als Einladungstext kopiert.',
    languageLabel: 'Sprache festlegen:',
    meetingTitleLabel: 'Titel des Meetings:',
    descriptionLabel: 'Beschreibung:',
    startDateLabel: 'Startdatum:',
    startTimeLabel: 'Startuhrzeit:',
    durationLabel: 'Dauer in Minuten:',
    serverLabel: 'Auswahl des Servers:',
    customServerLabel: 'Anderen Server angeben:',
    roomLabel: 'Raum angeben:',
    agendaLabel: 'Agenda angeben:',
    submitButton: 'Per E-Mail senden',
    copyButton: 'Einladung kopieren',
    copiedButton: 'Einladung kopiert',
    submitHint: 'Der erste Button erstellt eine E-Mail, der zweite kopiert den Einladungstext.',
    outputHeading: 'Einladungstext',
    previewHeading: 'Vorschau',
    previewDescriptionLabel: 'Beschreibung:',
    previewStartDateLabel: 'Startdatum:',
    previewStartTimeLabel: 'Startuhrzeit:',
    previewDurationLabel: 'Dauer:',
    previewServerLabel: 'Server:',
    previewRoomLabel: 'Raum:',
    previewAgendaLabel: 'Agenda:',
    previewJoinLabel: 'Raum betreten:',
    placeholderTitle: 'Titel des Meetings',
    placeholderDescription: 'Keine Beschreibung angegeben',
    placeholderStartDate: 'Kein Startdatum angegeben',
    placeholderStartTime: 'Keine Startuhrzeit angegeben',
    placeholderDuration: 'Keine Dauer angegeben',
    placeholderServer: 'Kein Server ausgewählt',
    placeholderRoom: 'Kein Raum angegeben',
    placeholderAgenda: 'Keine Agenda angegeben',
    placeholderJoin: 'URL wird automatisch erzeugt',
    durationUnit: 'Minuten',
    customServerOption: 'Anderer Server',
    mailBodyIntro: 'Hallo,',
    mailBodyText: 'hier sind die Daten fuer das Meeting:',
    mailBodyJoin: 'Raum betreten'
  },
  en: {
    pageTitle: 'Create Jitsi Invitation',
    pageSubtitle: 'All values are shown below as a preview and as a copyable invitation text.',
    languageLabel: 'Choose language:',
    meetingTitleLabel: 'Meeting title:',
    descriptionLabel: 'Description:',
    startDateLabel: 'Start date:',
    startTimeLabel: 'Start time:',
    durationLabel: 'Duration in minutes:',
    serverLabel: 'Select server:',
    customServerLabel: 'Enter custom server:',
    roomLabel: 'Enter room:',
    agendaLabel: 'Agenda:',
    submitButton: 'Send by email',
    copyButton: 'Copy invitation',
    copiedButton: 'Invitation copied',
    submitHint: 'The first button opens an email, the second copies the invitation text.',
    outputHeading: 'Invitation text',
    previewHeading: 'Preview',
    previewDescriptionLabel: 'Description:',
    previewStartDateLabel: 'Start date:',
    previewStartTimeLabel: 'Start time:',
    previewDurationLabel: 'Duration:',
    previewServerLabel: 'Server:',
    previewRoomLabel: 'Room:',
    previewAgendaLabel: 'Agenda:',
    previewJoinLabel: 'Join room:',
    placeholderTitle: 'Meeting title',
    placeholderDescription: 'No description entered',
    placeholderStartDate: 'No start date entered',
    placeholderStartTime: 'No start time entered',
    placeholderDuration: 'No duration entered',
    placeholderServer: 'No server selected',
    placeholderRoom: 'No room entered',
    placeholderAgenda: 'No agenda entered',
    placeholderJoin: 'URL will be generated automatically',
    durationUnit: 'minutes',
    customServerOption: 'Custom server',
    mailBodyIntro: 'Hello,',
    mailBodyText: 'here are the meeting details:',
    mailBodyJoin: 'Join room'
  }
};

const form = document.getElementById('inviteForm');
const languageSelect = document.getElementById('language');
const serverSelect = document.getElementById('serverSelect');
const customServerField = document.getElementById('customServerField');
const customServerInput = document.getElementById('customServer');
const durationInput = document.getElementById('durationMinutes');
const copyButton = document.getElementById('copyButton');
const submitButton = document.getElementById('submitButton');
const invitationOutput = document.getElementById('invitationOutput');

const fields = {
  meetingTitle: document.getElementById('meetingTitle'),
  description: document.getElementById('description'),
  startDate: document.getElementById('startDate'),
  startTime: document.getElementById('startTime'),
  durationMinutes: durationInput,
  roomName: document.getElementById('roomName'),
  agenda: document.getElementById('agenda')
};

const preview = {
  title: document.getElementById('previewTitle'),
  description: document.getElementById('previewDescription'),
  startDate: document.getElementById('previewStartDate'),
  startTime: document.getElementById('previewStartTime'),
  duration: document.getElementById('previewDuration'),
  room: document.getElementById('previewRoom'),
  agenda: document.getElementById('previewAgenda'),
  joinUrl: document.getElementById('previewJoinUrl')
};

function localizePage(language) {
  const copy = translations[language];
  document.documentElement.lang = language;
  document.title = copy.pageTitle;

  Object.entries(copy).forEach(([key, value]) => {
    const target = document.getElementById(key);
    if (target) {
      target.textContent = value;
    }
  });

  const customOption = serverSelect.querySelector('option[value="custom"]');
  if (customOption) {
    customOption.textContent = copy.customServerOption;
  }

  if (!copyButton.dataset.copied) {
    copyButton.textContent = copy.copyButton;
  }

  updatePreview();
}

function formatDate(value, language) {
  if (!value) {
    return '';
  }

  const parsed = new Date(value + 'T00:00');
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-GB', {
    dateStyle: 'full'
  }).format(parsed);
}

function formatTime(value, language) {
  if (!value) {
    return '';
  }

  const [hours, minutes] = value.split(':');
  if (hours === undefined || minutes === undefined) {
    return value;
  }

  const parsed = new Date(Date.UTC(1970, 0, 1, Number(hours), Number(minutes)));
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(language === 'de' ? 'de-DE' : 'en-GB', {
    timeStyle: 'short',
    timeZone: 'UTC'
  }).format(parsed);
}

function selectedServer() {
  if (serverSelect.value === 'custom') {
    return customServerInput.value.trim();
  }

  return serverSelect.value.trim();
}

function buildJoinUrl(server, room) {
  const trimmedServer = (server || '').trim();
  const trimmedRoom = (room || '').trim().replace(/^\/+/, '');

  if (!trimmedServer && !trimmedRoom) {
    return '';
  }

  if (!trimmedServer) {
    return trimmedRoom;
  }

  if (!trimmedRoom) {
    return trimmedServer.replace(/\/+$/, '');
  }

  return trimmedServer.replace(/\/+$/, '') + '/' + trimmedRoom;
}

function setPreviewText(element, value, fallback, asLink = false) {
  if (value) {
    if (asLink) {
      element.innerHTML = '';
      const link = document.createElement('a');
      link.href = value;
      link.textContent = value;
      link.className = 'preview-link';
      link.target = '_blank';
      link.rel = 'noreferrer noopener';
      element.appendChild(link);
    } else {
      element.textContent = value;
    }
    element.classList.remove('placeholder');
    return;
  }

  element.textContent = fallback;
  element.classList.add('placeholder');
}

function updateCustomServerVisibility() {
  const useCustomServer = serverSelect.value === 'custom';
  customServerField.classList.toggle('hidden', !useCustomServer);

  if (!useCustomServer) {
    customServerInput.value = '';
  }
}

function buildInvitationText(language) {
  const copy = translations[language];
  const server = selectedServer();
  const room = fields.roomName.value.trim();
  const joinUrl = buildJoinUrl(server, room);

  const lines = [
    copy.mailBodyIntro,
    '',
    copy.mailBodyText,
    '',
    copy.meetingTitleLabel + ' ' + (fields.meetingTitle.value.trim() || copy.placeholderTitle),
    copy.descriptionLabel + ' ' + (fields.description.value.trim() || copy.placeholderDescription),
    copy.startDateLabel + ' ' + (formatDate(fields.startDate.value, language) || copy.placeholderStartDate),
    copy.startTimeLabel + ' ' + (formatTime(fields.startTime.value, language) || copy.placeholderStartTime),
    copy.durationLabel + ' ' + (fields.durationMinutes.value ? fields.durationMinutes.value + ' ' + copy.durationUnit : copy.placeholderDuration),
    copy.serverLabel + ' ' + (server || copy.placeholderServer),
    copy.roomLabel + ' ' + (room || copy.placeholderRoom),
    copy.agendaLabel + ' ' + (fields.agenda.value.trim() || copy.placeholderAgenda),
    copy.mailBodyJoin + ': ' + (joinUrl || copy.placeholderJoin)
  ];

  return lines.join('\n');
}

function updatePreview() {
  const language = languageSelect.value;
  const copy = translations[language];
  const server = selectedServer();
  const room = fields.roomName.value.trim();
  const joinUrl = buildJoinUrl(server, room);

  setPreviewText(preview.title, fields.meetingTitle.value.trim(), copy.placeholderTitle);
  setPreviewText(preview.description, fields.description.value.trim(), copy.placeholderDescription);
  setPreviewText(preview.startDate, formatDate(fields.startDate.value, language), copy.placeholderStartDate);
  setPreviewText(preview.startTime, formatTime(fields.startTime.value, language), copy.placeholderStartTime);
  setPreviewText(preview.duration, fields.durationMinutes.value ? fields.durationMinutes.value + ' ' + copy.durationUnit : '', copy.placeholderDuration);
  setPreviewText(preview.room, room, copy.placeholderRoom);
  setPreviewText(preview.agenda, fields.agenda.value.trim(), copy.placeholderAgenda);
  setPreviewText(preview.joinUrl, joinUrl, copy.placeholderJoin, true);

  invitationOutput.textContent = buildInvitationText(language);
}

async function copyInvitation() {
  const language = languageSelect.value;
  const copy = translations[language];
  const text = buildInvitationText(language);

  try {
    await navigator.clipboard.writeText(text);
    copyButton.dataset.copied = 'true';
    copyButton.textContent = copy.copiedButton;
    copyButton.classList.add('is-success');
    window.setTimeout(() => {
      copyButton.dataset.copied = '';
      copyButton.textContent = translations[languageSelect.value].copyButton;
      copyButton.classList.remove('is-success');
    }, 1800);
  } catch {
    invitationOutput.textContent = text;
  }
}

languageSelect.addEventListener('change', () => {
  localizePage(languageSelect.value);
});

serverSelect.addEventListener('change', () => {
  updateCustomServerVisibility();
  updatePreview();
});

copyButton.addEventListener('click', copyInvitation);
customServerInput.addEventListener('input', updatePreview);

[fields.startDate, fields.startTime, fields.durationMinutes].forEach((field) => {
  field.addEventListener('input', updatePreview);
  field.addEventListener('change', updatePreview);
});

[fields.meetingTitle, fields.description, fields.roomName, fields.agenda].forEach((field) => {
  field.addEventListener('input', updatePreview);
  field.addEventListener('change', updatePreview);
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const language = languageSelect.value;
  const subject = fields.meetingTitle.value.trim() || translations[language].pageTitle;
  const body = buildInvitationText(language);
  window.location.href = 'mailto:?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
});

updateCustomServerVisibility();
localizePage(languageSelect.value);
