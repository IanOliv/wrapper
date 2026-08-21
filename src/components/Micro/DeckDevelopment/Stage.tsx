import { RefObject } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import {
  ArrowCounterClockwise,
  Crosshair,
  GridNine,
  Minus,
  Pause,
  Play,
  Plus,
} from '@phosphor-icons/react';

import { FlexBox } from '@/components/styled';

import Card from './Card';
import { spatialAnimations } from './animations';
import {
  OriginLeader,
  Readout,
  StageControl,
  StageGround,
  StageToolbar,
  Stepper,
  StepperButton,
  TimelineBar,
  TimelineSlider,
} from './styled';
import type { CardDetails, DeckAttributes } from './types';
import { fanPositions, format, seconds, workbench, zoomSteps } from './utils';

interface StageProps {
  attributes: DeckAttributes;
  animation: string;
  easing: string;
  details: CardDetails;
  zoom: number;
  grid: boolean;
  playing: boolean;
  playhead: number;
  stageRef: RefObject<HTMLDivElement>;
  cardRef: RefObject<HTMLDivElement>;
  onZoom: (zoom: number) => void;
  onToggleGrid: () => void;
  onCenter: () => void;
  onTogglePlay: () => void;
  onReset: () => void;
  onScrub: (playhead: number) => void;
}

/**
 * The left column. The card gets the room; every control that lives here is a
 * 28px chip floating over the ground, so nothing competes with what is on stage.
 */
function Stage({
  attributes,
  animation,
  easing,
  details,
  zoom,
  grid,
  playing,
  playhead,
  stageRef,
  cardRef,
  onZoom,
  onToggleGrid,
  onCenter,
  onTogglePlay,
  onReset,
  onScrub,
}: StageProps) {
  const { scale, duration, positionH, positionV } = attributes;
  const cards = fanPositions(attributes);
  const zoomIndex = zoomSteps.indexOf(zoom);

  return (
    <StageGround grid={grid} ref={stageRef}>
      <StageToolbar sx={{ left: 16 }}>
        <Stepper>
          <StepperButton
            aria-label="Zoom out"
            disabled={zoomIndex <= 0}
            onClick={() => onZoom(zoomSteps[Math.max(0, zoomIndex - 1)])}
          >
            <Minus size={14} />
          </StepperButton>
          <Readout sx={{ px: 1.25, color: 'text.secondary' }}>{zoom}%</Readout>
          <StepperButton
            aria-label="Zoom in"
            disabled={zoomIndex >= zoomSteps.length - 1}
            onClick={() => onZoom(zoomSteps[Math.min(zoomSteps.length - 1, zoomIndex + 1)])}
          >
            <Plus size={14} />
          </StepperButton>
        </Stepper>

        <StageControl onClick={onCenter}>
          <Crosshair size={14} />
          Center
        </StageControl>

        <StageControl
          onClick={onToggleGrid}
          className={grid ? 'active' : undefined}
          aria-pressed={grid}
        >
          <GridNine size={14} weight={grid ? 'fill' : 'regular'} />
          Grid
        </StageControl>
      </StageToolbar>

      <StageToolbar sx={{ right: 16 }}>
        <StageControl
          onClick={onTogglePlay}
          sx={(theme) => ({
            backgroundColor: 'transparent',
            borderColor: theme.palette.primary.main,
            color: theme.palette.primary.main,
            padding: '0 11px',
            gap: '7px',
            '&:hover': {
              borderColor: theme.palette.primary.dark,
              color: theme.palette.primary.dark,
              backgroundColor: theme.shell.tint,
            },
          })}
        >
          {playing ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
          {playing ? 'Pause' : 'Play'}
        </StageControl>

        <Tooltip title="Reset the stage" arrow>
          <StageControl aria-label="Reset the stage" onClick={onReset} sx={{ width: 28, p: 0 }}>
            <ArrowCounterClockwise size={14} />
          </StageControl>
        </Tooltip>
      </StageToolbar>

      {/* The cards. Anchored top-left in a percentage field, so the spawn
          points mean the same thing they mean on the existing deck page. */}
      {cards.map((position, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            left: `${position.left}%`,
            top: `${position.top}%`,
            // 172px so the readout below and the leader lines stay pinned to the
            // card's own edges rather than to the widest thing in the stack
            width: 172,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: `scale(${(scale.value * zoom) / 100})`,
            transformOrigin: 'top left',
            transition: (theme) =>
              `left ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, top ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}, transform ${theme.shell.motion.duration.state}ms ${theme.shell.motion.easing.state}`,
            zIndex: 1,
          }}
        >
          <Box
            ref={index === 0 ? cardRef : undefined}
            sx={{
              position: 'relative',
              width: '100%',
              // Flip and Sway turn the card in depth; without a perspective on
              // the parent they read as a flat horizontal squeeze.
              perspective: spatialAnimations.includes(animation) ? '900px' : undefined,
            }}
          >
            {/* Only the anchor card carries the leader lines and the readout —
                they describe the position, and there is one position. */}
            {index === 0 && (
              <>
                <OriginLeader axis="h" />
                <OriginLeader axis="v" />
              </>
            )}

            <Card
              index={index}
              details={details}
              animation={animation}
              easing={easing}
              duration={duration.value}
              playhead={playhead}
              playing={playing}
            />
          </Box>

          {index === 0 && (
            <FlexBox sx={{ gap: 1.25, justifyContent: 'center', mt: 1.75 }}>
              <Readout>x {format(positionH.value)}</Readout>
              <Readout sx={(theme) => ({ color: theme.shell.border.card })}>|</Readout>
              <Readout>y {format(positionV.value)}</Readout>
              <Readout sx={(theme) => ({ color: theme.shell.border.card })}>|</Readout>
              <Readout>scale {format(scale.value, 2)}</Readout>
            </FlexBox>
          )}
        </Box>
      ))}

      {/* A motion playground needs scrubbing, so `duration` is a timeline
          rather than a slider adrift in a column of other sliders. */}
      <TimelineBar>
        <Box
          component="span"
          sx={(theme) => ({
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: workbench(theme).muted,
            whiteSpace: 'nowrap',
          })}
        >
          Timeline
        </Box>
        <TimelineSlider
          size="small"
          aria-label="Timeline"
          value={Math.min(playhead, duration.value)}
          min={0}
          max={duration.value || 1}
          step={(duration.value || 1) / 100}
          disabled={!duration.value}
          onChange={(_, next) => onScrub(next as number)}
        />
        <Readout sx={{ color: 'text.secondary' }}>
          {format(Math.min(playhead, duration.value), 2)} / {seconds(duration.value)}
        </Readout>
      </TimelineBar>
    </StageGround>
  );
}

export default Stage;
