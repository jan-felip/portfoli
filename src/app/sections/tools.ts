import { Component } from '@angular/core';
import { TOOLS } from '../data/profile';
import { InView } from '../shared/in-view';

/** Secció "Amb què treballo": una cel·la de la graella per a cada grup d'eines. */
@Component({
  selector: 'app-tools',
  imports: [InView],
  host: { class: 'region region-tools' },
  template: `
    <div class="region-tools__inner">
      <h2 class="region-tools__title">Amb què treballo</h2>
      <div class="block block-tools">
        @for (group of groups; track group.title; let i = $index) {
          <section class="block-tools__group" appInView [style.transition-delay.ms]="i * 80"
                   [attr.aria-label]="group.title">
            <h3 class="block-tools__heading">
              <i class="bi" [class]="'bi-' + group.icon" aria-hidden="true"></i>{{ group.title }}
            </h3>
            <ul class="block-tools__list">
              @for (tool of group.tools; track tool) {
                <li class="block-tools__chip">{{ tool }}</li>
              }
            </ul>
          </section>
        }
      </div>
    </div>
  `,
})
export class Tools {
  protected readonly groups = TOOLS;
}
