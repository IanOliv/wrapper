import type { PaletteGroup, PaletteItem, PaletteSection, ScoredItem } from './types';

// Results are grouped, never paginated — max 5 per group.
const MAX_PER_GROUP = 5;

const GROUP_ORDER: PaletteGroup[] = ['Recent', 'Modules', 'Labs', 'Account', 'Actions'];

/**
 * Rank one item against a query. A label hit carries the range to tint;
 * alias and description hits rank lower and highlight nothing, so "prefs" finds
 * Settings without a second row appearing.
 */
function score(item: PaletteItem, query: string): ScoredItem | null {
  if (!query) return { item, score: 0 };

  const label = item.label.toLowerCase();
  const labelAt = label.indexOf(query);

  if (labelAt >= 0) {
    return { item, score: labelAt === 0 ? 0 : 1, range: [labelAt, labelAt + query.length] };
  }

  if (item.aliases?.some((alias) => alias.toLowerCase().includes(query))) {
    return { item, score: 2 };
  }

  if (item.description?.toLowerCase().includes(query)) {
    return { item, score: 3 };
  }

  return null;
}

/** Group, rank and cap. Empty groups are dropped rather than shown empty. */
function groupItems(items: PaletteItem[], rawQuery: string): PaletteSection[] {
  const query = rawQuery.trim().toLowerCase();

  const scored = items
    .map((item) => score(item, query))
    .filter((entry): entry is ScoredItem => entry !== null);

  return GROUP_ORDER.map((group) => ({
    group,
    items: scored
      .filter((entry) => entry.item.group === group)
      .sort((a, b) => a.score - b.score)
      .slice(0, MAX_PER_GROUP),
  })).filter((section) => section.items.length > 0);
}

/** Arrow keys walk across groups, so the sections flatten into one list. */
function flatten(sections: PaletteSection[]): ScoredItem[] {
  return sections.flatMap((section) => section.items);
}

/** ⌘K opens anywhere except inside a text field. */
function isTypingTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;

  const tag = target.tagName.toLowerCase();

  return tag === 'input' || tag === 'textarea' || tag === 'select' || target.isContentEditable;
}

export { groupItems, flatten, isTypingTarget, MAX_PER_GROUP };
