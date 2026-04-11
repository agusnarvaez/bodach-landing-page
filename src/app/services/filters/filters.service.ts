// Facade that delegates to FilterStateService and GroqBuilderService (SRP refactor).
// Kept for backward compatibility with existing consumers (products-filter.component.ts).
import { Injectable, inject } from '@angular/core'
export type { Filters, FilterObject } from './filter-state.service'
import { FilterStateService, FilterObject, Filters } from './filter-state.service'
import { GroqBuilderService } from './groq-builder.service'

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private state = inject(FilterStateService)
  private builder = inject(GroqBuilderService)

  get = () => this.state.get()
  add = (f: FilterObject) => this.state.add(f)
  remove = (f: FilterObject) => this.state.remove(f)
  clear = () => this.state.clear()
  isActive = (name: keyof Filters, expected?: unknown) => this.state.isActive(name, expected)

  getQuery(): string {
    return this.builder.getQuery(this.state.get())
  }

  getCardsQuery(): string {
    return this.builder.getCardsQuery(this.state.get())
  }
}
