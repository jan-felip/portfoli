import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  signal,
  viewChild,
} from '@angular/core';
import { CvEntry } from '../data/profile';

export interface TimelineSource {
  /** Etiqueta del tipus d'entrada (p. ex. "Feina", "Estudis"). */
  label: string;
  icon: string;
  entries: CvEntry[];
}

interface TimelineItem {
  /** Any d'inici: surt a sota del diamant i a l'any gegant del fons. */
  year: string;
  label: string;
  icon: string;
  entry: CvEntry;
  /** Continua fins avui (té "start" però no "end"). */
  ongoing: boolean;
}

const monthIndex = (ym: string): number => {
  const [y, m] = ym.split('-').map(Number);
  return y * 12 + (m - 1);
};

/** Quant sobresurt la línia per fora del primer i l'últim diamant (es difumina). */
const LINE_TAIL = 64;
/** Quant temps de velocitat (ms) s'afegeix al desplaçament en deixar anar: la inèrcia. */
const MOMENTUM_MS = 240;
/** Temps de la molla que porta la cinta fins a la targeta (s). Més baix = més ràpid. */
const SETTLE_S = 0.11;
/** Distància (px) a la targeta per considerar que la cinta ja hi ha arribat i admet un altre moviment. */
const ARRIVED_PX = 12;
/** Silenci (ms) entre esdeveniments de roda que marca el final d'un gest (la inèrcia del ratolí tàctil no compta). */
const WHEEL_GAP_MS = 220;
/** Desplaçament lateral acumulat (px) que cal per canviar de targeta amb la roda. */
const WHEEL_STEP = 24;
/** Recorregut acumulat (px) per saltar a la següent targeta sense deixar d'escrollar. */
const WHEEL_CONTINUE = 70;
/** Mida aproximada (px) d'un quadrat de la graella del fons. */
const GRID_CELL = 64;

/**
 * Cronologia horitzontal, de més recent (esquerra) a més antic (dreta).
 * - S'arrossega amb el ratolí o el dit, amb inèrcia, i s'ajusta a la targeta més propera.
 * - També es mou amb les fletxes, la roda lateral o clicant un any.
 * - Una línia taronja s'omple mentre vas enrere en el temps i els diamants s'encenen.
 *
 * Tot es calcula a cada fotograma a partir d'un sol número (el desplaçament de la cinta),
 * així l'arrossegament, la inèrcia i la línia de progrés sempre van alhora.
 */
@Component({
  selector: 'app-timeline',
  host: { class: 'block block-timeline' },
  template: `
    <section
      #stage
      class="timeline"
      tabindex="0"
      role="region"
      aria-roledescription="cronologia"
      [attr.aria-label]="label()"
      [class.is-dragging]="dragging()"
      (keydown)="onKey($event)"
      (pointerdown)="onDown($event)"
      (pointermove)="onMove($event)"
      (pointerup)="onUp($event)"
      (pointercancel)="onUp($event)"
      (dragstart)="$event.preventDefault()"
      (focusin)="onFocusIn($event)"
    >
      <div class="timeline__grid" aria-hidden="true"></div>
      <div class="timeline__spot" aria-hidden="true"></div>
      <div #ghost class="timeline__ghost" aria-hidden="true">{{ ghostYear() }}</div>

      <div class="timeline__hud" aria-hidden="true">
        <b>{{ pad(active() + 1) }}</b><span>/ {{ pad(items().length) }}</span>
      </div>

      <div class="timeline__viewport">
        <div #track class="timeline__track">
          <div #line class="timeline__line" aria-hidden="true"></div>
          <div #progress class="timeline__progress" aria-hidden="true"></div>

          <ol #list class="timeline__items">
            @for (item of items(); track $index; let i = $index) {
              <li class="timeline__item" [class.is-active]="i === active()" [class.is-ongoing]="item.ongoing">
                <button
                  type="button"
                  class="timeline__node"
                  [attr.aria-label]="'Anar a ' + item.entry.title + ', ' + item.year"
                  [attr.aria-current]="i === active() ? 'true' : null"
                  (click)="go(i)"
                >
                  <i class="timeline__dia" aria-hidden="true"></i>
                  <span class="timeline__yr">{{ item.year }}</span>
                </button>

                <article
                  class="timeline__card"
                  [class.is-open]="openIdx() === i"
                  (pointerenter)="onCardMove(i, $event)"
                  (pointermove)="onCardMove(i, $event)"
                  (pointerleave)="closeCard()"
                  (click)="onCardClick(i, $event)"
                >
                  <!-- Imatge gran per defecte; es plega cap amunt quan la targeta s'obre. -->
                  <div class="timeline__media">
                    <i class="bi timeline__ph" [class]="'bi-' + item.icon" aria-hidden="true"></i>
                    @if (item.entry.image) {
                      <img
                        class="timeline__image"
                        [src]="item.entry.image"
                        alt=""
                        loading="lazy"
                        draggable="false"
                        (error)="$any($event.target).hidden = true"
                      />
                    }
                  </div>

                  <div class="timeline__body">
                    <header class="timeline__top">
                      <span class="timeline__kind">
                        <i class="bi" [class]="'bi-' + item.icon" aria-hidden="true"></i>{{ item.label }}
                      </span>
                      <span class="timeline__period">
                        @if (item.ongoing) {
                          <i class="timeline__live" aria-hidden="true"></i>
                        }
                        <i class="bi bi-calendar3" aria-hidden="true"></i>{{ item.entry.period }}
                      </span>
                    </header>

                    <div class="timeline__who">
                      @if (item.entry.logo) {
                        <span class="timeline__logo">
                          <img [src]="item.entry.logo" alt="" loading="lazy" draggable="false" />
                        </span>
                      }
                      <div>
                        <h3 class="timeline__title">{{ item.entry.title }}</h3>
                        <p class="timeline__place">{{ item.entry.place }}</p>
                      </div>
                    </div>
                  </div>

                  <!-- Detall: només es veu quan la targeta és oberta. -->
                  <div class="timeline__more">
                    <div class="timeline__more-in">
                      @if (item.entry.description) {
                        <p class="timeline__text">{{ item.entry.description }}</p>
                      }
                      @if (item.entry.tasks?.length) {
                        <ul class="timeline__tasks">
                          @for (task of item.entry.tasks; track $index; let t = $index) {
                            <li [style.--i]="t">{{ task }}</li>
                          }
                        </ul>
                      }
                      @if (item.entry.tags?.length) {
                        <ul class="timeline__tags" aria-label="Tecnologies">
                          @for (tag of item.entry.tags; track tag) {
                            <li>{{ tag }}</li>
                          }
                        </ul>
                      }
                      @if (item.entry.url) {
                        <a
                          class="timeline__link"
                          [href]="item.entry.url"
                          target="_blank"
                          rel="noopener"
                          [attr.tabindex]="openIdx() === i ? null : -1"
                        >
                          Visita la web <i class="bi bi-arrow-up-right" aria-hidden="true"></i>
                        </a>
                      }
                    </div>
                  </div>
                </article>
              </li>
            }
          </ol>
        </div>
      </div>

      <p class="timeline__hint" [class.is-gone]="hintGone()">
        <i class="bi bi-arrow-left-right" aria-hidden="true"></i> Arrossega
      </p>
    </section>
  `,
})
export class Timeline {
  readonly sources = input.required<TimelineSource[]>();
  readonly label = input('Trajectòria');

  /** Entrades de feina i estudis barrejades, de la més recent a la més antiga. */
  protected readonly items = computed<TimelineItem[]>(() => {
    const raw = this.sources().flatMap((s) =>
      s.entries.map((entry) => {
        // Sense "start" es recorre a l'any de "period" (p. ex. "2024 - 2025" -> 2024-01).
        const fallbackYear = entry.period.match(/\d{4}/)?.[0] ?? '1970';
        const start = monthIndex(entry.start ?? `${fallbackYear}-01`);
        return { start, item: { year: String(Math.floor(start / 12)), label: s.label, icon: s.icon, entry, ongoing: !!entry.start && !entry.end } };
      }),
    );
    // Més recent primer; a igualtat de mes, la que continua fins avui va davant.
    raw.sort((a, b) => b.start - a.start || Number(b.item.ongoing) - Number(a.item.ongoing));
    return raw.map((r) => r.item);
  });

  protected readonly active = signal(0);
  protected readonly dragging = signal(false);
  /** Targeta oberta (imatge plegada i detall visible), o -1 si cap. */
  protected readonly openIdx = signal(-1);
  protected readonly hintGone = signal(false);
  protected readonly ghostYear = computed(() => this.items()[this.active()]?.year ?? '');
  protected readonly pad = (n: number): string => String(n).padStart(2, '0');

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');
  private readonly list = viewChild.required<ElementRef<HTMLElement>>('list');
  private readonly line = viewChild.required<ElementRef<HTMLElement>>('line');
  private readonly progress = viewChild.required<ElementRef<HTMLElement>>('progress');
  private readonly ghost = viewChild.required<ElementRef<HTMLElement>>('ghost');

  // Estat de l'animació (fora dels senyals: canvia a cada fotograma).
  private cur = 0; // desplaçament que es veu ara
  private target = 0; // desplaçament al qual s'acosta la molla
  private w = 0;
  private gap = 0;
  private stageW = 0;
  private raf = 0;
  private last = 0;
  private lastActive = -1;
  private touchInput = false;
  private wheelLock = 0;
  private targetIdx = 0; // targeta on va (o és) la cinta
  private diaY = 0; // centre vertical dels diamants dins la cinta
  private cell = GRID_CELL; // mida real del quadrat de la graella
  private entries: { li: HTMLElement; card: HTMLElement; node: HTMLElement }[] = [];
  private drag: {
    id: number;
    x0: number;
    start: number;
    from: number;
    active: boolean;
    samples: { t: number; x: number }[];
  } | null = null;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const stage = this.stage().nativeElement;
      this.measure();
      this.cur = this.target = this.offsetFor(0);
      this.paint();

      // La roda lateral (dos dits al ratolí tàctil) mou la cinta; la vertical segueix fent scroll.
      // Un gest = una targeta: la inèrcia que ve després no en salta cap més,
      // i a cada targeta s'hi queda com a mínim DWELL_MS.
      let lastWheel = 0;
      let prevAbs = 0;
      let acc = 0;
      let stepped = false; // ja s'ha fet un pas en aquest gest
      const onWheel = (e: WheelEvent) => {
        const now = performance.now();
        const abs = Math.abs(e.deltaX);
        // Gest nou: hi ha hagut silenci, o la velocitat torna a pujar (la inèrcia sempre baixa).
        if (now - lastWheel > WHEEL_GAP_MS || abs > prevAbs * 1.4 + 3) {
          acc = 0;
          stepped = false;
        }
        lastWheel = now;
        prevAbs = abs;
        if (abs <= Math.abs(e.deltaY)) return;
        e.preventDefault();
        // Mentre la cinta es mou no s'acumula res: cada targeta s'ha de "guanyar" un cop arribats.
        if (Math.abs(this.target - this.cur) > ARRIVED_PX) {
          acc = 0;
          return;
        }
        acc += e.deltaX;
        // Si segueixes movent els dits sense parar, passa a la següent sense haver de tornar a començar;
        // la cua d'inèrcia (poc recorregut) no arriba al llindar més alt.
        if (Math.abs(acc) < (stepped ? WHEEL_CONTINUE : WHEEL_STEP)) return;
        stepped = true;
        this.hintGone.set(true);
        this.go(this.targetIdx + Math.sign(acc));
        acc = 0;
      };
      stage.addEventListener('wheel', onWheel, { passive: false });

      const resize = new ResizeObserver(() => {
        this.measure();
        this.cur = this.target = this.offsetFor(this.targetIdx);
        this.paint();
      });
      resize.observe(stage);

      destroyRef.onDestroy(() => {
        stage.removeEventListener('wheel', onWheel);
        resize.disconnect();
        cancelAnimationFrame(this.raf);
      });
    });
  }

  // ---- Interacció ---------------------------------------------------------

  // ---- Targeta oberta ---------------------------------------------------------

  /** El cursor es mou sobre una targeta: s'obre si és l'activa i el cursor es queda quiet. */
  protected onCardMove(i: number, e: PointerEvent): void {
    this.touchInput = e.pointerType === 'touch';
    if (this.touchInput) return; // al tàctil s'obre amb un toc
    this.armOpen(i);
  }

  protected closeCard(): void {
    if (this.openIdx() !== -1) this.openIdx.set(-1);
  }

  protected onCardClick(i: number, e: MouseEvent): void {
    if ((e.target as HTMLElement).closest('a')) return;
    if (i !== this.active()) return this.go(i);
    if (this.touchInput) this.openIdx.set(this.openIdx() === i ? -1 : i);
  }

  private armOpen(i: number): void {
    if (this.openIdx() === i || i !== this.active() || this.drag?.active) return;
    // S'obre a l'instant en posar-hi el cursor (si la cinta ja ha arribat).
    // Si encara es mou, ho torna a provar quan arriba (final de la molla).
    const settled = Math.abs(this.target - this.cur) <= ARRIVED_PX;
    if (settled && this.entries[i]?.card.matches(':hover')) this.openIdx.set(i);
  }

  protected go(i: number): void {
    const n = this.items().length;
    this.closeCard();
    this.hintGone.set(true);
    this.targetIdx = Math.max(0, Math.min(n - 1, i));
    this.target = this.offsetFor(this.targetIdx);
    this.kick();
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.target !== this.stage().nativeElement) return;
    const n = this.items().length;
    if (e.key === 'Enter' || e.key === ' ') {
      // Amb el teclat, Intro obre o tanca la targeta activa.
      e.preventDefault();
      this.openIdx.set(this.openIdx() === this.active() ? -1 : this.active());
      return;
    }
    const next = { ArrowRight: this.targetIdx + 1, ArrowLeft: this.targetIdx - 1, Home: 0, End: n - 1 }[e.key];
    if (next === undefined) return;
    e.preventDefault();
    this.go(next);
  }

  /** Si es tabula a un enllaç d'una targeta fora de pantalla, la cinta hi va. */
  protected onFocusIn(e: FocusEvent): void {
    const el = e.target as HTMLElement;
    if (el === this.stage().nativeElement || !el.matches(':focus-visible')) return;
    const li = el.closest('.timeline__item');
    const i = this.entries.findIndex((entry) => entry.li === li);
    if (i < 0) return;
    if (i === this.active()) this.openIdx.set(i);
    else this.go(i);
  }

  protected onDown(e: PointerEvent): void {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    if ((e.target as HTMLElement).closest('.timeline__node')) return; // els anys fan clic, no arrossegament
    // Si la cinta encara s'està movent, l'arrossegament parteix d'on es veu ara (no del destí),
    // perquè no faci cap salt en agafar-la.
    this.target = this.cur;
    this.touchInput = e.pointerType === 'touch';
    this.drag = {
      id: e.pointerId,
      x0: e.clientX,
      start: this.cur,
      from: this.targetIdx,
      active: false,
      samples: [{ t: e.timeStamp, x: e.clientX }],
    };
  }

  protected onMove(e: PointerEvent): void {
    const stage = this.stage().nativeElement;
    const d = this.drag;
    if (!d) {
      // Llum que segueix el cursor.
      const r = stage.getBoundingClientRect();
      stage.style.setProperty('--mx', `${e.clientX - r.left}px`);
      stage.style.setProperty('--my', `${e.clientY - r.top}px`);
      return;
    }
    if (e.pointerId !== d.id) return;
    const dx = e.clientX - d.x0;
    if (!d.active) {
      if (Math.abs(dx) < 6) return;
      d.active = true;
      this.closeCard(); // només es tanca en arrossegar de debò, no en fer un simple clic
      stage.setPointerCapture(e.pointerId);
      this.dragging.set(true);
      this.hintGone.set(true);
    }
    // Resistència als extrems: només es mou una part del recorregut.
    let next = d.start + dx;
    const max = this.offsetFor(0);
    const min = this.offsetFor(this.items().length - 1);
    if (next > max) next = max + (next - max) * 0.3;
    if (next < min) next = min + (next - min) * 0.3;
    this.cur = this.target = next;
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    if (d.samples.length > 8) d.samples.shift();
    this.paint();
  }

  protected onUp(e: PointerEvent): void {
    const d = this.drag;
    if (!d || e.pointerId !== d.id) return;
    this.drag = null;
    this.dragging.set(false);
    if (!d.active) return;
    if (e.pointerType !== 'touch') this.armOpen(this.active()); // el cursor segueix sobre la targeta
    // La velocitat dels últims 100 ms decideix fins a quina targeta arrossega la inèrcia.
    const recent = d.samples.filter((s) => e.timeStamp - s.t < 100);
    let v = 0;
    if (recent.length > 1) {
      const a = recent[0];
      const b = recent[recent.length - 1];
      v = (b.x - a.x) / Math.max(1, b.t - a.t);
    }
    const projected = this.target + v * MOMENTUM_MS;
    const landed = Math.round((this.offsetFor(0) - projected) / (this.w + this.gap));
    // Com a molt una targeta per arrossegada: mai salta de dues en dues.
    this.go(Math.max(d.from - 1, Math.min(d.from + 1, landed)));
  }

  // ---- Motor --------------------------------------------------------------

  private measure(): void {
    const list = this.list().nativeElement;
    const lis = Array.from(list.children) as HTMLElement[];
    this.entries = lis.map((li) => ({
      li,
      card: li.querySelector('.timeline__card') as HTMLElement,
      node: li.querySelector('.timeline__node') as HTMLElement,
    }));
    if (!lis.length) return;
    this.w = lis[0].offsetWidth;
    this.gap = parseFloat(getComputedStyle(list).columnGap) || 0;
    const stage = this.stage().nativeElement;
    this.stageW = stage.clientWidth;

    // Centre del diamant: la línia hi passa just pel mig i la graella s'hi alinea.
    const dia = lis[0].querySelector('.timeline__dia') as HTMLElement;
    const d = dia.getBoundingClientRect();
    const dy = d.top + d.height / 2;
    this.diaY = dy - this.track().nativeElement.getBoundingClientRect().top;

    // Quadrat de la graella: divideix exactament la distància entre diamants,
    // així cada diamant cau al mig d'un quadrat.
    const pitch = this.w + this.gap;
    this.cell = pitch / Math.max(1, Math.round(pitch / GRID_CELL));
    const stageY = dy - stage.getBoundingClientRect().top;
    stage.style.setProperty('--cell', `${this.cell.toFixed(3)}px`);
    stage.style.setProperty('--gy', `${this.mod(stageY - this.cell / 2, this.cell).toFixed(2)}px`);

    this.line().nativeElement.style.top = `${(this.diaY - 0.5).toFixed(2)}px`;
    this.progress().nativeElement.style.top = `${(this.diaY - 1).toFixed(2)}px`;
  }

  private mod(a: number, b: number): number {
    return ((a % b) + b) % b;
  }

  /** Centre de la targeta i dins la cinta. */
  private centerOf(i: number): number {
    return i * (this.w + this.gap) + this.w / 2;
  }

  /** Desplaçament que deixa la targeta i al centre de l'escenari. */
  private offsetFor(i: number): number {
    return this.stageW / 2 - this.centerOf(i);
  }

  private kick(): void {
    if (this.raf) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private readonly frame = (now: number): void => {
    this.raf = 0;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0.016;
    this.last = now;
    if (!this.drag?.active) {
      // Molla exponencial: arrenca ràpid i frena suaument, sense rebotar.
      this.cur += (this.target - this.cur) * (1 - Math.exp(-dt / SETTLE_S));
      if (Math.abs(this.target - this.cur) < 0.15) this.cur = this.target;
    }
    this.paint();
    if (this.drag?.active || this.cur !== this.target) this.raf = requestAnimationFrame(this.frame);
    else {
      this.last = 0;
      // Ha arribat: si el cursor ja és sobre la targeta (p. ex. amb la roda), també s'hi pot obrir.
      if (!this.touchInput) this.armOpen(this.active());
    }
  };

  /** Pinta tot a partir de "cur": cinta, línia de progrés, diamants, escala de targetes i paral·laxi. */
  private paint(): void {
    const n = this.entries.length;
    if (!n) return;
    this.track().nativeElement.style.transform = `translate3d(${this.cur}px,0,0)`;

    const mid = this.stageW / 2 - this.cur; // punt de la cinta que ara és al centre
    const first = this.centerOf(0);
    const last = this.centerOf(n - 1);

    // La línia va del primer al darrer diamant (amb una cua que es difumina als extrems),
    // així queda centrada respecte a les targetes.
    const line = this.line().nativeElement.style;
    line.left = `${first - LINE_TAIL}px`;
    line.width = `${last - first + LINE_TAIL * 2}px`;
    const progress = this.progress().nativeElement.style;
    progress.left = `${first}px`;
    progress.width = `${Math.max(0, Math.min(last - first, mid - first))}px`;

    let nearest = 0;
    let best = Infinity;
    this.entries.forEach(({ card, node }, i) => {
      const d = Math.abs(this.centerOf(i) - mid) / (this.w + this.gap); // 0 = centrada, 1 = la veïna
      const p = Math.max(0, 1 - d);
      card.style.transform = `scale(${(0.9 + 0.1 * p).toFixed(3)})`;
      card.style.opacity = (0.3 + 0.7 * p).toFixed(3);
      node.classList.toggle('is-lit', this.centerOf(i) <= mid + 1);
      if (d < best) {
        best = d;
        nearest = i;
      }
    });
    this.setActive(nearest);

    const stage = this.stage().nativeElement;
    stage.style.setProperty('--par', ((this.cur - this.offsetFor(nearest)) * 0.3).toFixed(1));
    // La graella va enganxada a la cinta: els diamants sempre queden al mig d'un quadrat.
    const gx = this.mod(this.cur + this.centerOf(0) - this.cell / 2, this.cell);
    stage.style.setProperty('--gx', `${gx.toFixed(2)}px`);
  }

  private setActive(i: number): void {
    if (i === this.lastActive) return;
    this.lastActive = i;
    this.active.set(i);
    if (this.openIdx() !== -1 && this.openIdx() !== i) this.openIdx.set(-1);
    // Reinicia l'animació de l'any gegant.
    const ghost = this.ghost().nativeElement;
    ghost.classList.remove('swap');
    void ghost.offsetWidth;
    ghost.classList.add('swap');
  }
}
