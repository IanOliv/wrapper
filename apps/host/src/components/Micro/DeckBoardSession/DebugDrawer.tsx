import { ChangeEvent } from 'react';

import { Crosshair } from '@phosphor-icons/react';

import { DebugDrawer as Drawer, RangeInput } from './styled';
import type { DeckBoardView } from './view';

interface DebugDrawerProps {
  view: DeckBoardView;
}

interface RangeRowProps {
  label: string;
  value: string;
  min: number;
  max: number;
  step: number;
  current: number;
  onChange: (v: number) => void;
}

function RangeRow({ label, value, min, max, step, current, onChange }: RangeRowProps) {
  const handle = (e: ChangeEvent<HTMLInputElement>) => onChange(parseFloat(e.target.value));

  return (
    <>
      <div
        style={{
          display: 'flex',
          alignItems: 'baseline',
          justifyContent: 'space-between',
          marginTop: 4,
        }}
      >
        <span style={{ fontSize: 10, color: '#b2b6ca' }}>{label}</span>
        <span
          style={{ fontFamily: 'ui-monospace, Menlo, monospace', fontSize: 10, color: '#e9e9ed' }}
        >
          {value}
        </span>
      </div>
      <RangeInput type="range" min={min} max={max} step={step} value={current} onChange={handle} />
    </>
  );
}

/** Collapsed by default, toggled by the corner Debug button or the `D` key —
 *  slides in over the board, never pushes layout. */
function DebugDrawer({ view }: DebugDrawerProps) {
  return (
    <Drawer $open={view.debugOpen}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <Crosshair size={14} color="#9d97e0" />
        <span
          style={{
            fontSize: 10,
            letterSpacing: '.12em',
            textTransform: 'uppercase',
            color: '#75798c',
          }}
        >
          Where is
        </span>
        <span
          style={{
            marginLeft: 'auto',
            fontFamily: 'ui-monospace, Menlo, monospace',
            fontSize: 10,
            color: '#595d6c',
          }}
        >
          D
        </span>
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          overflow: 'auto',
          minHeight: 0,
          flex: 1,
        }}
      >
        {view.registry.map((r) => (
          <div
            key={r.id}
            style={{ display: 'flex', alignItems: 'center', gap: 8, height: 22, flex: 'none' }}
          >
            <span
              style={{
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 10,
                color: '#9397ab',
                width: 32,
                flex: 'none',
              }}
            >
              {r.id}
            </span>
            <span
              style={{
                height: 17,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '0 7px',
                borderRadius: 999,
                fontSize: 9,
                whiteSpace: 'nowrap',
                border: `1px solid ${r.ring}`,
                color: r.fg,
              }}
            >
              {r.zone}
            </span>
            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'ui-monospace, Menlo, monospace',
                fontSize: 9,
                color: '#595d6c',
              }}
            >
              {r.at}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          borderTop: '1px solid #232532',
          paddingTop: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          flex: 'none',
        }}
      >
        <RangeRow
          label="Scale"
          value={view.scaleLabel}
          min={0.35}
          max={0.8}
          step={0.05}
          current={view.scale}
          onChange={view.onScale}
        />
        <RangeRow
          label="Move"
          value={view.moveLabel}
          min={0}
          max={1200}
          step={50}
          current={view.moveMs}
          onChange={view.onMoveMs}
        />
        <RangeRow
          label="Reach"
          value={view.reachLabel}
          min={1}
          max={5}
          step={1}
          current={view.reach}
          onChange={view.onReach}
        />
        <RangeRow
          label="Reach x"
          value={view.reachXLabel}
          min={0}
          max={5}
          step={1}
          current={view.reachX}
          onChange={view.onReachX}
        />
        <RangeRow
          label="Reach y"
          value={view.reachYLabel}
          min={0}
          max={6}
          step={1}
          current={view.reachY}
          onChange={view.onReachY}
        />
        <RangeRow
          label="Reach diagonal"
          value={view.reachDiagLabel}
          min={0}
          max={5}
          step={1}
          current={view.reachDiag}
          onChange={view.onReachDiag}
        />
        <RangeRow
          label="Volume"
          value={view.volumeLabel}
          min={0}
          max={1}
          step={0.05}
          current={view.volume}
          onChange={view.onVolume}
        />
        <label
          style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8, cursor: 'pointer' }}
        >
          <input
            type="checkbox"
            checked={view.isDebug}
            onChange={(e) => view.onIsDebug(e.target.checked)}
            style={{ width: 13, height: 13, accentColor: '#9d97e0', cursor: 'pointer' }}
          />
          <span style={{ fontSize: 10, color: '#b2b6ca' }}>is debug</span>
        </label>
      </div>

      <div
        style={{
          borderTop: '1px solid #232532',
          paddingTop: 9,
          fontSize: 9,
          lineHeight: 1.55,
          color: '#595d6c',
          flex: 'none',
        }}
      >
        Clique na pilha para puxar · clique numa carta da mão e depois num slot da zona do jogador ·
        clique numa carta no campo para atacar um inimigo realçado · Esc cancela · {view.returnHint}
      </div>
    </Drawer>
  );
}

export default DebugDrawer;
