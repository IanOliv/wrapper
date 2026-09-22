import { ChatTeardropDots, Circle } from '@phosphor-icons/react';
import type { Icon } from '@phosphor-icons/react';

// Icons are React components, not JSON-serializable — a manifest entry names
// one by key against this small whitelist. Add an entry here for any new icon
// a remote's `nav.icon` wants to use.
const ICONS: Record<string, Icon> = {
  ChatTeardropDots,
};

function resolveIcon(name?: string): Icon {
  return (name && ICONS[name]) || Circle;
}

export { resolveIcon };
