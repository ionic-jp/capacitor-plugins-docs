import { Component, DestroyRef, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { findPlugin, pluginDocs, sectionsFor, type PluginDocs } from './docs/docs-data';

const PLUGIN_LABELS: Record<string, string> = {
  stripe: 'Stripe',
  'stripe-identity': 'Stripe Identity',
  'stripe-terminal': 'Stripe Terminal',
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly menuOpen = signal(false);
  protected readonly currentUrl = signal('/stripe');
  protected readonly plugins = pluginDocs;
  protected readonly sectionsFor = sectionsFor;
  protected readonly isIndex = computed(() => this.currentUrl().split(/[?#]/)[0] === '/');
  protected readonly activePlugin = computed(() => {
    const id = this.currentUrl().split('/').filter(Boolean)[0] ?? 'stripe';
    return findPlugin(id) ?? pluginDocs[0];
  });
  protected readonly expandedPluginId = signal(this.isIndex() ? '' : this.activePlugin().id);

  constructor() {
    const initialPath = globalThis.location?.pathname;
    const initialPluginId = initialPath?.split('/').filter(Boolean)[0];
    if (initialPath && initialPluginId && findPlugin(initialPluginId)) {
      globalThis.setTimeout(() => this.syncPlugin(initialPath));
    }
    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe((event) => {
        this.syncPlugin(event.urlAfterRedirects);
        this.menuOpen.set(false);
      });
  }

  protected pluginLabel(plugin: PluginDocs): string {
    return PLUGIN_LABELS[plugin.id] ?? plugin.name;
  }

  protected buttonId(plugin: PluginDocs): string {
    return `plugin-button-${plugin.id}`;
  }

  protected panelId(plugin: PluginDocs): string {
    return `plugin-panel-${plugin.id}`;
  }

  protected isExpanded(plugin: PluginDocs): boolean {
    return this.expandedPluginId() === plugin.id;
  }

  protected selectPlugin(plugin: PluginDocs): void {
    this.expandedPluginId.set(plugin.id);
    void this.router.navigate(['/' + plugin.id]);
  }

  private syncPlugin(url: string): void {
    this.currentUrl.set(url);
    this.expandedPluginId.set(this.isIndex() ? '' : this.activePlugin().id);
  }
}
