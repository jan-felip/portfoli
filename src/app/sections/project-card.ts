import { Component, input } from '@angular/core';
import { Project } from '../data/profile';

@Component({
  selector: 'app-project-card',
  host: { class: 'card card-project' },
  template: `
    @let p = project();
    <div class="card-project__media">
      @if (p.image) {
        <img class="card-project__image" [src]="p.image" [alt]="p.title" loading="lazy" />
      } @else {
        <i class="card-project__icon bi" [class]="'bi-' + p.icon" aria-hidden="true"></i>
      }
      <ul class="card-project__tags" aria-label="Tecnologies">
        @for (tag of p.tags; track tag) {
          <li class="card-project__tag">{{ tag }}</li>
        }
      </ul>
    </div>

    <div class="card-project__body">
      <h3 class="card-project__title">{{ p.title }}</h3>
      <p class="card-project__text">{{ p.description }}</p>
      <div class="card-project__meta">
        <span class="card-project__year">{{ p.year }}</span>
        <span class="card-project__links">
          @if (p.repo) {
            <a [href]="p.repo" target="_blank" rel="noopener" [attr.aria-label]="'Codi de ' + p.title">
              <i class="bi bi-github" aria-hidden="true"></i>
            </a>
          }
          @if (p.url) {
            <a [href]="p.url" target="_blank" rel="noopener" [attr.aria-label]="'Obrir ' + p.title">
              <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>
            </a>
          }
        </span>
      </div>
    </div>
  `,
})
export class ProjectCard {
  readonly project = input.required<Project>();
}
