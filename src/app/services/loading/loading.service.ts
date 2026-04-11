import { Injectable, signal, computed } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private _activeRequests = signal(0)

  readonly isLoading = computed(() => this._activeRequests() > 0)

  start(): void {
    this._activeRequests.update((n) => n + 1)
  }

  stop(): void {
    this._activeRequests.update((n) => Math.max(0, n - 1))
  }
}
