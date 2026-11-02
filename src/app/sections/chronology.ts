import { Component, computed, input, signal } from '@angular/core';
import { CvEntry } from '../data/profile';
import { InView } from '../shared/in-view';

export interface ChronologySource {
  /** Etiqueta del tipus d'entrada (p. ex. "Feina", "Estudis"). */
  label: string;
  icon: string;
  entries: CvEntry[];
}

interface ChronologyItem {
  year: string;
  label: string;
  icon: string;
  entry: CvEntry;
  /** Continua fins avui (sense "end"). */
  ongoing: boolean;
  /** Posició a la graella de mesos (files) i de carrils (columnes). */
  rowStart: number;
  rowEnd: number;
  colStart: number;
  colSpan: number;
}

interface ChronologyLayout {
  items: ChronologyItem[];
  /** Any a l'esquerra, a la fila d'inici de la seva primera entrada. */
  years: { year: number; row: number }[];
  /** Diamants sobre la línia, un per fila d'inici. */
  marks: { row: number; ongoing: boolean }[];
  /** Columnes de carril: perquè 1, 2 i 3 carrils es repartin exactes. */
  cols: number;
}

const monthIndex = (ym: string): number => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : a);

// Pes de cada mes a la graella (en terços de fila). Els trams llargs on només hi ha
// una targeta (o cap) es compacten: cada mes hi val QUIET_WEIGHT en lloc de MONTH_WEIGHT.
const MONTH_WEIGHT = 3;
const QUIET_WEIGHT = 1;
/** Mínim de mesos seguits "tranquils" perquè es compactin. */
const QUIET_MIN_MONTHS = 12;

/**
 * Cronologia vertical tipus calendari: cada fila és un mes, l'entrada comença a la
 * fila del seu "start" i les que coincideixen en el temps es reparteixen l'amplada
 * en carrils. Barreja feina i estudis. A mòbil es veu apilada, una targeta per fila.
 * Les entrades sense "end" (en curs) tenen el diamant ple i brillant.
 */
@Component({
  selector: 'app-chronology',
  imports: [InView],
  host: { class: 'block block-chronology' },
  template: `
    <ol class="block-chronology__list" [style.--cols]="layout().cols">
      @for (y of layout().years; track y.year) {
        <li class="block-chronology__divider" aria-hidden="true" [style.grid-row]="y.row">
          <span class="block-chronology__year">{{ y.year }}</span>
        </li>
      }
      @for (m of layout().marks; track m.row) {
        <li
          class="block-chronology__mark"
          [class.is-ongoing]="m.ongoing"
          [class.is-hover]="hoverRow() === m.row"
          aria-hidden="true"
          [style.grid-row]="m.row"
        ></li>
      }
      @for (item of layout().items; track $index) {
        <li
          class="block-chronology__entry"
          [class.is-current]="item.entry.current"
          [class.is-ongoing]="item.ongoing"
          [style.--row-start]="item.rowStart"
          [style.--row-end]="item.rowEnd"
          [style.--col-start]="item.colStart"
          [style.--col-span]="item.colSpan"
          (mouseenter)="hoverRow.set(item.rowStart)"
          (mouseleave)="hoverRow.set(null)"
          (focusin)="hoverRow.set(item.rowStart)"
          (focusout)="hoverRow.set(null)"
          appInView
        >
          <span class="block-chronology__year">{{ item.year }}</span>
          <div class="block-chronology__card">
            @if (item.entry.image) {
              <div class="block-chronology__media">
                <img
                  class="block-chronology__image"
                  [src]="item.entry.image"
                  alt=""
                  loading="lazy"
                  (error)="$any($event.target).hidden = true"
                />
              </div>
            }
            <div class="block-chronology__body">
            <p class="block-chronology__kind">
              <i class="bi" [class]="'bi-' + item.icon" aria-hidden="true"></i>{{ item.label }}
              <span class="block-chronology__period">· {{ item.entry.period }}</span>
            </p>
            <div class="block-cv__head">
              @if (item.entry.logo) {
                <img class="block-cv__logo" [src]="item.entry.logo" alt="" loading="lazy" />
              }
              <div>
                <h3 class="block-cv__role">{{ item.entry.title }}</h3>
                <p class="block-cv__place">{{ item.entry.place }}</p>
              </div>
            </div>
            @if (item.entry.description) {
              <p class="block-cv__text">{{ item.entry.description }}</p>
            }
            @if (item.entry.tasks?.length) {
              <ul class="block-cv__tasks">
                @for (task of item.entry.tasks; track $index) {
                  <li>{{ task }}</li>
                }
              </ul>
            }
            @if (item.entry.tags?.length) {
              <ul class="block-cv__chips" aria-label="Tecnologies">
                @for (tag of item.entry.tags; track tag) {
                  <li class="block-cv__chip">{{ tag }}</li>
                }
              </ul>
            }
            @if (item.entry.url) {
              <a class="block-cv__link" [href]="item.entry.url" target="_blank" rel="noopener">
                Visita la web <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
              </a>
            }
            </div>
          </div>
        </li>
      }
    </ol>
  `,
})
export class Chronology {
  readonly sources = input.required<ChronologySource[]>();

  /** Fila d'inici de l'entrada sobre la qual hi ha el ratolí: encén el seu diamant. */
  protected readonly hoverRow = signal<number | null>(null);

  protected readonly layout = computed<ChronologyLayout>(() => {
    const now = new Date();
    const nowIndex = now.getFullYear() * 12 + now.getMonth();

    const raw = this.sources().flatMap((s) =>
      s.entries.map((entry) => {
        // Sense "start" es recorre a l'any de "period" (p. ex. "2024 - 2025" -> 2024-01).
        const fallbackYear = entry.period.match(/\d{4}/)?.[0] ?? '1970';
        const start = monthIndex(entry.start ?? `${fallbackYear}-01`);
        const ongoing = !!entry.start && !entry.end;
        const end = Math.max(start, entry.end ? monthIndex(entry.end) : ongoing ? nowIndex : start);
        return { label: s.label, icon: s.icon, entry, start, end, ongoing, lane: 0, lanes: 1 };
      }),
    );
    if (!raw.length) return { items: [], years: [], marks: [], cols: 1 };

    // Primer l'inici més antic; a igualtat, la més llarga, que així ocupa el primer carril.
    raw.sort((a, b) => a.start - b.start || b.end - a.end);

    // Un grup són entrades que se solapen en el temps; dins del grup, cadascuna
    // va al primer carril lliure.
    const groups: (typeof raw)[] = [];
    let groupEnd = -1;
    for (const item of raw) {
      if (item.start > groupEnd) {
        groups.push([]);
        groupEnd = item.end;
      } else {
        groupEnd = Math.max(groupEnd, item.end);
      }
      const group = groups[groups.length - 1];
      group.push(item);
    }
    for (const group of groups) {
      const laneEnds: number[] = [];
      for (const item of group) {
        let lane = laneEnds.findIndex((end) => end < item.start);
        if (lane < 0) lane = laneEnds.length;
        laneEnds[lane] = item.end;
        item.lane = lane;
      }
      for (const item of group) item.lanes = laneEnds.length;
    }

    // Columnes = mínim comú múltiple dels carrils: 1 targeta ocupa tot, 2 la meitat, 3 un terç...
    const cols = raw.reduce((n, item) => (n * item.lanes) / gcd(n, item.lanes), 1);

    const first = Math.min(...raw.map((i) => i.start));
    const last = Math.max(...raw.map((i) => i.end));

    // Pes de cada mes. Un mes és "tranquil" si hi ha com a molt una entrada activa i
    // no hi comença ni hi acaba cap; els trams tranquils llargs es compacten.
    const span = last - first + 1;
    const active = new Array<number>(span).fill(0);
    const edge = new Array<boolean>(span).fill(false);
    for (const item of raw) {
      for (let m = item.start; m <= item.end; m++) active[m - first]++;
      edge[item.start - first] = true;
      edge[item.end - first] = true;
    }
    const isQuiet = (i: number) => active[i] <= 1 && !edge[i];
    const weight = new Array<number>(span).fill(MONTH_WEIGHT);
    for (let i = 0; i < span; ) {
      if (!isQuiet(i)) {
        i++;
        continue;
      }
      let j = i;
      while (j + 1 < span && isQuiet(j + 1)) j++;
      if (j - i + 1 >= QUIET_MIN_MONTHS) weight.fill(QUIET_WEIGHT, i, j + 1);
      i = j + 1;
    }
    // cumulative[i] = pes acumulat abans del mes i; la fila és el seu valor en fila sencera.
    const cumulative = [0];
    for (const w of weight) cumulative.push(cumulative[cumulative.length - 1] + w);
    const rowOf = (monthIdx: number) => Math.floor(cumulative[monthIdx - first] / MONTH_WEIGHT) + 1;

    const items: ChronologyItem[] = raw.map((r) => {
      const colSpan = cols / r.lanes;
      const rowStart = rowOf(r.start);
      return {
        year: String(Math.floor(r.start / 12)),
        label: r.label,
        icon: r.icon,
        entry: r.entry,
        ongoing: r.ongoing,
        rowStart,
        rowEnd: Math.max(rowOf(r.end + 1), rowStart + 1),
        colStart: r.lane * colSpan + 1,
        colSpan,
      };
    });

    // L'any només surt a l'esquerra de la primera entrada d'aquell any. Una etiqueta
    // necessita ~3 files; si en queda una massa a prop de l'anterior, se salta.
    const years: ChronologyLayout['years'] = [];
    for (const item of items) {
      const year = Number(item.year);
      const prev = years[years.length - 1];
      if (!prev || (year !== prev.year && item.rowStart - prev.row >= 3)) {
        years.push({ year, row: item.rowStart });
      }
    }

    const marks = new Map<number, boolean>();
    for (const item of items) marks.set(item.rowStart, (marks.get(item.rowStart) ?? false) || item.ongoing);

    return { items, years, marks: [...marks].map(([row, ongoing]) => ({ row, ongoing })), cols };
  });
}
