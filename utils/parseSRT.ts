// utils/parseSRT.ts
export type Caption = {
  id: number;
  start: number; // in ms
  end: number;   // in ms
  text: string;
};

function timeToMs(time: string) {
  const [h, m, s] = time.split(":");
  const [sec, ms] = s.split(",");
  return (
    parseInt(h) * 3600000 +
    parseInt(m) * 60000 +
    parseInt(sec) * 1000 +
    parseInt(ms)
  );
}

export function parseSRT(srt: string): Caption[] {
  return srt
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block.split("\n").filter(Boolean);
      if (lines.length < 3) return null;
      const id = parseInt(lines[0]);
      const [start, end] = lines[1].split(" --> ").map(timeToMs);
      const text = lines.slice(2).join("\n");
      return { id, start, end, text };
    })
    .filter(Boolean) as Caption[];
}
