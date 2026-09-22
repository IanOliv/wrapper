import { useCallback, useEffect, useRef, useState } from 'react';

import Box from '@mui/material/Box';
import ButtonBase from '@mui/material/ButtonBase';
import Typography from '@mui/material/Typography';

import { Camera, CrosshairSimple, X } from '@phosphor-icons/react';
import { useReducedMotion } from 'framer-motion';

import { Mono } from '@/components/styled';

import Thumb from './Thumb';
import { accent, border, scrim, success, surface, text } from './tokens';
import type { ARfitiActions, Permissions, Piece } from './types';

type ScanFlowProps = {
  piece: Piece;
  flow: 'scan' | 'claim';
  permissions: Permissions;
  actions: ARfitiActions;
};

const FRAME = 132;

/**
 * Scan and claim are two steps of one flow, not two routes. The map stays
 * mounted underneath this layer the whole time; cancelling puts you back
 * exactly where you were, with the same piece still selected.
 */
function ScanFlow({ piece, flow, permissions, actions }: ScanFlowProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const reduced = useReducedMotion();

  const [progress, setProgress] = useState(0);
  const [capture, setCapture] = useState<string | null>(null);

  const { setCamera, cancelFlow, matched, claim } = actions;
  const denied = permissions.camera === 'denied';

  const stop = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const start = useCallback(
    async (live?: { cancelled: boolean }) => {
      // ARfiti used to assume a camera existed. It may not, and permission may be
      // refused — both land on the same enable state rather than a blank frame.
      if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) {
        setCamera('denied');

        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
          audio: false,
        });

        // the permission dialog outlives a StrictMode remount — without this the
        // orphaned stream keeps the camera light on
        if (live?.cancelled) {
          stream.getTracks().forEach((track) => track.stop());

          return;
        }

        streamRef.current = stream;
        setCamera('granted');

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch {
        if (!live?.cancelled) setCamera('denied');
      }
    },
    [setCamera],
  );

  useEffect(() => {
    if (flow !== 'scan') return;

    const live = { cancelled: false };

    start(live);

    return () => {
      live.cancelled = true;
      stop();
    };
  }, [flow, start, stop]);

  // "aligning · 78%" — the alignment settling, not a fake loading bar
  useEffect(() => {
    if (flow !== 'scan' || denied) return;

    if (reduced) {
      setProgress(100);

      return;
    }

    setProgress(0);

    const timer = window.setInterval(() => {
      setProgress((current) => (current >= 100 ? 100 : current + 4));
    }, 90);

    return () => window.clearInterval(timer);
  }, [denied, flow, reduced]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') cancelFlow();
    };

    window.addEventListener('keydown', onKeyDown);

    return () => window.removeEventListener('keydown', onKeyDown);
  }, [cancelFlow]);

  const onCapture = () => {
    const video = videoRef.current;

    if (video && video.videoWidth) {
      const canvas = document.createElement('canvas');

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0);
      setCapture(canvas.toDataURL('image/jpeg', 0.8));
    }

    stop();
    matched();
  };

  const aligned = progress >= 100;

  if (flow === 'claim') {
    return (
      <Layer>
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            p: '20px',
            backgroundColor: surface.ground,
          }}
        >
          <Box sx={{ width: '100%', maxWidth: 300, textAlign: 'center' }}>
            {capture ? (
              <Box
                component="img"
                src={capture}
                alt=""
                sx={{
                  width: '100%',
                  height: 168,
                  objectFit: 'cover',
                  borderRadius: '10px',
                  boxShadow: `0 0 0 2px ${success.main}`,
                }}
              />
            ) : (
              <Thumb piece={piece} height={168} radius={10} ring={success.main} />
            )}

            <Box
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                mt: '14px',
                px: '10px',
                height: 24,
                borderRadius: '999px',
                whiteSpace: 'nowrap',
                fontSize: 11,
                fontWeight: 500,
                color: success.main,
                backgroundColor: surface.ground,
                boxShadow: `inset 0 0 0 1px ${success.border}`,
              }}
            >
              Piece matched
            </Box>

            <Typography sx={{ fontSize: 14, fontWeight: 600, color: text.primary, mt: '10px' }}>
              {piece.title}
            </Typography>
            <Typography sx={{ fontSize: 11, color: text.secondary, mt: '6px', lineHeight: 1.5 }}>
              First claim. It goes to your collection and the pin turns green on the map for
              everyone.
            </Typography>

            <ButtonBase
              onClick={claim}
              sx={{
                width: '100%',
                height: 38,
                mt: '16px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                fontSize: 13,
                fontWeight: 600,
                backgroundColor: accent.main,
                color: accent.on,
                '&:hover': { backgroundColor: accent.light },
                '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
              }}
            >
              Claim piece
            </ButtonBase>

            <ButtonBase
              onClick={cancelFlow}
              sx={{
                width: '100%',
                height: 34,
                mt: '8px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                fontSize: 13,
                color: text.secondary,
                boxShadow: `inset 0 0 0 1px ${border.control}`,
                '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
              }}
            >
              Not now
            </ButtonBase>
          </Box>
        </Box>
      </Layer>
    );
  }

  return (
    <Layer>
      <Box
        component="video"
        ref={videoRef}
        muted
        playsInline
        autoPlay
        sx={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          backgroundColor: surface.ground,
        }}
      />

      {/* the alignment frame is the scrim: one huge spread shadow around it */}
      {!denied && (
        <Box
          aria-hidden
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: FRAME,
            height: FRAME,
            transform: 'translate(-50%, -50%)',
            borderRadius: '10px',
            border: `2px solid ${accent.main}`,
            boxShadow: `0 0 0 999px ${scrim}`,
          }}
        />
      )}

      <Box
        sx={{
          position: 'absolute',
          top: '16px',
          left: 0,
          right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            height: 30,
            px: '12px',
            borderRadius: '999px',
            whiteSpace: 'nowrap',
            fontSize: 12,
            color: text.primary,
            backgroundColor: surface.floating,
            boxShadow: `inset 0 0 0 1px ${border.card}`,
          }}
        >
          <CrosshairSimple size={14} color={accent.main} aria-hidden />
          {denied ? 'Camera is off' : 'Point at the wall'}
        </Box>
      </Box>

      {denied ? (
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            display: 'grid',
            placeItems: 'center',
            p: '20px',
            backgroundColor: 'rgba(15,17,25,.72)',
          }}
        >
          <Box sx={{ textAlign: 'center', maxWidth: 260 }}>
            <Typography sx={{ fontSize: 13, color: text.primary }}>
              ARfiti needs the camera to check you are at the wall.
            </Typography>
            <ButtonBase
              onClick={() => start()}
              sx={{
                mt: '14px',
                height: 34,
                px: '16px',
                gap: '8px',
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                fontSize: 12,
                fontWeight: 600,
                backgroundColor: accent.main,
                color: accent.on,
                '&:hover': { backgroundColor: accent.light },
                '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
              }}
            >
              <Camera size={15} weight="fill" aria-hidden />
              Enable camera
            </ButtonBase>
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: `${FRAME / 2 + 76}px`,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Mono sx={{ fontSize: 11, color: aligned ? success.main : text.secondary }}>
            {aligned ? 'aligned · ready' : `aligning · ${progress}%`}
          </Mono>
        </Box>
      )}

      {/* capture — the one filled accent element while scanning */}
      {!denied && (
        <Box
          sx={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: '18px',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <ButtonBase
            onClick={onCapture}
            disabled={!aligned}
            aria-label="Capture"
            sx={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              display: 'grid',
              placeItems: 'center',
              boxShadow: `inset 0 0 0 2px ${aligned ? accent.main : border.control}`,
              opacity: aligned ? 1 : 0.45,
              transition: (theme) =>
                `opacity ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
              '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
            }}
          >
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: aligned ? accent.main : 'transparent',
              }}
            />
          </ButtonBase>
        </Box>
      )}

      <ButtonBase
        onClick={cancelFlow}
        aria-label="Close scan"
        sx={{
          position: 'absolute',
          left: '16px',
          bottom: '30px',
          width: 30,
          height: 30,
          borderRadius: '8px',
          color: text.primary,
          backgroundColor: surface.floating,
          boxShadow: `inset 0 0 0 1px ${border.card}`,
          '&:focus-visible': { outline: `2px solid ${accent.main}`, outlineOffset: 2 },
        }}
      >
        <X size={15} aria-hidden />
      </ButtonBase>
    </Layer>
  );
}

function Layer({ children }: { children: React.ReactNode }) {
  return (
    <Box
      role="dialog"
      aria-modal="true"
      aria-label="Scan to claim"
      sx={{
        position: 'absolute',
        inset: 0,
        zIndex: 30,
        overflow: 'hidden',
        backgroundColor: surface.ground,
      }}
    >
      {children}
    </Box>
  );
}

export default ScanFlow;
