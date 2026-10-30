import { Component, DestroyRef, afterNextRender, inject, input, signal } from '@angular/core';

/**
 * Escriu i esborra frases en bucle, com el quadre de text de la portada d'Aura.
 */
@Component({
  selector: 'app-typewriter',
  host: { class: 'typewriter' },
  template: `
    <span class="visually-hidden">{{ phrases().join(', ') }}</span>
    <span class="typewriter__text" aria-hidden="true">{{ text() }}</span>
    <span class="typewriter__caret" aria-hidden="true"></span>
  `,
})
export class Typewriter {
  readonly phrases = input.required<string[]>();
  readonly typeSpeed = input(55);
  readonly deleteSpeed = input(28);
  readonly pause = input(1800);

  protected readonly text = signal('');

  private timer?: ReturnType<typeof setTimeout>;
  private index = 0;

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.timer));
    afterNextRender(() => this.schedule(() => this.type(), 600));
  }

  private schedule(fn: () => void, ms: number): void {
    this.timer = setTimeout(fn, ms);
  }

  private type(): void {
    const phrase = this.phrases()[this.index] ?? '';
    const next = phrase.slice(0, this.text().length + 1);
    this.text.set(next);
    if (next === phrase) {
      this.schedule(() => this.erase(), this.pause());
    } else {
      this.schedule(() => this.type(), this.typeSpeed());
    }
  }

  private erase(): void {
    const next = this.text().slice(0, -1);
    this.text.set(next);
    if (next) {
      this.schedule(() => this.erase(), this.deleteSpeed());
    } else {
      this.index = (this.index + 1) % this.phrases().length;
      this.schedule(() => this.type(), 300);
    }
  }
}
