import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Project } from '../data/profile';
import { InView } from '../shared/in-view';
import { ProjectCard } from './project-card';

/**
 * Panell amb una graella de projectes. Amb [moreLink] mostra un botó
 * "Veure tots" en lloc del comptador.
 */
@Component({
  selector: 'app-projects',
  imports: [ProjectCard, InView, RouterLink],
  host: { class: 'region region-content' },
  template: `
    <div class="region-content__inner">
      <section class="block block-panel" [attr.aria-labelledby]="panelId() + '-title'">
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
  readonly items = input.required<Project[]>();
  readonly heading = input('Projectes');
  readonly panelId = input('projectes');
  readonly countLabel = input('projectes');
  readonly moreLink = input<string>();
}
