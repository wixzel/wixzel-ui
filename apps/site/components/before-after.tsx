"use client";

import { useState } from "react";
import { Badge, Chip, Chips } from "wixzel-ui";
import { CaretLeftIcon, CaretRightIcon } from "wixzel-ui/icons";

export interface Site {
  id: string;
  name: string;
  url: string;
  /** The screenshots' shape, as a CSS aspect-ratio. Both halves share it. */
  aspect: string;
}

/**
 * One site before and after Wixzel UI. The "after" sits underneath; the
 * "before" is clipped on top up to the handle. A range input covers the whole
 * frame, so dragging, tapping and the arrow keys all move the handle.
 */
function Compare({ site }: { site: Site }) {
  const [pos, setPos] = useState(50);
  return (
    <figure className="flex flex-col gap-3">
      <div className="relative select-none overflow-hidden rounded-xl bg-card shadow-raised" style={{ aspectRatio: site.aspect }}>
        <img
          src={`/showcase/${site.id}-after.jpg`}
          alt={`${site.name} on Wixzel UI`}
          className="absolute inset-0 size-full object-cover object-top"
          draggable={false}
        />
        <img
          src={`/showcase/${site.id}-before.jpg`}
          alt={`${site.name} before Wixzel UI`}
          className="absolute inset-0 size-full object-cover object-top"
          style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
          draggable={false}
        />

        <Badge appearance="solid" className="pointer-events-none absolute start-3 top-3" style={{ opacity: pos > 12 ? 1 : 0 }}>
          Before
        </Badge>
        <Badge appearance="solid" tone="accent" className="pointer-events-none absolute end-3 top-3" style={{ opacity: pos < 88 ? 1 : 0 }}>
          After
        </Badge>

        <div aria-hidden className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-surface shadow-raised" style={{ left: `${pos}%` }}>
          <span className="absolute top-1/2 left-1/2 grid size-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-surface text-fg shadow-raised [&_svg]:size-3.5">
            <span className="flex">
              <CaretLeftIcon />
              <CaretRightIcon />
            </span>
          </span>
        </div>

        <input
          type="range"
          min={0}
          max={100}
          step={0.5}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          aria-label={`Compare ${site.name} before and after Wixzel UI`}
          className="peer absolute inset-0 size-full cursor-ew-resize opacity-0"
        />
      </div>
      <figcaption className="text-caption text-fg-subtle">
        <a href={site.url} className="underline underline-offset-[3px] hover:text-fg">
          {site.url.replace("https://", "")}
        </a>
      </figcaption>
    </figure>
  );
}

export function BeforeAfter({ sites }: { sites: Site[] }) {
  const [current, setCurrent] = useState(sites[0]!.id);
  const site = sites.find((s) => s.id === current) ?? sites[0]!;
  return (
    <div className="flex flex-col gap-5">
      <Chips type="single" value={current} onValueChange={(v) => v && setCurrent(v)} aria-label="Site">
        {sites.map((s) => (
          <Chip key={s.id} value={s.id}>
            {s.name}
          </Chip>
        ))}
      </Chips>
      {/* Keyed, so each site starts with the handle in the middle. */}
      <Compare key={site.id} site={site} />
    </div>
  );
}
