import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../data/profile';
import { Carousel3d } from '../shared/carousel-3d';
import { InView } from '../shared/in-view';
import { ProjectCard } from './project-card';

/**
 * Panell amb projectes. Amb [carousel] fa servir el carrusel 3D (sense contorn,
 * d'un rail a l'altre i amb l'escenari de banda a banda); si no, la graella.
 * Amb [moreLink] mostra "Veure tots".
 */
@Component({
  selector: 'app-projects',
  imports: [ProjectCard, InView, RouterLink, Carousel3d],
  host: { class: 'region region-content', '[class.region-content--bare]': 'carousel()' },
  template: `
    <div class="region-content__inner">
      <section class="block block-panel" [class.block-panel--bare]="carousel()"
               [attr.aria-labelledby]="panelId() + '-title'">
        <div class="block-panel__toolbar">
          <h2 class="block-panel__title" [id]="panelId() + '-title'">{{ heading() }}</h2>
          @if (moreLink(); as link) {
            <a class="block-panel__more" [routerLink]="link">
              Veure tots <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </a>
          } @else {
            <span class="block-panel__count">{{ items().length }} {{ countLabel() }}</span>
          }
        </div>

        @if (carousel()) {
          <!-- Nom diferent del de la secció perquè les dues regions no es confonguin. -->
          <app-carousel-3d [items]="items()" [label]="'Carrusel: ' + heading()" />
        } @else {
          <div class="block-panel__grid">
            @for (project of items(); track project.title; let i = $index) {
              <app-project-card
                appInView
                [project]="project"
                [style.transition-delay.ms]="(i % 3) * 90"
              />
            }
          </div>
        }
      </section>
    </div>
  `,
})
export class Projects {
  readonly items = input.required<Project[]>();
  readonly heading = input('Projectes');
  readonly panelId = input('projectes');
  readonly countLabel = input('projectes');
  readonly moreLink = input<string>();
  /** Mostra el carrusel 3D en lloc de la graella. */
  readonly carousel = input(false);
}
