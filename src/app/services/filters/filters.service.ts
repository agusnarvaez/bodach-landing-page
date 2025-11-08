/* eslint-disable @typescript-eslint/no-explicit-any */
// services/filters/filters.service.ts
import { Injectable } from '@angular/core'
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
  value: any
}

@Injectable({ providedIn: 'root' })
export class FiltersService {
  private _filters: Filters = {}
  get = () => this._filters
  add = (f: FilterObject) => (this._filters[f.name] = f.value)
  remove = (f: FilterObject) => delete this._filters[f.name]
  clear = () => (this._filters = {})
  isActive = (name: keyof Filters, expected?: any) =>
    expected === undefined
      ? !!this._filters[name]
      : this._filters[name] === expected

  private esc = (v: string) => (v ?? '').replace(/"/g, '\\"')

  getQuery(): string {
    const f = this._filters
    const where: string[] = ['_type == "product"']

    if (f.categoryId) where.push(`category._ref == "${this.esc(f.categoryId)}"`)
    if (f.categorySlug)
      where.push(`category->slug.current == "${this.esc(f.categorySlug)}"`)
    if (f.material) where.push(`"${this.esc(f.material)}" in materials`)
    if (f.hasPhoto) where.push(`defined(photo.asset)`)

    if (f.lado) {
      where.push(
        `count(variants[].attributes[ key == "Lado" && value == "${this.esc(f.lado)}"]) > 0`,
      )
    }
    if (f.orificios) {
      where.push(
        `count(variants[].attributes[ key == "Orificios" && value == "${this.esc(f.orificios)}"]) > 0`,
      )
    }
    if (f.q) {
      const q = this.esc(f.q)
      where.push(`(
        title match "*${q}*" ||
        description match "*${q}*" ||
        count(variants[ title match "*${q}*" || code match "*${q}*" ]) > 0
      )`)
    }

    const projection = `{
      _id,
      title,
      slug,
      materials,
      description,
      "category": category->{_id, title, slug},
      "photo": photo{ asset->{ url } },
      "variants": variants[]{
        title, code,
        "photo": photo{ asset->{ url } },
        attributes[]{ key, value }
      }
    }`

    return `*[${where.join(' && ')}]${projection} | order(title asc)`
  }
}
