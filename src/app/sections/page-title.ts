import { Component, input } from '@angular/core';
import { RevealText } from '../shared/reveal-text';

/** Capçalera de les pàgines interiors, amb la mateixa entrada que la portada. */
@Component({
  selector: 'app-page-title',
  imports: [RevealText],
  host: { class: 'region region-page-title' },
  template: `
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
  `,
})
export class PageTitle {
  readonly eyebrow = input('');
  readonly title = input.required<string>();
  readonly intro = input<string>();
}
