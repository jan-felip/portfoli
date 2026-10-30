import { Component, input } from '@angular/core';
import { InView } from '../shared/in-view';
import { RevealText } from '../shared/reveal-text';

/**
 * Capçalera de pàgina (size "lg", h1 amb entrada paraula a paraula) o
 * títol de secció dins la pàgina (size "sm", h2 que apareix en fer scroll).
 */
@Component({
  selector: 'app-page-title',
  imports: [RevealText, InView],
  host: {
    class: 'region region-page-title',
    '[class.region-page-title--sm]': 'size() === "sm"',
  },
  template: `
    @if (size() === 'lg') {
      <div class="region-page-title__inner">
        <p class="region-page-title__eyebrow reveal-item">{{ eyebrow() }}</p>
        <h1 class="region-page-title__heading">
          <app-reveal-text [text]="title()" [delay]="80" />
        </h1>
        @if (intro()) {
          <p class="region-page-title__intro">
            <app-reveal-text [text]="intro()!" [delay]="260" [step]="35" />
          </p>
        }
        <ng-content />
      </div>
    } @else {
      <div class="region-page-title__inner" appInView>
        <p class="region-page-title__eyebrow">{{ eyebrow() }}</p>
        <h2 class="region-page-title__heading">{{ title() }}</h2>
        @if (intro()) {
          <p class="region-page-title__intro">{{ intro() }}</p>
        }
      </div>
    }
  `,
})
export class PageTitle {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly intro = input<string>();
  readonly size = input<'lg' | 'sm'>('lg');
}
