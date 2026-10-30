import { Component, computed, inject } from '@angular/core';
import { ThemeMode, ThemeService } from './theme.service';

interface ThemeOption {
  mode: ThemeMode;
  label: string;
  icon: string;
}

/** Interruptor de tema amb tres posicions i una píndola que llisca. */
@Component({
  selector: 'app-theme-switch',
  host: { class: 'block block-theme' },
  template: `
    <div class="block-theme__track" role="radiogroup" aria-label="Tema">
      <span
        class="block-theme__thumb"
        aria-hidden="true"
        [style.transform]="'translateX(' + index() * 100 + '%)'"
      ></span>
      @for (option of options; track option.mode) {
        <button
          type="button"
          role="radio"
          class="block-theme__option"
          [class.is-active]="theme.mode() === option.mode"
          [attr.aria-checked]="theme.mode() === option.mode"
          [attr.aria-label]="option.label"
          [attr.title]="option.label"
          (click)="theme.set(option.mode)"
        >
          <i class="bi" [class]="'bi-' + option.icon" aria-hidden="true"></i>
        </button>
      }
    </div>
  `,
})
export class ThemeSwitch {
  protected readonly theme = inject(ThemeService);
  protected readonly options: ThemeOption[] = [
    { mode: 'light', label: 'Tema clar', icon: 'sun' },
    { mode: 'system', label: 'Tema del sistema', icon: 'display' },
    { mode: 'dark', label: 'Tema fosc', icon: 'moon' },
  ];
  protected readonly index = computed(() =>
    this.options.findIndex((o) => o.mode === this.theme.mode()),
  );
}
