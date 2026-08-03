interface CardData {
  id: string;
  category: string;
  title: string;
  readingTime: string;
  /** the module's own hue — a module may theme inside itself */
  accent: string;
}

type CardProps = {
  card: CardData;
};

type DetailProps = {
  card: CardData;
  onClose: () => void;
};

export type { CardData, CardProps, DetailProps };
