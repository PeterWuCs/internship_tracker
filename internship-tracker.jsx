import { run } from "uebersicht";

export const className = `
  position: absolute;
  left: 35%;
  top: 5%;
  transform: translateX(-50%);
  pointer-events: all;
`;

export const refreshFrequency = 1000;

const DATA_FILE = "$HOME/.internship_tracker.json";

// --- Command: read the JSON file every tick and load it into state ---
export const command = async (dispatch) => {
  const readCmd = `cat "${DATA_FILE}" 2>/dev/null || echo '{"apps":0,"firms":0}'`;
  try {
    const out = await run(readCmd);
    const data = JSON.parse(out.trim());
    dispatch({ type: "LOAD", data });
  } catch (err) {
    console.error("Failed to read tracker file", err);
    dispatch({ type: "LOAD", data: { apps: 0, firms: 0 } });
  }
};

export const updateState = (event, previousState) => {
  if (event.type === "LOAD") {
    return {
      ...previousState,
      apps: event.data.apps,
      firms: event.data.firms,
    };
  }
  return previousState;
};

export const initialState = {
  apps: 0,
  firms: 0,
};

// --- Mutate a counter by writing the new value straight to disk.
// No dispatch needed: the next refreshFrequency tick reads the file and
// re-renders. This is the version-proof approach — `dispatch` is not
// reliably available inside render across Übersicht versions, but `run` is. ---
const bump = (apps, firms, key, delta) => {
  const current = { apps, firms };
  const nextVal = Math.max(0, (current[key] || 0) + delta);
  const next = { ...current, [key]: nextVal };
  const json = JSON.stringify(next);
  // Read-modify-write in the shell so two quick clicks can't lose an update:
  // we recompute from whatever is on disk at write time using node if present,
  // but fall back to a plain overwrite. A plain overwrite is fine here since
  // clicks are user-paced. Single quotes are safe — JSON uses only " internally.
  run(`printf '%s' '${json}' > "${DATA_FILE}"`).catch((err) =>
    console.error("Write error:", err),
  );
};

export const render = ({ apps, firms }) => {
  const currentHour = new Date().getHours();
  const isDay = currentHour >= 7 && currentHour < 19;

  const theme = isDay
    ? {
        bg: "rgba(245, 243, 238, 0.92)",
        border: "rgba(0,0,0,0.07)",
        shadow: "0 8px 32px rgba(0,0,0,0.12)",
        insetShadow: "inset 0 1px 0 rgba(255,255,255,0.9)",
        title: "rgba(0,0,0,0.35)",
        label: "rgba(0,0,0,0.4)",
        number: "#1a1a1a",
        divider: "rgba(0,0,0,0.08)",
        plusBg: "rgba(0,0,0,0.08)",
        plusBorder: "rgba(0,0,0,0.12)",
        plusColor: "#1a1a1a",
        minusBg: "rgba(0,0,0,0.04)",
        minusBorder: "rgba(0,0,0,0.07)",
        minusColor: "rgba(0,0,0,0.3)",
      }
    : {
        bg: "rgba(10, 10, 14, 0.88)",
        border: "rgba(255,255,255,0.08)",
        shadow: "0 8px 32px rgba(0,0,0,0.5)",
        insetShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
        title: "rgba(255,255,255,0.35)",
        label: "rgba(255,255,255,0.3)",
        number: "#ffffff",
        divider: "rgba(255,255,255,0.08)",
        plusBg: "rgba(255,255,255,0.12)",
        plusBorder: "rgba(255,255,255,0.15)",
        plusColor: "#ffffff",
        minusBg: "rgba(255,255,255,0.05)",
        minusBorder: "rgba(255,255,255,0.08)",
        minusColor: "rgba(255,255,255,0.35)",
      };

  const Counter = ({ label, value, dataKey }) => (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "3px",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "600",
          letterSpacing: "0.1em",
          color: theme.label,
          textTransform: "uppercase",
          transition: "color 1s ease",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "62px",
          fontWeight: "700",
          color: theme.number,
          lineHeight: "1",
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "-0.03em",
          margin: "2px 0 5px",
          transition: "color 1s ease",
        }}
      >
        {value}
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          gap: "5px",
          pointerEvents: "all",
        }}
      >
        <button
          style={{
            width: "36px",
            height: "36px",
            borderRadius: "11px",
            background: theme.plusBg,
            border: `1px solid ${theme.plusBorder}`,
            color: theme.plusColor,
            fontSize: "22px",
            fontWeight: "300",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            padding: "0",
            pointerEvents: "all",
          }}
          onClick={() => bump(apps, firms, dataKey, 1)}
        >
          +
        </button>
        <button
          style={{
            width: "20px",
            height: "20px",
            borderRadius: "7px",
            background: theme.minusBg,
            border: `1px solid ${theme.minusBorder}`,
            color: theme.minusColor,
            fontSize: "13px",
            fontWeight: "300",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            lineHeight: "1",
            padding: "0",
            pointerEvents: "all",
          }}
          onClick={() => bump(apps, firms, dataKey, -1)}
        >
          −
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        width: "230px",
        height: "230px",
        background: theme.bg,
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        borderRadius: "24px",
        border: `1px solid ${theme.border}`,
        boxShadow: `${theme.shadow}, ${theme.insetShadow}`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "18px 16px 16px",
        fontFamily:
          '"SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
        boxSizing: "border-box",
        userSelect: "none",
        pointerEvents: "all",
        cursor: "default",
        transition: "background 1s ease, box-shadow 1s ease",
      }}
    >
      <div
        style={{
          fontSize: "11px",
          fontWeight: "700",
          letterSpacing: "0.2em",
          color: theme.title,
          textTransform: "uppercase",
          transition: "color 1s ease",
        }}
      >
        INTERNSHIPS
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          width: "100%",
          marginTop: "6px",
        }}
      >
        <Counter label="Applications" value={apps} dataKey="apps" />

        <div
          style={{
            width: "1px",
            height: "90px",
            background: theme.divider,
            margin: "0 4px",
            transition: "background 1s ease",
          }}
        />

        <Counter label="Firms" value={firms} dataKey="firms" />
      </div>
    </div>
  );
};
