// ⌘K on a Mac, Ctrl+K everywhere else — the key cap has to say which.
const isMac =
  typeof navigator !== 'undefined' && /Mac|iPhone|iPad|iPod/.test(navigator.userAgent ?? '');

const metaKeyLabel = isMac ? '⌘' : 'Ctrl';
const altKeyLabel = isMac ? '⌥' : 'Alt';

export { isMac, metaKeyLabel, altKeyLabel };
