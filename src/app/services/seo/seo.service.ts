import { Inject, Injectable } from '@angular/core'
import { Meta, Title } from '@angular/platform-browser'
import { DOCUMENT } from '@angular/common'
import { ProductDetail } from '../../models/product'
import { environment } from '../../../environments/environment'

@Injectable({ providedIn: 'root' })
export class SeoService {
  constructor(
    private title: Title,
    private meta: Meta,
    @Inject(DOCUMENT) private doc: Document,
  ) {}

  setPage(options: { title: string; description: string; url?: string }): void {
    const fullTitle = `${options.title} — Bodach`
    const url = options.url ? `${environment.APP_URL}${options.url}` : environment.APP_URL

    this.title.setTitle(fullTitle)
    this.meta.updateTag({ name: 'description', content: options.description })
    this.meta.updateTag({ property: 'og:title', content: fullTitle })
    this.meta.updateTag({ property: 'og:description', content: options.description })
    this.meta.updateTag({ property: 'og:url', content: url })
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle })
    this.meta.updateTag({ name: 'twitter:description', content: options.description })

    this.setCanonical(url)
    this.removeJsonLd()
  }

  setProduct(product: ProductDetail, url: string): void {
    const fullTitle = `${product.title} — Bodach`
    const description = product.description || `${product.title} — ${product.category}. Disponible en Bodach.`
    const canonicalUrl = `${environment.APP_URL}${url}`

    this.title.setTitle(fullTitle)
    this.meta.updateTag({ name: 'description', content: description })
    this.meta.updateTag({ property: 'og:title', content: fullTitle })
    this.meta.updateTag({ property: 'og:description', content: description })
    this.meta.updateTag({ property: 'og:url', content: canonicalUrl })
    this.meta.updateTag({ property: 'og:type', content: 'product' })
    if (product.photo) {
      this.meta.updateTag({ property: 'og:image', content: product.photo })
      this.meta.updateTag({ name: 'twitter:image', content: product.photo })
    }
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle })
    this.meta.updateTag({ name: 'twitter:description', content: description })

    this.setCanonical(canonicalUrl)
    this.setProductJsonLd(product, canonicalUrl)
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]')
    if (!link) {
      link = this.doc.createElement('link')
      link.setAttribute('rel', 'canonical')
      this.doc.head.appendChild(link)
    }
    link.setAttribute('href', url)
  }

  private removeJsonLd(): void {
    const existing = this.doc.querySelector('script[type="application/ld+json"]')
    if (existing) existing.remove()
  }

  private setProductJsonLd(product: ProductDetail, url: string): void {
    this.removeJsonLd()
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.title,
      description: product.description || '',
      image: product.photo || '',
      url,
      brand: {
        '@type': 'Brand',
        name: 'Bodach',
      },
      manufacturer: {
        '@type': 'Organization',
        name: 'Bodach',
        url: environment.APP_URL,
      },
    }

    const script = this.doc.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(schema)
    this.doc.head.appendChild(script)
  }
}
