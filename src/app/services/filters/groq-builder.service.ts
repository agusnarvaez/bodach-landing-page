import { Injectable } from '@angular/core'
import { Filters } from './filter-state.service'

@Injectable({ providedIn: 'root' })
export class GroqBuilderService {
  private esc = (v: string) => (v ?? '').replace(/"/g, '\\"')

  private buildWhere(f: Filters): string[] {
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

    return where
  }

  getQuery(f: Filters): string {
    const where = this.buildWhere(f)
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

  getCardsQuery(f: Filters): string {
    const where = this.buildWhere(f)
    const projection = `{
      "id": _id,
      title,
      "category": coalesce(category->title, ""),
      "materials": coalesce(materials, []),
      "photo": photo.asset->url,
      "variants_quantity": count(variants)
    }`
    return `*[${where.join(' && ')}]${projection} | order(title asc)`
  }
}
