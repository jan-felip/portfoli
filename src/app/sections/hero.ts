import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PROFILE } from '../data/profile';
import { RevealText } from '../shared/reveal-text';
import { Typewriter } from '../shared/typewriter';

@Component({
  selector: 'app-hero',
  imports: [RevealText, Typewriter, RouterLink],
  host: { class: 'region region-hero' },
  template: `
    <div class="region-hero__inner">
      <div class="region-hero__column">
        <div class="region-hero__row">
          <h1 class="block block-title">
            <app-reveal-text [text]="profile.name" [delay]="100" />
          </h1>
        </div>

        <div class="region-hero__row">
          <p class="block block-tagline">
            <app-reveal-text [text]="profile.tagline" [delay]="300" [step]="60" />
          </p>
        </div>

        <div class="region-hero__row region-hero__row--prompt">
          <div class="block block-prompt reveal-item" style="animation-delay: 500ms">
            <p class="block-prompt__text">
              @if (profile.rolePrefix) {
                <span class="block-prompt__prefix">{{ profile.rolePrefix }}</span>
              }
              <app-typewriter [phrases]="profile.roles" />
            </p>

            <div class="block-prompt__toolbar">
              <span class="block-prompt__chip">
                <i class="bi bi-geo-alt" aria-hidden="true"></i>{{ profile.location }}
              </span>
              @for (link of profile.links; track link.href) {
                <a class="block-prompt__icon" [href]="link.href" target="_blank" rel="noopener"
                   [attr.aria-label]="link.label" [attr.title]="link.label">
                  <i class="bi" [class]="'bi-' + link.icon" aria-hidden="true"></i>
                </a>
              }
              <a class="block-prompt__icon" routerLink="/curriculum" aria-label="Currículum" title="Currículum">
                <i class="bi bi-file-earmark-person" aria-hidden="true"></i>
              </a>
              <a class="block-prompt__send" routerLink="/projectes" aria-label="Veure projectes" title="Projectes">
                <i class="bi bi-arrow-right" aria-hidden="true"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
})
export class Hero {
  protected readonly profile = PROFILE;
}
