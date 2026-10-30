import { DOCUMENT } from '@angular/common';
import { Injectable, computed, effect, inject, signal } from '@angular/core';

export type ThemeMode = 'light' | 'system' | 'dark';

const STORAGE_KEY = 'theme';

/**
 * Guarda el mode triat (clar, sistema o fosc) i posa a <html>
 * l'atribut data-theme amb el tema ja resolt.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly root = inject(DOCUMENT).documentElement;
  private readonly media = matchMedia('(prefers-color-scheme: dark)');
  private readonly systemDark = signal(this.media.matches);

  readonly mode = signal<ThemeMode>(this.readStored());
  readonly resolved = computed(() =>
    this.mode() === 'system' ? (this.systemDark() ? 'dark' : 'light') : this.mode(),
  );

  constructor() {
    this.media.addEventListener('change', (e) => this.systemDark.set(e.matches));

    effect(() => {
      this.root.dataset['theme'] = this.resolved();
      localStorage.setItem(STORAGE_KEY, this.mode());
    });
  }

  set(mode: ThemeMode): void {
    this.mode.set(mode);
  }

  private readStored(): ThemeMode {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored === 'light' || stored === 'dark' || stored === 'system' ? stored : 'system';
  }
}
