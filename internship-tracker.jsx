// Internship Tracker Widget for Übersicht
// Sits on your desktop, persists counts to disk

export const refreshFrequency = false; // only refresh on command

export const command = `
  DATA_FILE="$HOME/.internship_tracker.json"
  if [ -f "$DATA_FILE" ]; then
    cat "$DATA_FILE"
  else
    echo '{"apps":0,"firms":0}'
  fi
`;

export const initialState = { apps: 0, firms: 0, output: '' };

export const updateState = (event, previousState) => {
  if (event.type === 'UB/COMMAND_RAN') {
    try {
      const data = JSON.parse(event.output.trim());
      return { ...previousState, apps: data.apps || 0, firms: data.firms || 0 };
    } catch (e) {
      return previousState;
    }
  }
  if (event.type === 'SET_COUNT') {
    return { ...previousState, [event.key]: Math.max(0, event.value) };
  }
  return previousState;
};

const saveToFile = (apps, firms) => {
  const json = JSON.stringify({ apps, firms });
  const cmd = `echo '${json}' > "$HOME/.internship_tracker.json"`;
  // Use Übersicht's run to save
  if (typeof run !== 'undefined') run(cmd);
};

import { run } from 'uebersicht';

export const render = ({ apps, firms, dispatch }) => {
  const change = (key, delta, currentApps, currentFirms) => {
    const current = key === 'apps' ? currentApps : currentFirms;
    const next = Math.max(0, current + delta);
    dispatch({ type: 'SET_COUNT', key, value: next });
    const newApps = key === 'apps' ? next : currentApps;
    const newFirms = key === 'firms' ? next : currentFirms;
    run(`echo '${JSON.stringify({ apps: newApps, firms: newFirms })}' > "$HOME/.internship_tracker.json"`);
  };

  return (
    <div style={styles.widget}>
      <div style={styles.title}>INTERNSHIPS</div>
      <div style={styles.grid}>
        <Column label="APPS" count={apps} onPlus={() => change('apps', +1, apps, firms)} onMinus={() => change('apps', -1, apps, firms)} />
        <div style={styles.divider} />
        <Column label="FIRMS" count={firms} onPlus={() => change('firms', +1, apps, firms)} onMinus={() => change('firms', -1, apps, firms)} />
      </div>
    </div>
  );
};

const Column = ({ label, count, onPlus, onMinus }) => (
  <div style={styles.column}>
    <div style={styles.label}>{label}</div>
    <div style={styles.number}>{count}</div>
    <div style={styles.buttonRow}>
      <button style={styles.plusBtn} onClick={onPlus}>+</button>
      <button style={styles.minusBtn} onClick={onMinus}>−</button>
    </div>
  </div>
);

const styles = {
  widget: {
    width: '210px',
    height: '210px',
    background: 'rgba(10, 10, 14, 0.82)',
    backdropFilter: 'blur(20px)',
    WebkitBackdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255,255,255,0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px 14px 14px',
    fontFamily: '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    boxSizing: 'border-box',
    userSelect: 'none',
  },
  title: {
    fontSize: '9px',
    fontWeight: '700',
    letterSpacing: '0.18em',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
  },
  grid: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '0px',
    flex: 1,
    width: '100%',
    marginTop: '4px',
  },
  divider: {
    width: '1px',
    height: '80px',
    background: 'rgba(255,255,255,0.08)',
    margin: '0 6px',
  },
  column: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '2px',
  },
  label: {
    fontSize: '8px',
    fontWeight: '600',
    letterSpacing: '0.14em',
    color: 'rgba(255,255,255,0.25)',
    textTransform: 'uppercase',
  },
  number: {
    fontSize: '58px',
    fontWeight: '700',
    color: '#ffffff',
    lineHeight: '1',
    fontVariantNumeric: 'tabular-nums',
    letterSpacing: '-0.03em',
    margin: '2px 0 4px',
  },
  buttonRow: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5px',
  },
  plusBtn: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.12)',
    border: '1px solid rgba(255,255,255,0.15)',
    color: '#ffffff',
    fontSize: '20px',
    fontWeight: '300',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1',
    transition: 'background 0.15s',
    padding: '0',
  },
  minusBtn: {
    width: '18px',
    height: '18px',
    borderRadius: '6px',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.35)',
    fontSize: '12px',
    fontWeight: '300',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    lineHeight: '1',
    padding: '0',
  },
};
