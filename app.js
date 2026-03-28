const translations = {
  de: {
    pageTitle: 'Jitsi-Einladung erstellen',
    pageSubtitle: 'Alle Angaben werden direkt darunter als Einladungsvorschau dargestellt und können als Chat-Nachricht gesendet oder kopiert werden.',
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
    submitButton: 'In Chat senden',
    copyButton: 'Nachricht kopieren',
    copiedButton: 'Nachricht kopiert',
    submitHint: 'Der erste Button erzeugt einen Chat-Entwurf, der zweite kopiert denselben Text.',
    outputHeading: 'Nachrichtentext',
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
    msgIconTitle: '🎥',
    msgIconDescription: '📝',
    msgIconDate: '📅',
    msgIconTime: '⏰',
    msgIconDuration: '⏳',
    msgIconRoom: '🚪',
    msgIconAgenda: '📋',
    msgIconJoin: '🔗',
    chatPreparedHint: 'Der Chat-Entwurf wurde vorbereitet.',
    chatFallbackHint: 'webxdc ist hier nicht verfügbar. Der Nachrichtentext wurde stattdessen kopiert.',
    chatErrorHint: 'Die Nachricht konnte nicht an den Chat übergeben werden.'
  },
  en: {
    pageTitle: 'Create Jitsi Invitation',
    pageSubtitle: 'All values are shown below as a preview and can be sent as a chat message or copied.',
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
    submitButton: 'Send to chat',
    copyButton: 'Copy message',
    copiedButton: 'Message copied',
    submitHint: 'The first button prepares a chat draft, the second copies the same text.',
    outputHeading: 'Message text',
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
    msgIconTitle: '🎥',
    msgIconDescription: '📝',
    msgIconDate: '📅',
    msgIconTime: '⏰',
    msgIconDuration: '⏳',
    msgIconRoom: '🚪',
    msgIconAgenda: '📋',
    msgIconJoin: '🔗',
    chatPreparedHint: 'The chat draft was prepared.',
    chatFallbackHint: 'webxdc is not available here. The message text was copied instead.',
    chatErrorHint: 'The message could not be handed over to the chat.'
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
const submitHint = document.getElementById('submitHint');
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

let feedbackTimer = 0;

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

  if (!submitHint.dataset.feedback) {
    submitHint.textContent = copy.submitHint;
    submitHint.classList.remove('is-success', 'is-error');
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

function getPreviewContent(language) {
  const copy = translations[language];
  const server = selectedServer();
  const room = fields.roomName.value.trim();
  const joinUrl = buildJoinUrl(server, room);

  return {
    title: fields.meetingTitle.value.trim() || copy.placeholderTitle,
    description: fields.description.value.trim() || copy.placeholderDescription,
    startDate: formatDate(fields.startDate.value, language) || copy.placeholderStartDate,
    startTime: formatTime(fields.startTime.value, language) || copy.placeholderStartTime,
    duration: fields.durationMinutes.value ? fields.durationMinutes.value + ' ' + copy.durationUnit : copy.placeholderDuration,
    room: room || copy.placeholderRoom,
    agenda: fields.agenda.value.trim() || copy.placeholderAgenda,
    joinUrl: joinUrl || copy.placeholderJoin,
    rawJoinUrl: joinUrl
  };
}

function buildSharedMessage(language) {
  const copy = translations[language];
  const content = getPreviewContent(language);
  const descriptionLabel = copy.previewDescriptionLabel.replace(/:$/, '');
  const startDateLabel = copy.previewStartDateLabel.replace(/:$/, '');
  const startTimeLabel = copy.previewStartTimeLabel.replace(/:$/, '');
  const durationLabel = copy.previewDurationLabel.replace(/:$/, '');
  const roomLabel = copy.previewRoomLabel.replace(/:$/, '');
  const agendaLabel = copy.previewAgendaLabel.replace(/:$/, '');
  const joinLabel = copy.previewJoinLabel.replace(/:$/, '');
  const joinIcon = content.rawJoinUrl ? '[' + copy.msgIconJoin + '](' + content.rawJoinUrl + ')' : copy.msgIconJoin;

  const lines = [
    copy.msgIconTitle + ' ' + content.title,
    '',
    copy.msgIconDescription + ' **' + descriptionLabel + ':** ' + content.description,
    copy.msgIconDate + ' **' + startDateLabel + ':** ' + content.startDate,
    copy.msgIconTime + ' **' + startTimeLabel + ':** ' + content.startTime,
    copy.msgIconDuration + ' **' + durationLabel + ':** ' + content.duration,
    copy.msgIconRoom + ' **' + roomLabel + ':** ' + content.room,
    copy.msgIconAgenda + ' **' + agendaLabel + ':** ' + content.agenda,
    joinIcon + ' **' + joinLabel + ':** ' + content.joinUrl
  ];

  return lines.join('\n');
}

async function getAppIconBlob() {
  const response = await fetch('icon.png', { cache: 'no-store' });
  if (!response.ok) {
    throw new Error('Failed to load icon.png for chat attachment.');
  }
  return response.blob();
}

function showSubmitFeedback(message, state) {
  submitHint.dataset.feedback = 'true';
  submitHint.textContent = message;
  submitHint.classList.toggle('is-success', state === 'success');
  submitHint.classList.toggle('is-error', state === 'error');

  window.clearTimeout(feedbackTimer);
  feedbackTimer = window.setTimeout(() => {
    const copy = translations[languageSelect.value];
    submitHint.dataset.feedback = '';
    submitHint.textContent = copy.submitHint;
    submitHint.classList.remove('is-success', 'is-error');
  }, 2600);
}

function updatePreview() {
  const language = languageSelect.value;
  const copy = translations[language];
  const content = getPreviewContent(language);

  setPreviewText(preview.title, content.title, copy.placeholderTitle);
  setPreviewText(preview.description, content.description, copy.placeholderDescription);
  setPreviewText(preview.startDate, content.startDate, copy.placeholderStartDate);
  setPreviewText(preview.startTime, content.startTime, copy.placeholderStartTime);
  setPreviewText(preview.duration, content.duration, copy.placeholderDuration);
  setPreviewText(preview.room, content.room, copy.placeholderRoom);
  setPreviewText(preview.agenda, content.agenda, copy.placeholderAgenda);
  setPreviewText(preview.joinUrl, content.joinUrl, copy.placeholderJoin, true);

  invitationOutput.textContent = buildSharedMessage(language);
}

async function copyInvitation() {
  const language = languageSelect.value;
  const copy = translations[language];
  const text = buildSharedMessage(language);

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

async function sendMessageToChat() {
  const language = languageSelect.value;
  const copy = translations[language];
  const text = buildSharedMessage(language);

  try {
    if (!window.webxdc || window.webxdc.__isFallback || typeof window.webxdc.sendToChat !== 'function') {
      await navigator.clipboard.writeText(text);
      invitationOutput.textContent = text;
      showSubmitFeedback(copy.chatFallbackHint, 'success');
      return;
    }

    const iconBlob = await getAppIconBlob();

    await window.webxdc.sendToChat({
      text,
      file: {
        name: 'icon.png',
        blob: iconBlob
      }
    });

    showSubmitFeedback(copy.chatPreparedHint, 'success');
  } catch (error) {
    console.error(error);
    invitationOutput.textContent = text;
    showSubmitFeedback(copy.chatErrorHint, 'error');
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
  sendMessageToChat();
});

updateCustomServerVisibility();
localizePage(languageSelect.value);
