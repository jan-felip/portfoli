import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { PROFILE } from '../data/profile';

@Component({
  selector: 'app-site-header',
  imports: [RouterLink, RouterLinkActive],
  host: { class: 'region region-header', role: 'banner' },
  template: `
    <div class="region-header__inner">
      <a class="block block-brand" routerLink="/" [attr.aria-label]="profile.name + ', inici'">
        <span class="block-brand__mark">{{ profile.initials }}</span>
      </a>

      <nav class="block block-nav" aria-label="Principal">
        @for (item of nav; track item.path) {
          <a
            class="block-nav__item"
            [routerLink]="item.path"
            routerLinkActive="is-active"
            [routerLinkActiveOptions]="{ exact: true }"
            ariaCurrentWhenActive="page"
          >{{ item.label }}</a>
        }
      </nav>

      <a class="block block-actions" [href]="'mailto:' + profile.email">
        <i class="bi bi-envelope" aria-hidden="true"></i>
        <span>Contacte</span>
      </a>
    </div>
  `,
})
export class SiteHeader {
  protected readonly profile = PROFILE;
  protected readonly nav = [
    { label: 'Inici', path: '/' },
    { label: 'Projectes', path: '/projectes' },
    { label: 'Currículum', path: '/curriculum' },
    { label: 'Sobre mi', path: '/sobre-mi' },
  ];
}
