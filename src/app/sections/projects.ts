import { Component, DestroyRef, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../data/profile';
import { Carousel3d } from '../shared/carousel-3d';
import { InView } from '../shared/in-view';
import { ProjectCard } from './project-card';

/** Pantalla ampla: el panell del carrusel perd el contorn arrodonit. */
const DESKTOP_QUERY = '(min-width: 1100px)';

/**
 * Panell amb projectes. Amb [carousel] fa servir el carrusel 3D a l'ordinador
 * i la graella a mòbil i tauleta. Amb [moreLink] mostra "Veure tots".
 */
@Component({
  selector: 'app-projects',
  imports: [ProjectCard, InView, RouterLink, Carousel3d],
  host: { class: 'region region-content' },
  template: `
    <div class="region-content__inner">
      <section class="block block-panel" [class.block-panel--bare]="carousel() && desktop()"
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
          <app-carousel-3d [items]="items()" [label]="heading()" />
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
  /** Mostra el carrusel 3D a l'ordinador en lloc de la graella. */
  readonly carousel = input(false);

  protected readonly desktop = signal(false);

  constructor() {
    const media = matchMedia(DESKTOP_QUERY);
    this.desktop.set(media.matches);
    const onChange = (e: MediaQueryListEvent) => this.desktop.set(e.matches);
    media.addEventListener('change', onChange);
    inject(DestroyRef).onDestroy(() => media.removeEventListener('change', onChange));
  }
}
