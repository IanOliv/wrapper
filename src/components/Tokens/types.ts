import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  children: ReactNode;
};

type SwatchProps = {
  label: string;
  value: string;
};

export type { SectionProps, SwatchProps };
