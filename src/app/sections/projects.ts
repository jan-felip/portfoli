import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROJECTS } from '../data/profile';
import { InView } from '../shared/in-view';
import { ProjectCard } from './project-card';

/**
 * Graella de projectes. Amb [featuredOnly] mostra només els destacats
 * i un enllaç cap a la pàgina de projectes.
 */
@Component({
  selector: 'app-projects',
  imports: [ProjectCard, InView, RouterLink],
  host: { class: 'region region-content' },
  template: `
    <div class="region-content__inner">
      <section class="block block-panel" [attr.aria-labelledby]="headingId()">
        <div class="block-panel__toolbar">
          <h2 class="block-panel__title" [id]="headingId()">{{ heading() }}</h2>
          @if (featuredOnly()) {
            <a class="block-panel__more" routerLink="/projectes">
              Veure tots <i class="bi bi-arrow-right" aria-hidden="true"></i>
            </a>
          } @else {
            <span class="block-panel__count">{{ items().length }} projectes</span>
          }
        </div>

        <div class="block-panel__grid">
          @for (project of items(); track project.title; let i = $index) {
            <app-project-card
              appInView
              [project]="project"
              [style.transition-delay.ms]="(i % 3) * 90"
            />
          }
        </div>
      </section>
    </div>
  `,
})
export class Projects {
  readonly featuredOnly = input(false);
  readonly heading = input('Projectes');

  protected readonly headingId = computed(() => (this.featuredOnly() ? 'destacats' : 'projectes'));
  protected readonly items = computed(() =>
    this.featuredOnly() ? PROJECTS.filter((p) => p.featured) : PROJECTS,
  );
}
