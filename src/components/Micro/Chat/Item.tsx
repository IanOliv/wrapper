import { useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { PaperPlaneTilt } from '@phosphor-icons/react';

import { ChatSurface, Composer, Message, MessageList } from './styled';
import type { ChatMessage } from './types';

const seed: ChatMessage[] = [
  { id: 1, own: false, text: 'Hello, how can I help you?' },
  { id: 2, own: true, text: 'Checking whether the boiler loop is still reporting.' },
  { id: 3, own: false, text: 'Header pressure has been out of range for about nine seconds.' },
];

function Item() {
  const [conversation, setConversation] = useState<ChatMessage[]>(seed);
  const [draft, setDraft] = useState('');
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [conversation]);

  function send(event: React.FormEvent) {
    event.preventDefault();

    const text = draft.trim();
    if (!text) return;

    setConversation((current) => [...current, { id: Date.now(), own: true, text }]);
    setDraft('');
  }

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 }}>
      <Typography variant="h1">Conversation</Typography>
      <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5, mb: 3 }}>
        A prototype, but a destination people expect to find.
      </Typography>

      <ChatSurface>
        <MessageList>
          {conversation.map((message) => (
            <Message key={message.id} own={message.own}>
              {message.text}
            </Message>
          ))}
          <div ref={endRef} />
        </MessageList>

        <Composer component="form" onSubmit={send}>
          <TextField
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Write a message…"
            size="small"
            fullWidth
            multiline
            maxRows={4}
            inputProps={{ 'aria-label': 'Message' }}
          />
          <IconButton type="submit" aria-label="Send" disabled={!draft.trim()}>
            <PaperPlaneTilt size={18} weight="fill" />
          </IconButton>
        </Composer>
      </ChatSurface>
    </Box>
  );
}

export default Item;
