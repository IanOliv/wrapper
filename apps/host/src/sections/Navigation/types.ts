import type { Route } from '@/routes/utils';

type ActiveRuleProps = {
  orientation: 'vertical' | 'horizontal';
  /** items sharing a layoutId make the rule travel between them */
  layoutId: string;
};

type RailItemProps = {
  route: Route;
  expanded: boolean;
  active: boolean;
};

type MoreSheetProps = {
  open: boolean;
  onClose: () => void;
};

export type { ActiveRuleProps, RailItemProps, MoreSheetProps };
