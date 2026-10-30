import { Component, DestroyRef, afterNextRender, computed, inject, input, signal } from '@angular/core';

/**
 * Escriu frases en bucle com el quadre de text de la portada d'Aura:
 * cada lletra entra desenfocada i, en acabar, la frase surt sencera fent fos.
 */
@Component({
  selector: 'app-typewriter',
  host: { class: 'typewriter' },
  template: `
    <span class="visually-hidden">{{ phrases().join(', ') }}</span>
    <span class="typewriter__text" [class.is-leaving]="leaving()" aria-hidden="true">
      @for (char of chars(); track $index) {
        <span class="typewriter__char">{{ char }}</span>
      }
    </span>
    <span class="typewriter__caret" aria-hidden="true"></span>
  `,
})
export class Typewriter {
  readonly phrases = input.required<string[]>();
  readonly typeSpeed = input(45);
  readonly pause = input(2200);
  /** Durada del fos de sortida (ha de coincidir amb el CSS). */
  readonly fadeOut = input(400);

  protected readonly text = signal('');
  protected readonly leaving = signal(false);
  protected readonly chars = computed(() => [...this.text()]);

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
      this.schedule(() => this.leave(), this.pause());
    } else {
      this.schedule(() => this.type(), this.typeSpeed());
    }
  }

  private leave(): void {
    this.leaving.set(true);
    this.schedule(() => {
      this.text.set('');
      this.leaving.set(false);
      this.index = (this.index + 1) % this.phrases().length;
      this.schedule(() => this.type(), 250);
    }, this.fadeOut());
  }
}
