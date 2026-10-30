import { Component } from '@angular/core';
import { PROFILE } from '../data/profile';

@Component({
  selector: 'app-site-footer',
  host: { class: 'region region-footer', role: 'contentinfo' },
  template: `
    <div class="region-footer__inner">
      <div class="block block-contact">
        <p class="block-contact__eyebrow">Parlem?</p>
        <a class="block-contact__email" [href]="'mailto:' + profile.email">{{ profile.email }}</a>
      </div>

      <ul class="block block-social" aria-label="Xarxes">
        @for (link of profile.links; track link.href) {
          <li>
            <a class="block-social__link" [href]="link.href" target="_blank" rel="noopener"
               [attr.aria-label]="link.label" [attr.title]="link.label">
              <i class="bi" [class]="'bi-' + link.icon" aria-hidden="true"></i>
            </a>
          </li>
        }
      </ul>

      <p class="block block-copy">© {{ year }} {{ profile.name }}</p>
    </div>
  `,
})
export class SiteFooter {
  protected readonly profile = PROFILE;
  protected readonly year = new Date().getFullYear();
}
