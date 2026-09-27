import {
  DesktopOnly,
  EndTurnButton,
  EnergyPip,
  HpFill,
  HpTrack,
  Hud as HudBar,
  HudPillButton,
  MobileOnly,
  ThreatPill,
} from './styled';
import type { DeckBoardView } from './view';

interface HudProps {
  view: DeckBoardView;
}

/** Turn, HP, threat, energy and the turn-ending controls — always full width. */
function Hud({ view }: HudProps) {
  return (
    <HudBar>
      <DesktopOnly>
        <span style={{ fontSize: 11, letterSpacing: '.12em', color: '#cfe0d2' }}>
          TURNO {view.turn}
        </span>
      </DesktopOnly>
      <MobileOnly>
        <span style={{ fontSize: 11, letterSpacing: '.06em', color: '#cfe0d2' }}>
          {view.turnShort}
        </span>
      </MobileOnly>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <span style={{ fontSize: 11, letterSpacing: '.08em', color: '#a8c4ad' }}>HP</span>
        <HpTrack $pulse={view.hpPulse} ref={view.refs.hpBarRef}>
          <HpFill style={{ width: view.hpPct + '%', background: view.hpFill }} />
        </HpTrack>
        <span style={{ fontSize: 12, color: '#e6f2e8' }}>
          {view.hp}/{view.maxHp}
        </span>
      </div>
      <ThreatPill onMouseEnter={view.onPillEnter} onMouseLeave={view.onPillLeave}>
        <span>↘</span>
        <span>{view.threat}</span>
        <span style={{ color: '#ffe0d5' }}>{view.threatShare}</span>
      </ThreatPill>
      <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginLeft: 'auto' }}>
        <span style={{ fontSize: 11, letterSpacing: '.08em', color: '#a8c4ad' }}>ENERGIA</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          {view.pips.map((p, i) => (
            <EnergyPip key={i} style={{ background: p.bg, border: `1px solid ${p.ring}` }} />
          ))}
        </div>
      </div>
      <DesktopOnly>
        <HudPillButton
          type="button"
          onClick={view.onUndo}
          style={{ minWidth: 86, opacity: view.undoEnabled ? 1 : 0.4 }}
        >
          ↺ desfazer
        </HudPillButton>
      </DesktopOnly>
      <HudPillButton type="button" onClick={view.onToggleSound} style={{ minWidth: 56 }}>
        {view.soundOn ? 'som ●' : 'som ○'}
      </HudPillButton>
      <DesktopOnly>
        <EndTurnButton type="button" onClick={view.onEndTurn} $hot={view.endTurnHot}>
          Encerrar turno
        </EndTurnButton>
      </DesktopOnly>
    </HudBar>
  );
}

export default Hud;
