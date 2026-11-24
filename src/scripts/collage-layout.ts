// =========================================
// "& More" collage layout
//
// Places the cards of a section page into columns with two goals:
//   1. Cards from the same post (a `display: spread` post) stay together:
//      every card touches another card of its post, with the main photo first.
//   2. The columns end as evenly as possible, so there's little white
//      space at the bottom of each column.
//
// How it works:
//   - Each post is a "group" of one or more cards.
//   - Groups are placed one at a time. For each group it tries every way
//     of putting its cards into neighbouring columns (all in one column,
//     side by side across 2 columns, 3 columns, ...) and picks the option
//     that keeps the columns most even while keeping the cards close.
//   - That whole process is repeated for many different orders of the
//     posts (newest first, tallest first, and shuffled orders), and the
//     arrangement with the least total white space wins. The shuffles use
//     a fixed seed, so the layout is the same on every visit.
//
// Without JavaScript the page falls back to plain CSS columns.
// =========================================

type Card = { el: HTMLElement; height: number };
type Group = { cards: Card[]; totalHeight: number };
type Layout = { columns: HTMLElement[][]; cost: number };

const GAP = 16; // px between columns, matches gap-4
const SPLIT_PENALTY = 28; // px "cost" for each extra column a group spans
const APART_PENALTY = 5000; // px "cost" if a post's photos don't all touch
const SHUFFLES = 60; // extra orders to try
const CHRONOLOGICAL_BONUS = 0.97; // others must beat newest-first by 3%

function columnCountFor(width: number): number {
  if (window.matchMedia("(min-width: 1024px)").matches) return 4;
  if (window.matchMedia("(min-width: 640px)").matches) return 3;
  return width < 260 ? 1 : 2;
}

// Small seeded random generator, so the chosen layout is stable
function seededRandom(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], random: () => number): T[] {
  const copy = items.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

type Box = { col: number; top: number; bottom: number };

/**
 * True if every card in a post touches another card from the same post:
 * stacked directly in one column, or side by side in neighbouring
 * columns with overlapping heights.
 */
function allTouching(boxes: Box[]): boolean {
  const touch = (a: Box, b: Box) =>
    (a.col === b.col && (Math.abs(a.bottom - b.top) < 1 || Math.abs(b.bottom - a.top) < 1)) ||
    (Math.abs(a.col - b.col) === 1 && a.top < b.bottom && b.top < a.bottom);
  const reached = new Set([0]);
  const queue = [0];
  while (queue.length) {
    const i = queue.pop()!;
    boxes.forEach((box, j) => {
      if (!reached.has(j) && touch(boxes[i], box)) {
        reached.add(j);
        queue.push(j);
      }
    });
  }
  return reached.size === boxes.length;
}

/** Places groups in the given order and scores the result. */
function place(groups: Group[], columnCount: number): Layout {
  const heights = new Array(columnCount).fill(0);
  const columns: HTMLElement[][] = Array.from({ length: columnCount }, () => []);
  let closenessCost = 0;

  for (const group of groups) {
    let best: { assign: number[]; heights: number[]; score: number; closeness: number } | null = null;
    const maxSpan = Math.min(group.cards.length, columnCount);

    for (let span = 1; span <= maxSpan; span++) {
      for (let start = 0; start + span <= columnCount; start++) {
        const trial = heights.slice();
        const assign: number[] = [];
        const firstTop = new Map<number, number>();
        const boxes: Box[] = [];

        // Each card goes to the shortest column within this span.
        // The first card (the main photo) is placed first.
        for (const card of group.cards) {
          let col = start;
          for (let c = start; c < start + span; c++) if (trial[c] < trial[col]) col = c;
          if (!firstTop.has(col)) firstTop.set(col, trial[col]);
          assign.push(col);
          boxes.push({ col, top: trial[col], bottom: trial[col] + card.height });
          trial[col] += card.height;
        }

        // Closeness: spanning more columns costs a little, and so does
        // the group's columns starting at very different heights.
        const tops = [...firstTop.values()];
        const misalignment = Math.max(...tops) - Math.min(...tops);
        const closeness =
          (firstTop.size - 1) * SPLIT_PENALTY +
          misalignment +
          (allTouching(boxes) ? 0 : APART_PENALTY);

        // Evenness: how far apart the tallest and shortest columns are.
        const imbalance = Math.max(...trial) - Math.min(...trial);
        const score = imbalance + closeness;

        if (!best || score < best.score) best = { assign, heights: trial, score, closeness };
      }
    }

    best!.assign.forEach((col, i) => columns[col].push(group.cards[i].el));
    heights.splice(0, columnCount, ...best!.heights);
    closenessCost += best!.closeness;
  }

  const tallest = Math.max(...heights);
  const whiteSpace = heights.reduce((sum, h) => sum + (tallest - h), 0);
  return { columns, cost: whiteSpace + closenessCost };
}

function bestLayout(groups: Group[], columnCount: number): Layout {
  // Newest first is the starting point, and wins ties
  let best = place(groups, columnCount);
  best.cost *= CHRONOLOGICAL_BONUS;

  const random = seededRandom(columnCount * 7919 + groups.length);
  const orders: Group[][] = [
    groups.slice().sort((a, b) => b.totalHeight - a.totalHeight),
    groups.slice().sort((a, b) => b.cards.length - a.cards.length),
  ];
  for (let i = 0; i < SHUFFLES; i++) orders.push(shuffled(groups, random));

  for (const order of orders) {
    const layout = place(order, columnCount);
    if (layout.cost < best.cost) best = layout;
  }
  return best;
}

function marginBottom(el: HTMLElement): number {
  return parseFloat(getComputedStyle(el).marginBottom) || 0;
}

function layoutCollage(container: HTMLElement, cards: HTMLElement[]) {
  const width = container.clientWidth;
  const columnCount = columnCountFor(width);
  const columnWidth = (width - GAP * (columnCount - 1)) / columnCount;

  // Measure every visible card at the final column width
  const measure = document.createElement("div");
  measure.style.cssText = `position:absolute;visibility:hidden;left:0;top:0;width:${columnWidth}px`;
  container.append(measure);
  const visible = cards.filter((card) => !card.hidden);
  visible.forEach((card) => measure.append(card));

  // Group cards by post, keeping the page's newest-first order
  const groups = new Map<string, Group>();
  for (const el of visible) {
    const id = el.dataset.post ?? Math.random().toString();
    const height = el.offsetHeight + marginBottom(el);
    const group = groups.get(id) ?? { cards: [], totalHeight: 0 };
    group.cards.push({ el, height });
    group.totalHeight += height;
    groups.set(id, group);
  }

  const { columns } = bestLayout([...groups.values()], columnCount);

  // Build the columns
  const wrappers = columns.map((columnCards) => {
    const column = document.createElement("div");
    column.className = "collage-column";
    column.style.cssText = "flex:1 1 0;min-width:0";
    columnCards.forEach((card) => column.append(card));
    return column;
  });
  // Hidden cards (e.g. filtered out) stay in the page, out of the way
  cards.filter((card) => card.hidden).forEach((card) => wrappers[0].append(card));

  container.replaceChildren(...wrappers);
  measure.remove();
}

export function initCollage(container: HTMLElement) {
  const cards = [...container.querySelectorAll<HTMLElement>("[data-collage-card]")];
  if (!cards.length) return;

  // Switch from the CSS-columns fallback to script-placed columns
  container.style.display = "flex";
  container.style.position = "relative";
  container.style.gap = `${GAP}px`;
  container.style.alignItems = "flex-start";
  container.style.columns = "auto";

  let lastKey = "";
  const run = (force = false) => {
    const key = `${container.clientWidth}|${cards.map((c) => (c.hidden ? 0 : 1)).join("")}`;
    if (!force && key === lastKey) return;
    lastKey = key;
    layoutCollage(container, cards);
  };

  run(true);

  // Re-arrange when the width changes, after fonts load, and when the
  // reviews filter shows or hides cards
  let frame = 0;
  new ResizeObserver(() => {
    cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => run());
  }).observe(container);
  document.fonts?.ready.then(() => run(true));
  container.addEventListener("collage:refresh", () => run(true));
}
