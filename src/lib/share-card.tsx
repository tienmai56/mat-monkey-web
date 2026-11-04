import { artwork } from "./share-art";
import { shareColors as c } from "./share-tokens";
import { participantSummary, sessionDate, type InvitationPreview } from "./invitation-preview";
import type { InvitationKind } from "./app-links";

const image = (svg: string) => `data:image/svg+xml;base64,${btoa(svg)}`;
const fit = (text: string, limit: number) =>
  Array.from(text).length > limit
    ? Array.from(text)
        .slice(0, limit - 1)
        .join("") + "…"
    : text;

function titleLines(value: string): string[] {
  const title = fit(value.replace(/\s+/g, " ").trim(), 56);
  if (title.length <= 16) return [title];
  const spaces = Array.from(title.matchAll(/ /g), (match) => match.index!);
  const halfway = title.length / 2;
  const split = spaces.length
    ? spaces.reduce((best, index) =>
        Math.abs(index - halfway) < Math.abs(best - halfway) ? index : best,
      )
    : Math.floor(halfway);
  return [title.slice(0, split).trim(), title.slice(split).trim()];
}

export function ShareCard({
  kind,
  preview,
}: {
  kind: InvitationKind | "app";
  preview?: InvitationPreview;
}) {
  const session = preview?.kind === "session" ? preview : undefined;
  const date = session ? sessionDate(session) : undefined;
  const generic = {
    session: {
      title: "You’re invited.\nLet’s roll.",
      label: "Training session",
      sub: "A training session with your people.",
      tint: c.coral,
    },
    friend: {
      title: "Good rounds.\nBetter company.",
      label: "Friend invite",
      sub: "Your next training partner is one tap away.",
      tint: c.mint,
    },
    goal: {
      title: "Bring a goal.\nBuild your game.",
      label: "Shared goal",
      sub: "Something to work on. Someone to work with.",
      tint: c.plum,
    },
    app: {
      title: "Good people.\nGreat rolls.",
      label: "Mat Monkey",
      sub: "Make time for the mat. Bring your people.",
      tint: c.sun,
    },
  }[kind];
  const lines = session ? titleLines(session.title) : generic.title.split("\n");
  const longest = Math.max(...lines.map((line) => line.length));
  const titleSize = longest > 22 ? 62 : longest > 17 ? 74 : 84;
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        background: c.paper3,
        color: c.ink,
        fontFamily: "Archivo",
        position: "relative",
      }}
    >
      <div
        style={{
          width: 888,
          flexShrink: 0,
          padding: "44px 56px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            display: "flex",
            fontFamily: "Bricolage",
            fontWeight: 800,
            fontSize: 34,
            letterSpacing: -1.5,
          }}
        >
          mat monkey<span style={{ color: c.coral }}>.</span>
        </div>
        <div style={{ marginTop: 32, marginBottom: 12, fontSize: 20, color: c.tertiary }}>
          {generic.label}
        </div>
        <div
          style={{
            display: "flex",
            height: 178,
            flexShrink: 0,
            flexDirection: "column",
            alignItems: "flex-start",
            fontFamily: "Bricolage",
            fontWeight: 800,
            fontSize: titleSize,
            lineHeight: 1.02,
            letterSpacing: -2.5,
            overflow: "hidden",
          }}
        >
          {lines.map((line, index) => (
            <div
              key={index}
              style={{
                width: 776,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {line}
            </div>
          ))}
        </div>
        {session ? (
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                fontSize: 28,
                marginTop: 12,
              }}
            >
              <img src={image(artwork["map-pin"])} width={28} height={28} />
              <span>{fit(session.venue, 42)}</span>
            </div>
            {session.participants.length > 0 && (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  fontSize: 25,
                  color: c.secondary,
                  marginTop: 14,
                }}
              >
                <img src={image(artwork.users)} width={28} height={28} />
                <span>{fit(participantSummary(session), 50)}</span>
              </div>
            )}
            {session.focus.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", marginTop: 26 }}>
                <div style={{ fontSize: 19, color: c.tertiary, marginBottom: 10 }}>
                  What we’re working on
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  {session.focus.map((focus, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        background: c.white,
                        padding: "10px 18px",
                        borderRadius: 999,
                        fontSize: 23,
                      }}
                    >
                      {fit(focus, session.focus.length > 2 ? 15 : 25)}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              fontSize: 25,
              color: c.secondary,
              lineHeight: 1.4,
              marginTop: 22,
            }}
          >
            {generic.sub}
          </div>
        )}
      </div>
      <div
        style={{
          width: 312,
          flexShrink: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "44px 24px",
          background: generic.tint,
          borderLeft: "2px dashed rgba(29,27,24,.22)",
        }}
      >
        <img
          src={image(kind === "session" ? artwork["logo-mark-mono"] : artwork["logo-mark"])}
          width={100}
          height={112}
        />
        {date ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: "100%",
            }}
          >
            <div style={{ marginTop: 46, fontSize: 23, letterSpacing: 2 }}>{date.day}</div>
            <div style={{ fontFamily: "Bricolage", fontWeight: 800, fontSize: 124, lineHeight: 1 }}>
              {date.number}
            </div>
            <div style={{ fontSize: 26 }}>{date.month}</div>
            <div
              style={{
                display: "flex",
                fontFamily: "Bricolage",
                fontWeight: 800,
                fontSize: 34,
                marginTop: 27,
                paddingTop: 26,
                borderTop: "1px solid rgba(29,27,24,.12)",
              }}
            >
              {date.time.toLowerCase()}
            </div>
            <div style={{ fontSize: 19, marginTop: 7, color: c.secondary }}>{date.zone}</div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              marginTop: 110,
              fontFamily: "Bricolage",
              fontWeight: 800,
              fontSize: 25,
              textAlign: "center",
            }}
          >
            See you on
            <br />
            the mat.
          </div>
        )}
      </div>
      <div
        style={{
          position: "absolute",
          top: -19,
          left: 869,
          width: 38,
          height: 38,
          borderRadius: 50,
          background: c.white,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -19,
          left: 869,
          width: 38,
          height: 38,
          borderRadius: 50,
          background: c.white,
        }}
      />
    </div>
  );
}
