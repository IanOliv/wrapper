import {
  CardFrontDescription,
  CardFrontImage,
  CardFrontSection,
  CardFrontSubTitle,
  DeckCardBack,
  DeckCardFront,
  DeckCardInner,
  DeckCardProps,
  FrontImage,
} from './styled';

interface CardDetails {
  cardName: string;
  cardDescription: string;
  cardImage: string;
  cardAttack1: string;
  cardAttack2: string;
}

interface CardProps extends DeckCardProps {
  onClick: () => void;
  cardDetails: CardDetails;
}

function Card(props: CardProps) {
  const { isSelected } = props;
  const className = isSelected ? 'selection' : '';
  const { cardName, cardImage, cardDescription } = props.cardDetails;

  return (
    <DeckCardInner className={className} {...props}>
      <DeckCardFront className={className} {...props}>
        <CardFrontSection>
          <CardFrontSubTitle>{cardName}</CardFrontSubTitle>
        </CardFrontSection>
        <CardFrontImage>
          <FrontImage src={cardImage} />
        </CardFrontImage>
        <CardFrontSection>
          <CardFrontDescription>{cardDescription}</CardFrontDescription>
        </CardFrontSection>

        <CardFrontSection>
          <CardFrontSubTitle>hello</CardFrontSubTitle>
        </CardFrontSection>
        <CardFrontSection>
          <CardFrontSubTitle>hello</CardFrontSubTitle>
        </CardFrontSection>
      </DeckCardFront>
      <DeckCardBack className={className} {...props} />
    </DeckCardInner>
  );
}

export default Card;
