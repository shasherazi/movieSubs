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
  const blocks = srt.replace(/\r/g, "").split(/\n{2,}/);
  const captions: Caption[] = [];
  let idCounter = 0;

  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);

    if (lines.length === 0) continue;

    // Find the timestamp line (should contain -->)
    let timeLineIdx = lines.findIndex((l) => l.includes("-->"));
    if (timeLineIdx === -1) continue;

    // Try to parse the previous line as an index, otherwise auto-increment
    let id = idCounter;
    if (timeLineIdx > 0 && /^\d+$/.test(lines[timeLineIdx - 1].trim())) {
      id = parseInt(lines[timeLineIdx - 1].trim(), 10);
    }
    idCounter++;

    // Parse times
    const [start, end] = lines[timeLineIdx].split(" --> ").map(timeToMs);

    // All lines after the timestamp are text
    const textLines = lines.slice(timeLineIdx + 1);
    const text = textLines.join("\n").replace(/<[^>]+>/g, ""); // Remove HTML tags

    captions.push({ id, start, end, text });
  }

  return captions;
}
