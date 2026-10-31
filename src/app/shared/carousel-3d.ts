import {
  Component,
  DestroyRef,
  ElementRef,
  afterNextRender,
  computed,
  inject,
  input,
  viewChild,
} from '@angular/core';
import { Project } from '../data/profile';
import { ProjectCard } from '../sections/project-card';

interface Slot {
  project: Project;
  /** Còpia per omplir l'anell quan hi ha poques targetes (amagada als lectors). */
  copy: boolean;
}

/** Mínim de peces a l'anell perquè el salt del final no es vegi. */
const MIN_SLOTS = 6;

/** Quant s'aparten les targetes quan es creuen al centre (fracció de la separació). */
const DODGE = 0.2;

/**
 * Carrusel 3D estil "coverflow", replicat del portfoli d'Alex Aiguadé
 * (component propi seu, sense llibreria: CSS 3D + requestAnimationFrame).
 * - Gira sol a poc a poc i s'atura amb el ratolí, el focus o el botó de pausa.
 * - Es pot arrossegar amb inèrcia, moure amb les fletxes del teclat
 *   i clicar una targeta lateral per portar-la al davant.
 */
@Component({
  selector: 'app-carousel-3d',
  imports: [ProjectCard],
  host: { class: 'carousel-3d' },
  template: `
    <div
      #stage
      class="carousel-3d__stage"
      role="region"
      aria-roledescription="carrusel"
      [attr.aria-label]="label()"
      tabindex="0"
      (keydown)="onKey($event)"
      (pointerover)="onHover($event, true)"
      (pointerleave)="onHover($event, false)"
      (pointerdown)="onDown($event)"
      (pointermove)="onMove($event)"
      (pointerup)="onUp($event)"
      (pointercancel)="onUp($event)"
      (dragstart)="$event.preventDefault()"
      (click)="onClick($event)"
      (focusin)="onFocusIn($event)"
      (focusout)="onFocusOut($event)"
    >
      <ul #track class="carousel-3d__track">
        @for (slot of slots(); track $index) {
          <li class="carousel-3d__item" [attr.aria-hidden]="slot.copy || null" [attr.inert]="slot.copy || null">
            <app-project-card [project]="slot.project" />
          </li>
        }
      </ul>
    </div>
  `,
})
export class Carousel3d {
  readonly items = input.required<Project[]>();
  readonly label = input('Projectes');
  readonly perspective = input(1050);
  /** Velocitat del gir automàtic, en targetes per segon. */
  readonly autoSpeed = input(0.11);

  protected readonly slots = computed<Slot[]>(() => {
    const list = this.items();
    if (!list.length) return [];
    const slots: Slot[] = list.map((project) => ({ project, copy: false }));
    while (slots.length < MIN_SLOTS) {
      slots.push(...list.map((project) => ({ project, copy: true })));
    }
    return slots;
  });

  private readonly stage = viewChild.required<ElementRef<HTMLElement>>('stage');
  private readonly track = viewChild.required<ElementRef<HTMLElement>>('track');

  // Estat de l'animació (fora dels senyals: canvia a cada fotograma).
  private pos = 0;
  private vel = 0;
  private auto = 0;
  private anim: { from: number; to: number; t: number; dur: number } | null = null;
  private raf = 0;
  private last = 0;
  private visible = true;
  private front = -1;
  private cardWidth = 0;
  private stageWidth = 0;
  /** Motius pels quals el gir automàtic s'atura (ratolí, focus, arrossegar...). */
  private readonly holds = new Set<string>();
  private drag: { id: number; x0: number; pos0: number; active: boolean; samples: { t: number; x: number }[] } | null = null;
  private justDragged = false;
  private buttonTimer?: ReturnType<typeof setTimeout>;
  private wheelTimer?: ReturnType<typeof setTimeout>;

  constructor() {
    const destroyRef = inject(DestroyRef);

    afterNextRender(() => {
      const stage = this.stage().nativeElement;
      this.measure();
      this.place();
      this.kick();

      const resize = new ResizeObserver(() => {
        this.measure();
        this.place();
      });
      resize.observe(stage);

      const io = new IntersectionObserver(([e]) => {
        this.visible = e.isIntersecting;
        this.kick();
      }, { rootMargin: '10% 0px' });
      io.observe(stage);

      // Lliscar en lateral amb dos dits al ratolí tàctil (trackpad) o la roda horitzontal.
      // passive: false perquè cal aturar l'scroll lateral del navegador.
      const onWheel = (e: WheelEvent) => this.onWheel(e);
      stage.addEventListener('wheel', onWheel, { passive: false });
      destroyRef.onDestroy(() => stage.removeEventListener('wheel', onWheel));

      const onVisibility = () => this.kick();
      document.addEventListener('visibilitychange', onVisibility);

      destroyRef.onDestroy(() => {
        resize.disconnect();
        io.disconnect();
        document.removeEventListener('visibilitychange', onVisibility);
        cancelAnimationFrame(this.raf);
        clearTimeout(this.buttonTimer);
        clearTimeout(this.wheelTimer);
      });
    });
  }

  // ---- Controls -------------------------------------------------------

  step(dir: number): void {
    const base = this.anim ? this.anim.to : this.pos;
    this.goTo(Math.round(base) + dir);
    this.hold('button', true);
    clearTimeout(this.buttonTimer);
    this.buttonTimer = setTimeout(() => this.hold('button', false), 2600);
  }

  protected onKey(e: KeyboardEvent): void {
    if (e.target !== this.stage().nativeElement) return;
    if (e.key === 'ArrowRight') {
      e.preventDefault();
      this.step(1);
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      this.step(-1);
    }
  }

  protected onHover(e: PointerEvent, over: boolean): void {
    if (e.pointerType !== 'mouse' || this.drag?.active) return;
    this.hold('mouse', over);
  }

  protected onFocusIn(e: FocusEvent): void {
    const target = e.target as HTMLElement;
    if (target === this.stage().nativeElement || !target.matches(':focus-visible')) return;
    const index = this.indexOf(target);
    if (index < 0) return;
    this.hold('focus', true);
    this.bringToFront(index);
  }

  protected onFocusOut(e: FocusEvent): void {
    const next = e.relatedTarget as Node | null;
    if (!next || !this.stage().nativeElement.contains(next)) this.hold('focus', false);
  }

  // ---- Lliscar amb els dits (trackpad) -----------------------------------

  private onWheel(e: WheelEvent): void {
    // Només el gest lateral; el vertical continua fent scroll a la pàgina.
    const dx = e.shiftKey && !e.deltaX ? e.deltaY : e.deltaX;
    if (Math.abs(dx) <= Math.abs(e.deltaY) && !e.shiftKey) return;
    e.preventDefault();

    const px = e.deltaMode === 1 ? dx * 16 : dx;
    this.anim = null;
    this.vel = 0;
    this.pos += px / this.dragScale();
    this.hold('wheel', true);

    // Quan el gest s'acaba, la targeta més propera s'alinea al centre.
    clearTimeout(this.wheelTimer);
    this.wheelTimer = setTimeout(() => {
      this.goTo(Math.round(this.pos), 0.45);
      this.hold('wheel', false);
    }, 140);
  }

  // ---- Arrossegar -------------------------------------------------------

  protected onDown(e: PointerEvent): void {
    if (!e.isPrimary || (e.pointerType === 'mouse' && e.button !== 0)) return;
    this.drag = { id: e.pointerId, x0: e.clientX, pos0: this.pos, active: false, samples: [] };
  }

  protected onMove(e: PointerEvent): void {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    const dx = e.clientX - d.x0;
    if (!d.active) {
      if (Math.abs(dx) < 8) return;
      d.active = true;
      d.pos0 = this.pos + dx / this.dragScale();
      this.anim = null;
      this.stage().nativeElement.setPointerCapture(e.pointerId);
      this.track().nativeElement.dataset['dragging'] = '';
      this.hold('drag', true);
    }
    this.pos = d.pos0 - dx / this.dragScale();
    d.samples.push({ t: e.timeStamp, x: e.clientX });
    if (d.samples.length > 6) d.samples.shift();
  }

  protected onUp(e: PointerEvent): void {
    const d = this.drag;
    if (!d || d.id !== e.pointerId) return;
    this.drag = null;
    if (!d.active) return;

    // Velocitat de sortida segons els darrers 120 ms del gest.
    const recent = d.samples.filter((s) => e.timeStamp - s.t < 120);
    let speed = 0;
    if (recent.length > 1) {
      const a = recent[0];
      const b = recent[recent.length - 1];
      speed = ((b.x - a.x) / Math.max(1, b.t - a.t)) * 1000;
    }
    this.vel = Math.max(-6, Math.min(6, -speed / this.dragScale()));
    this.justDragged = true;
    setTimeout(() => (this.justDragged = false), 60);
    delete this.track().nativeElement.dataset['dragging'];
    if (Math.abs(this.vel) < 0.4) this.goTo(Math.round(this.pos));
    this.hold('drag', false);
  }

  /** Un clic en una targeta lateral la porta al davant en lloc d'obrir-la. */
  protected onClick(e: MouseEvent): void {
    if (this.justDragged) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    const target = e.target as HTMLElement;
    const index = this.indexOf(target);
    if (index < 0) return;
    if (Math.abs(this.offset(index, this.pos)) > 0.1) {
      e.preventDefault();
      e.stopPropagation();
      this.bringToFront(index);
    }
  }

  // ---- Motor --------------------------------------------------------------

  private get pieces(): HTMLElement[] {
    return Array.from(this.track().nativeElement.children) as HTMLElement[];
  }

  private get count(): number {
    return this.slots().length;
  }

  private indexOf(el: HTMLElement): number {
    const item = el.closest('.carousel-3d__item');
    return item ? this.pieces.indexOf(item as HTMLElement) : -1;
  }

  /** Distància d'una peça al centre, la més curta per qualsevol costat de l'anell. */
  private offset(index: number, pos: number): number {
    const n = this.count;
    let d = (((index - pos) % n) + n) % n;
    if (d > n / 2) d -= n;
    return d;
  }

  private dragScale(): number {
    return Math.max(160, Math.min(this.cardWidth || 320, (this.stageWidth || 640) * 0.5));
  }

  private measure(): void {
    const pieces = this.pieces;
    if (!pieces.length) return;
    this.stageWidth = this.stage().nativeElement.clientWidth;
    this.cardWidth = pieces[0].offsetWidth;
    let tallest = 0;
    for (const p of pieces) tallest = Math.max(tallest, p.offsetHeight);
    this.stage().nativeElement.style.height = `${Math.round(tallest * 1.06 + 20)}px`;
  }

  /** Col·loca cada peça: es desplaça, s'allunya, gira i s'esvaeix segons la distància. */
  private place(): void {
    const pieces = this.pieces;
    if (!this.cardWidth || pieces.length !== this.count) return;
    let nearest = 0;
    let best = Infinity;
    // Separació entre peces: prou perquè la del costat només quedi mig amagada.
    const spread = Math.max(this.cardWidth * 0.5, Math.min(this.cardWidth * 0.75, this.stageWidth * 0.2));

    pieces.forEach((piece, i) => {
      const d = this.offset(i, this.pos);
      const abs = Math.abs(d);
      // Quan dues targetes es creuen al centre, s'aparten cap als costats
      // (màxim a mig camí, quan canvia quina va a sobre) i tornen a alinear-se.
      // Així el canvi de capa passa sense que es toquin i no es veu cap salt.
      const dodge = abs < 1 ? Math.sin(Math.PI * abs) * spread * DODGE : 0;
      const x = Math.sign(d) * (Math.min(abs, 2.5) * spread + dodge);
      const z = -Math.min(abs, 3) * 150;
      const rot = Math.max(-44, Math.min(44, -d * 26));
      // Les del costat es queden opaques (no es veu la de darrere a través)
      // i s'enfosqueixen; només les del fons s'esvaeixen.
      const opacity = abs < 1.6 ? 1 : Math.max(0, 1 - (abs - 1.6) * 1.1);
      const dim = 1 - Math.min(abs, 2) * 0.22;
      piece.style.filter = abs < 0.05 ? '' : `brightness(${dim.toFixed(3)})`;

      // Cada peça porta la seva perspectiva i l'escena queda plana: així mana el
      // z-index i les targetes no es travessen entre elles en girar.
      piece.style.transform =
        `translate(-50%, -50%) perspective(${this.perspective()}px) translateX(${x.toFixed(1)}px) ` +
        `translateZ(${z.toFixed(1)}px) rotateY(${rot.toFixed(1)}deg)`;
      piece.style.opacity = opacity.toFixed(3);
      piece.style.zIndex = String(Math.round(120 - abs * 20));
      piece.style.pointerEvents = abs < 0.55 || opacity > 0.3 ? '' : 'none';

      if (abs < best) {
        best = abs;
        nearest = i;
      }
    });

    if (nearest !== this.front) {
      pieces[this.front]?.removeAttribute('data-front');
      pieces[nearest].setAttribute('data-front', '');
      this.front = nearest;
    }
  }

  private readonly frame = (now: number): void => {
    this.raf = 0;
    const dt = this.last ? Math.min(0.05, (now - this.last) / 1000) : 0;
    this.last = now;

    if (dt > 0 && !this.drag?.active) {
      if (this.anim) {
        this.anim.t += dt;
        const k = Math.min(1, this.anim.t / this.anim.dur);
        const eased = 1 - (1 - k) ** 3;
        this.pos = this.anim.from + (this.anim.to - this.anim.from) * eased;
        if (k >= 1) {
          this.pos = this.anim.to;
          this.anim = null;
        }
      } else {
        // El gir automàtic arrenca i s'atura suaument; la inèrcia es frena sola.
        const target = this.holds.size ? 0 : this.autoSpeed();
        this.auto += (target - this.auto) * (1 - Math.exp(-dt / 0.5));
        this.vel *= Math.exp(-dt / 0.6);
        if (Math.abs(this.vel) < 0.002) this.vel = 0;
        this.pos += (this.auto + this.vel) * dt;
      }
    }

    const n = this.count;
    if (n) this.pos = ((this.pos % n) + n) % n;
    this.place();

    const busy =
      this.anim || this.drag?.active || this.holds.size === 0 || Math.abs(this.vel) > 0.002 || Math.abs(this.auto) > 0.002;
    if (this.visible && !document.hidden && busy) {
      this.raf = requestAnimationFrame(this.frame);
    } else {
      this.last = 0;
      this.auto = 0;
    }
  };

  private kick(): void {
    if (this.raf) return;
    this.last = 0;
    this.raf = requestAnimationFrame(this.frame);
  }

  private hold(reason: string, on: boolean): void {
    if (on) this.holds.add(reason);
    else this.holds.delete(reason);
    this.kick();
  }

  private goTo(target: number, dur = 0.5): void {
    this.vel = 0;
    this.anim = { from: this.pos, to: target, t: 0, dur };
    this.kick();
  }

  private bringToFront(index: number): void {
    const base = this.anim ? this.anim.to : this.pos;
    this.goTo(base + this.offset(index, base));
  }
}
