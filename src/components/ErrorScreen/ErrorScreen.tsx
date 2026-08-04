import { useState } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';

import { Check, Copy } from '@phosphor-icons/react';

import { Mono } from '@/components/styled';

import type { ErrorScreenProps } from './types';

// Phosphor glyph in a semantic color, a 22px/500 headline, a 14px body line,
// actions as accent-outline buttons, and a mono technical line you can copy.
function ErrorScreen({
  icon: Icon,
  severity = 'error',
  title,
  body,
  code,
  actions,
  children,
}: ErrorScreenProps) {
  const [copied, setCopied] = useState(false);

  const technicalLine = code ? `err · ${code} · ${new Date().toISOString()}` : null;

  async function copy() {
    if (!technicalLine) return;

    try {
      await navigator.clipboard.writeText(technicalLine);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Box
      sx={{
        maxWidth: 520,
        mx: 'auto',
        py: { xs: 6, md: 10 },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 2,
      }}
    >
      <Box sx={{ color: `${severity}.main`, display: 'flex' }}>
        <Icon size={32} weight="regular" />
      </Box>

      <Typography sx={{ fontSize: 22, fontWeight: 500, lineHeight: 1.25 }}>{title}</Typography>

      <Typography sx={{ fontSize: 14, color: 'text.secondary', mt: -1 }}>{body}</Typography>

      {children}

      {actions && <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mt: 1 }}>{actions}</Box>}

      {technicalLine && (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mt: 2,
            px: 1.5,
            py: 1,
            borderRadius: 1,
            border: (theme) => `1px solid ${theme.shell.border.subtle}`,
            maxWidth: '100%',
          }}
        >
          <Mono
            style={{ color: 'inherit', opacity: 0.7, overflow: 'hidden', textOverflow: 'ellipsis' }}
          >
            {technicalLine}
          </Mono>
          <Tooltip title={copied ? 'Copied' : 'Copy'} arrow>
            <Box
              component="button"
              onClick={copy}
              aria-label="Copy technical details"
              sx={{
                display: 'flex',
                border: 0,
                background: 'none',
                color: copied ? 'success.main' : 'text.secondary',
                cursor: 'pointer',
                p: 0.5,
              }}
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
            </Box>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}

export default ErrorScreen;
