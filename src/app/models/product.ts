// models/product.ts
export interface SanityAttribute {
  key: string
  value: string
}

export interface SanityVariant {
  title: string
  code: string
  photo?: { asset: { url: string } }
  attributes: SanityAttribute[]
}

export interface SanityProduct {
  _id: string
  title: string
  slug?: { current: string }
  materials?: string[]
  description?: string
  category?: { _id: string; title: string; slug?: { current: string } } // vendrá dereferenciada
  photo?: { asset: { url: string } }
  variants?: SanityVariant[]
}

// Un modelo plano para tu UI
export class Product {
  id = ''
  title = ''
  slug = ''
  categoryId = ''
  categoryTitle = ''
  materials: string[] = []
  description = ''
  photo = ''
  variants: SanityVariant[] = []

  fromSanity(p: SanityProduct) {
    this.id = p._id
    this.title = p.title
    this.slug = p.slug?.current ?? ''
    this.categoryId = p.category?._id ?? ''
    this.categoryTitle = p.category?.title ?? ''
    this.materials = p.materials ?? []
    this.description = p.description ?? ''
    this.photo = p.photo?.asset?.url ?? ''
    this.variants = p.variants ?? []
    return this
  }
}

export interface ProductCard {
  id: string
  title: string
  category: string
  materials: string[]
  photo: string
  variants_quantity: number
}
export interface ProductDetail {
  id: string
  title: string
  category: string
  description: string
  materials: string[]
  variants: string[]
  photo: string
}
