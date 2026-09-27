import type { Icon } from '@phosphor-icons/react';

type PaletteGroup = 'Recent' | 'Modules' | 'Labs' | 'Account' | 'Actions';

type PaletteItem = {
  id: string;
  label: string;
  description?: string;
  icon: Icon;
  group: PaletteGroup;
  /** matched but never displayed, so "prefs" finds Settings without a second row */
  aliases?: string[];
  /** shown as key caps on the right */
  keys?: string[];
  run: () => void;
};

/** A scored item plus the label range to tint, when the label itself matched. */
type ScoredItem = {
  item: PaletteItem;
  score: number;
  range?: [number, number];
};

type PaletteSection = {
  group: PaletteGroup;
  items: ScoredItem[];
};

type RowProps = {
  scored: ScoredItem;
  selected: boolean;
  onSelect: () => void;
  onHover: () => void;
};

export type { PaletteGroup, PaletteItem, ScoredItem, PaletteSection, RowProps };
