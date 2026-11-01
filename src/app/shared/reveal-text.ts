import { Component, afterNextRender, computed, input, signal } from '@angular/core';

/**
 * Text que apareix paraula a paraula (desenfocat + puja), com la portada d'Aura.
 * Els lectors de pantalla llegeixen la frase sencera del span amagat; les
 * paraules animades queden fora de l'arbre d'accessibilitat.
 */
@Component({
  selector: 'app-reveal-text',
  host: { class: 'reveal-text' },
  template: `
    <span class="visually-hidden">{{ text() }}</span>
    @for (word of words(); track $index) {
      <span
        class="reveal-text__word"
        aria-hidden="true"
        [class.is-visible]="visible()"
        [style.transition-delay.ms]="delay() + $index * step()"
      >{{ word }}</span>{{ ' ' }}
    }
  `,
})
export class RevealText {
  readonly text = input.required<string>();
  /** Retard inicial en ms. */
  readonly delay = input(100);
  /** Retard entre paraules en ms. */
  readonly step = input(80);

  protected readonly words = computed(() => this.text().split(/\s+/).filter(Boolean));
  protected readonly visible = signal(false);

  constructor() {
    afterNextRender(() => requestAnimationFrame(() => this.visible.set(true)));
  }
}
