import { Component, input } from '@angular/core';
import { Project } from '../data/profile';

@Component({
  selector: 'app-project-card',
  host: { class: 'card card-project' },
  template: `
    @let p = project();
    <div class="card-project__media" [class.card-project__media--brand]="p.brand">
      @if (p.brand; as b) {
        <div class="card-project__brand" [style.color]="b.color" [style.font-family]="b.font">
          <i class="card-project__brand-icon bi" [class]="'bi-' + b.icon" aria-hidden="true"></i>
          <span class="card-project__brand-name">{{ b.name }}</span>
        </div>
      } @else if (p.image) {
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
      @if (p.role || p.involvement) {
        <div class="card-project__role">
          @if (p.role) {
            <span class="card-project__role-text">
              <i class="bi bi-person-gear" aria-hidden="true"></i>{{ p.role }}
            </span>
          }
          @if (p.involvement; as level) {
            <span class="card-project__involvement" [attr.aria-label]="'Participació: ' + levels[level]"
                  [attr.title]="'Participació: ' + levels[level]">
              @for (n of [1, 2, 3]; track n) {
                <span class="card-project__bar" [class.is-on]="n <= level" aria-hidden="true"></span>
              }
              <span class="card-project__level" aria-hidden="true">{{ levels[level] }}</span>
            </span>
          }
        </div>
      }
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
  protected readonly levels: Record<number, string> = { 1: 'Puntual', 2: 'Parcial', 3: 'Principal' };
}
