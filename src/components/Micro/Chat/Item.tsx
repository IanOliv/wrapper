import { useRef, useState } from 'react';

import { Area, DeckContainer } from './styled';
import { Message, MessageInput, MessageList } from './styled';
import { InputTextarea, LabelTextarea } from './styled';
import { InputButton } from './styled';

function Item() {
  const messages = [
    { type: 'income', text: 'Hello, how can I help you?' },
    { type: 'outcome', text: 'Hello, how can I help you?' },
    { type: 'income', text: 'Hello, how can I help you?' },
    { type: 'outcome', text: 'Hello, how can I help you?' },
  ];

  const [conversation, setConversation] = useState(messages);
  const textRef = useRef<HTMLTextAreaElement>(null);

  const onSend = () => {
    console.log(textRef.current?.value);
    if (textRef.current?.value) {
      setConversation([...conversation, { type: 'outcome', text: textRef.current.value }]);
      textRef.current.value = '';
    }
  };

  return (
    <DeckContainer>
      <Area>
        <MessageList>
          {conversation.map((message, index) => (
            <Message key={index} className={message.type}>
              {message.text}
            </Message>
          ))}
        </MessageList>
        <MessageInput>
          <LabelTextarea htmlFor="message">Message:</LabelTextarea>
          <br />
          <InputTextarea id="message" name="message" ref={textRef} />
          <InputButton type="submit" onClick={() => onSend()}>
            Send
          </InputButton>
        </MessageInput>
      </Area>
    </DeckContainer>
  );
}

export default Item;
