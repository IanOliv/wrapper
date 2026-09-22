import {
  CardName,
  CostBadge,
  DebugButton,
  EndTurnButton,
  Ghost as GhostBox,
  LogOverlayBackdrop,
  OverlayBackdrop,
  PLabel,
  Panel,
} from './styled';
import type { DeckBoardView } from './view';

interface OverlaysProps {
  view: DeckBoardView;
}

/** Everything that floats above the board: the attack aim line, the drag
 *  ghost, the win/loss overlay and the full-turn log overlay. */
function Overlays({ view }: OverlaysProps) {
  return (
    <>
      {view.aim.map((a, i) => (
        <svg
          key={i}
          width="100%"
          height="100%"
          style={{
            position: 'absolute',
            inset: 0,
            pointerEvents: 'none',
            zIndex: 100,
            overflow: 'visible',
          }}
        >
          <defs>
            <marker
              id="dbs-arrow"
              viewBox="0 0 8 8"
              refX={6}
              refY={4}
              markerWidth={6}
              markerHeight={6}
              orient="auto"
            >
              <path d="M 0 1 L 7 4 L 0 7 z" fill="#f0a68f" />
            </marker>
          </defs>
          <path
            d={`M ${a.x1} ${a.y1} C ${a.x1} ${a.y2}, ${a.x2} ${a.y1}, ${a.x2} ${a.y2}`}
            fill="none"
            stroke="#f0a68f"
            strokeWidth={1}
            strokeDasharray="4 4"
            markerEnd="url(#dbs-arrow)"
          />
        </svg>
      ))}

      {view.ghost.map((g) => (
        <GhostBox
          key={g.id}
          ref={view.refs.ghostRef}
          $stripe="#9d97e0"
          style={{ width: view.cardW, height: view.cardH }}
        >
          <CostBadge>{g.cost}</CostBadge>
          <div
            style={{ flex: 1, display: 'grid', placeItems: 'center', width: '100%', paddingTop: 8 }}
          >
            <CardName style={{ fontSize: 10 }}>{g.name}</CardName>
          </div>
        </GhostBox>
      ))}

      {view.over && (
        <OverlayBackdrop>
          <div
            style={{
              width: 340,
              maxHeight: '100%',
              display: 'flex',
              flexDirection: 'column',
              gap: 16,
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, alignItems: 'center' }}>
              <span style={{ fontSize: 22, letterSpacing: '.09em', color: view.over.fg }}>
                {view.over.title}
              </span>
              <span style={{ fontSize: 11, color: '#cfe0d2' }}>{view.over.sub}</span>
            </div>
            <Panel style={{ width: '100%' }}>
              <PLabel>Últimas ações</PLabel>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 5,
                  maxHeight: 168,
                  overflow: 'auto',
                }}
              >
                {view.logLines.map((l) => (
                  <span
                    key={l.key}
                    style={{ fontSize: 11, lineHeight: 1.35, color: l.fg, flex: 'none' }}
                  >
                    {l.text}
                  </span>
                ))}
              </div>
            </Panel>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <EndTurnButton
                type="button"
                onClick={view.onNewGame}
                $hot={false}
                style={{ height: 34, minWidth: 132 }}
              >
                Nova partida
              </EndTurnButton>
              <DebugButton
                type="button"
                onClick={view.onToggleLog}
                style={{
                  height: 34,
                  minWidth: 132,
                  flexDirection: 'row',
                  justifyContent: 'center',
                  fontSize: 12,
                }}
              >
                Ver log completo
              </DebugButton>
            </div>
          </div>
        </OverlayBackdrop>
      )}

      {view.logOpen && (
        <LogOverlayBackdrop onClick={view.onToggleLog}>
          <Panel style={{ width: 320, maxHeight: '70%', background: '#3f5c48', gap: 10 }}>
            <div
              style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}
            >
              <PLabel>Log · turno {view.turn}</PLabel>
              <span style={{ fontSize: 9, color: '#8fb896' }}>clique para fechar</span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 5,
                overflow: 'auto',
                minHeight: 0,
              }}
            >
              {view.logAll.map((l) => (
                <span
                  key={l.key}
                  style={{ fontSize: 11, lineHeight: 1.35, color: '#e6f2e8', flex: 'none' }}
                >
                  {l.text}
                </span>
              ))}
            </div>
          </Panel>
        </LogOverlayBackdrop>
      )}
    </>
  );
}

export default Overlays;
