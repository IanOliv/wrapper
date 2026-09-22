import { RefObject } from 'react';

import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';

import {
  ArrowCounterClockwise,
  Crosshair,
  Cube,
  GridNine,
  Minus,
  Path,
  Pause,
  Play,
  Plus,
  Stack,
} from '@phosphor-icons/react';

import { FlexBox } from '@/components/styled';

import Card from './Card';
import MotionPath from './MotionPath';
import { cardLayers, isVisible, poseAt } from './model';
import type { Action } from './reducer';
import {
  Chip,
  OriginLeader,
  Readout,
  StageGround,
  StageRow,
  Stepper,
  StepperButton,
} from './styled';
import type { WorkbenchState } from './types';
import { cardBox, format, zoomSteps } from './utils';

interface StageProps {
  state: WorkbenchState;
  dispatch: (action: Action) => void;
  stageRef: RefObject<HTMLDivElement>;
  onCenter: () => void;
}

/** The frames the onion skin ghosts, either side of the playhead. */
const ONION_OFFSETS = [-2, -1, 1, 2].map((step) => step * 0.08);

/**
 * The centre column. The card gets the room; every control here is a 28px chip
 * in one of the two in-flow rows, so a narrow stage reflows them instead of
 * letting them float over the card.
 */
function Stage({ state, dispatch, stageRef, onCenter }: StageProps) {
  const { doc, selection, view } = state;
  const zoomIndex = zoomSteps.indexOf(view.zoom);
  const cards = cardLayers(doc);
  const anchor = cards.find((layer) => selection.layerIds.includes(layer.id)) ?? cards[0];
  const anchorPose = anchor ? poseAt(doc, anchor, doc.playhead, cards.indexOf(anchor)) : undefined;

  return (
    <StageGround grid={view.grid}>
      {/* 1 — toolbar row, in flow */}
      <StageRow sx={{ justifyContent: 'space-between', padding: '14px 16px 0' }}>
        <StageRow>
          <Stepper>
            <StepperButton
              aria-label="Zoom out"
              disabled={zoomIndex <= 0}
              onClick={() =>
                dispatch({ type: 'set-zoom', value: zoomSteps[Math.max(0, zoomIndex - 1)] })
              }
            >
              <Minus size={14} />
            </StepperButton>
            <Readout sx={{ px: 1.25, color: 'text.secondary' }}>{view.zoom}%</Readout>
            <StepperButton
              aria-label="Zoom in"
              disabled={zoomIndex >= zoomSteps.length - 1}
              onClick={() =>
                dispatch({
                  type: 'set-zoom',
                  value: zoomSteps[Math.min(zoomSteps.length - 1, zoomIndex + 1)],
                })
              }
            >
              <Plus size={14} />
            </StepperButton>
          </Stepper>

          <Chip onClick={onCenter}>
            <Crosshair size={14} />
            Center
          </Chip>

          <Chip
            onClick={() => dispatch({ type: 'toggle-view', field: 'grid' })}
            className={view.grid ? 'active' : undefined}
            aria-pressed={view.grid}
          >
            <GridNine size={14} weight={view.grid ? 'fill' : 'regular'} />
            Grid
          </Chip>
        </StageRow>

        <StageRow>
          <Chip
            className="accent"
            onClick={() => dispatch({ type: 'set-playing', value: !view.playing })}
          >
            {view.playing ? <Pause size={12} weight="fill" /> : <Play size={12} weight="fill" />}
            {view.playing ? 'Pause' : 'Play'}
          </Chip>

          <Tooltip title="Reset the stage" arrow>
            <Chip
              aria-label="Reset the stage"
              onClick={() => dispatch({ type: 'reset-stage' })}
              sx={{ width: 28, p: 0 }}
            >
              <ArrowCounterClockwise size={14} />
            </Chip>
          </Tooltip>
        </StageRow>
      </StageRow>

      {/* 2 — the canvas itself */}
      <Box
        ref={stageRef}
        sx={{
          flex: 1,
          position: 'relative',
          // must be able to shrink, or the canvas alone forces a page scrollbar
          minHeight: 0,
          margin: '14px 0',
          perspective: view.three ? `${doc.perspective}px` : undefined,
        }}
      >
        {/* Ghost frames read as where the card was and where it is going. */}
        {view.onionSkin &&
          ONION_OFFSETS.map((offset) =>
            cards
              .filter((layer) => isVisible(doc, layer))
              .map((layer, index) => (
                <Card
                  key={`${layer.id}${offset}`}
                  ghost
                  index={index}
                  name={layer.name}
                  pose={poseAt(doc, layer, doc.playhead + offset, index)}
                  zoom={view.zoom}
                  three={view.three}
                />
              )),
          )}

        {cards
          .filter((layer) => isVisible(doc, layer))
          .map((layer, index) => (
            <Card
              key={layer.id}
              index={index}
              name={layer.name}
              pose={poseAt(doc, layer, doc.playhead, index)}
              zoom={view.zoom}
              three={view.three}
            />
          ))}

        {/* The leader lines and readout describe the anchor's position, and
            there is one anchor. */}
        {anchor && anchorPose && (
          <Box
            sx={{
              position: 'absolute',
              left: `${anchorPose.position.x}%`,
              top: `${anchorPose.position.y}%`,
              width: cardBox.width,
              transform: `scale(${(anchorPose.scale * view.zoom) / 100})`,
              // matches the card's own origin, so the leaders track it exactly
              transformOrigin: 'center',
              pointerEvents: 'none',
              zIndex: 2,
            }}
          >
            {/* Full card height, so the horizontal leader meets the card's
                middle rather than its top edge. */}
            <Box sx={{ position: 'relative', height: cardBox.height }}>
              <OriginLeader axis="h" />
              <OriginLeader axis="v" />
            </Box>
          </Box>
        )}

        {view.motionPath && <MotionPath state={state} dispatch={dispatch} />}
      </Box>

      {anchorPose && (
        <FlexBox sx={{ gap: 1.25, justifyContent: 'center', flexShrink: 0, pb: 1 }}>
          <Readout>x {format(anchorPose.position.x)}</Readout>
          <Readout sx={(theme) => ({ color: theme.shell.border.card })}>|</Readout>
          <Readout>y {format(anchorPose.position.y)}</Readout>
          <Readout sx={(theme) => ({ color: theme.shell.border.card })}>|</Readout>
          <Readout>scale {format(anchorPose.scale, 2)}</Readout>
        </FlexBox>
      )}

      {/* 3 — toggle row, in flow */}
      <StageRow sx={{ padding: '0 16px 14px' }}>
        <Chip
          onClick={() => dispatch({ type: 'toggle-view', field: 'motionPath' })}
          className={view.motionPath ? 'active' : undefined}
          aria-pressed={view.motionPath}
        >
          <Path size={14} weight={view.motionPath ? 'fill' : 'regular'} />
          Motion path
        </Chip>

        <Chip
          onClick={() => dispatch({ type: 'toggle-view', field: 'three' })}
          className={view.three ? 'active' : undefined}
          aria-pressed={view.three}
        >
          <Cube size={14} weight={view.three ? 'fill' : 'regular'} />
          3D
        </Chip>

        <Chip
          onClick={() => dispatch({ type: 'toggle-view', field: 'onionSkin' })}
          className={view.onionSkin ? 'active' : undefined}
          aria-pressed={view.onionSkin}
        >
          <Stack size={14} weight={view.onionSkin ? 'fill' : 'regular'} />
          Onion skin
        </Chip>
      </StageRow>
    </StageGround>
  );
}

export default Stage;
