import { CardStats, DebugButton, KeyCap, PLabel, Panel, SidePanel as SidePanelBox } from './styled';
import type { DeckBoardView } from './view';

interface SidePanelProps {
  view: DeckBoardView;
}

const SHORTCUTS: [string, string][] = [
  ['1-6', 'jogar carta'],
  ['← →', 'navegar slots'],
  ['↵', 'confirmar'],
  ['esc', 'cancelar'],
  ['espaço', 'encerrar turno'],
  ['ctrl z', 'desfazer'],
];

/** Desktop-only right column: card preview, shortcut reference, and the log. */
function SidePanel({ view }: SidePanelProps) {
  const { preview } = view;

  return (
    <SidePanelBox>
      <Panel>
        <PLabel>Preview</PLabel>
        <div
          style={{
            opacity: preview.active ? 1 : 0.5,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
          }}
        >
          <div
            style={{
              position: 'relative',
              alignSelf: 'center',
              width: 72,
              height: 96,
              borderRadius: 8,
              boxSizing: 'border-box',
              background: preview.foe ? '#43221f' : '#2f2c55',
              border: `2px solid ${preview.foe ? '#9c5340' : '#9d97e0'}`,
              display: 'flex',
              flexDirection: 'column',
              padding: '7px 8px',
            }}
          >
            <span
              style={{
                fontSize: 10,
                lineHeight: 1.15,
                color: preview.foe ? '#f0c9bd' : '#dcd9f5',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {preview.name}
            </span>
            <span
              style={{
                position: 'absolute',
                top: 6,
                right: 6,
                minWidth: 17,
                height: 15,
                padding: '0 4px',
                borderRadius: 4,
                background: preview.foe ? '#7a2f24' : '#3a3668',
                boxSizing: 'border-box',
                display: 'grid',
                placeItems: 'center',
                fontSize: 11,
                lineHeight: 1,
                color: preview.foe ? '#f5d9d0' : '#dcd9f5',
              }}
            >
              {preview.cost}
            </span>
            <div style={{ flex: 1 }} />
            <CardStats style={{ color: preview.foe ? '#c08b7a' : '#8f8ab8' }}>
              <span>atk {preview.atk}</span>
              <span>hp {preview.hp}</span>
            </CardStats>
          </div>
          <span
            style={{
              fontSize: 10,
              lineHeight: 1.5,
              color: '#cfe0d2',
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {preview.text}
          </span>
        </div>
      </Panel>

      <Panel>
        <PLabel>Atalhos</PLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {SHORTCUTS.map(([key, label]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <KeyCap>{key}</KeyCap>
              <span style={{ fontSize: 10, color: '#cfe0d2' }}>{label}</span>
            </div>
          ))}
        </div>
      </Panel>

      <Panel onClick={view.onToggleLog} style={{ minHeight: 94, cursor: 'pointer' }}>
        <PLabel>Log</PLabel>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {view.logLines.map((l) => (
            <span
              key={l.key}
              style={{
                fontSize: 10,
                lineHeight: 1.3,
                color: l.fg,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {l.text}
            </span>
          ))}
        </div>
      </Panel>

      <DebugButton type="button" onClick={view.onToggleDebugDrawer} style={{ marginTop: 'auto' }}>
        <span style={{ fontSize: 12 }}>Debug</span>
        <span style={{ fontSize: 10, color: '#a8c4ad' }}>tecla D</span>
      </DebugButton>
    </SidePanelBox>
  );
}

export default SidePanel;
