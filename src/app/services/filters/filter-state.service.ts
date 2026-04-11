import { Injectable, signal, computed } from '@angular/core'

type Lado = 'Derecha' | 'Izquierda' | 'Ambos'

export type Filters = {
  categoryId?: string
  categorySlug?: string
  material?: string
  lado?: Lado
  orificios?: string
  q?: string
  hasPhoto?: boolean
}

export interface FilterObject {
  name: keyof Filters
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any
}

@Injectable({ providedIn: 'root' })
export class FilterStateService {
  private readonly _filters = signal<Filters>({})

  readonly filters = computed(() => this._filters())

  readonly activeCount = computed(
    () => Object.keys(this._filters()).filter((k) => this._filters()[k as keyof Filters] !== undefined).length,
  )

  get(): Filters {
    return this._filters()
  }

  add(f: FilterObject): void {
    this._filters.update((current) => ({ ...current, [f.name]: f.value }))
  }

  remove(f: FilterObject): void {
    this._filters.update((current) => {
      const next = { ...current }
      delete next[f.name]
      return next
    })
  }

  clear(): void {
    this._filters.set({})
  }

  isActive(name: keyof Filters, expected?: unknown): boolean {
    const val = this._filters()[name]
    return expected === undefined ? !!val : val === expected
  }
}
