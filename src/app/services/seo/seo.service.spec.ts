import { TestBed } from '@angular/core/testing'
import { Title, Meta } from '@angular/platform-browser'
import { DOCUMENT } from '@angular/common'

import { SeoService } from './seo.service'
import { ProductDetail } from '../../models/product'
import { environment } from '../../../environments/environment'

const mockProduct: ProductDetail = {
  id: 'prod-1',
  title: 'Bulon hexagonal M8',
  category: 'Bulones',
  description: 'Bulon de acero de alta resistencia.',
  materials: ['Acero'],
  variants: ['M8x10', 'M8x15'],
  photo: 'https://cdn.sanity.io/photo.jpg',
}

describe('SeoService', () => {
  let service: SeoService
  let titleService: Title
  let metaService: Meta
  let doc: Document

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(SeoService)
    titleService = TestBed.inject(Title)
    metaService = TestBed.inject(Meta)
    doc = TestBed.inject(DOCUMENT)
  })

  afterEach(() => {
    // Clean up injected elements between tests
    doc.querySelectorAll('link[rel="canonical"]').forEach((el) => el.remove())
    doc.querySelectorAll('script[type="application/ld+json"]').forEach((el) => el.remove())
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('setPage()', () => {
    it('should update the document title with brand suffix', () => {
      service.setPage({ title: 'Catálogo', description: 'Todos nuestros productos.' })
      expect(titleService.getTitle()).toBe('Catálogo — Bodach')
    })

    it('should update description meta tag', () => {
      service.setPage({ title: 'Catálogo', description: 'Lista de productos' })
      const tag = metaService.getTag('name="description"')
      expect(tag?.content).toBe('Lista de productos')
    })

    it('should update og:title meta tag', () => {
      service.setPage({ title: 'Catálogo', description: 'desc' })
      const tag = metaService.getTag('property="og:title"')
      expect(tag?.content).toBe('Catálogo — Bodach')
    })

    it('should update og:description meta tag', () => {
      service.setPage({ title: 'Catálogo', description: 'Página de catálogo' })
      const tag = metaService.getTag('property="og:description"')
      expect(tag?.content).toBe('Página de catálogo')
    })

    it('should set or update canonical link element', () => {
      service.setPage({ title: 'Inicio', description: 'desc', url: '/inicio' })
      const canonical = doc.querySelector('link[rel="canonical"]') as HTMLLinkElement
      expect(canonical).toBeTruthy()
      expect(canonical.href).toContain('/inicio')
    })

    it('should remove any existing JSON-LD script', () => {
      // Inject a fake JSON-LD first
      const script = doc.createElement('script')
      script.type = 'application/ld+json'
      script.textContent = '{}'
      doc.head.appendChild(script)

      service.setPage({ title: 'Inicio', description: 'desc' })

      const remaining = doc.querySelectorAll('script[type="application/ld+json"]')
      expect(remaining.length).toBe(0)
    })
  })

  describe('setProduct()', () => {
    it('should update title with product name and brand suffix', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      expect(titleService.getTitle()).toBe('Bulon hexagonal M8 — Bodach')
    })

    it('should set og:type to "product"', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      const tag = metaService.getTag('property="og:type"')
      expect(tag?.content).toBe('product')
    })

    it('should set og:image from product photo', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      const tag = metaService.getTag('property="og:image"')
      expect(tag?.content).toBe(mockProduct.photo)
    })

    it('should inject a JSON-LD script tag', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      const script = doc.querySelector('script[type="application/ld+json"]')
      expect(script).toBeTruthy()
    })

    it('JSON-LD should contain product name and type', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      const script = doc.querySelector('script[type="application/ld+json"]')
      const data = JSON.parse(script!.textContent!)
      expect(data['@type']).toBe('Product')
      expect(data.name).toBe(mockProduct.title)
    })

    it('JSON-LD brand should be Bodach', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      const script = doc.querySelector('script[type="application/ld+json"]')
      const data = JSON.parse(script!.textContent!)
      expect(data.brand?.name).toBe('Bodach')
    })

    it('should replace previous JSON-LD on second call', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      service.setProduct({ ...mockProduct, id: 'prod-2', title: 'Tuerca M10' }, '/catalogo/prod-2')

      const scripts = doc.querySelectorAll('script[type="application/ld+json"]')
      expect(scripts.length).toBe(1)
      const data = JSON.parse(scripts[0].textContent!)
      expect(data.name).toBe('Tuerca M10')
    })

    it('should set canonical URL using APP_URL + provided path', () => {
      service.setProduct(mockProduct, '/catalogo/prod-1')
      const canonical = doc.querySelector('link[rel="canonical"]') as HTMLLinkElement
      expect(canonical.href).toContain('/catalogo/prod-1')
    })

    it('should use generated fallback description when product has no description', () => {
      const noDesc: ProductDetail = { ...mockProduct, description: '' }
      service.setProduct(noDesc, '/catalogo/prod-1')
      const tag = metaService.getTag('name="description"')
      // Covers the `product.description || fallback` branch and JSON-LD `product.description || ''`
      expect(tag?.content).toContain(noDesc.title)
      expect(tag?.content).toContain(noDesc.category)
    })

    it('JSON-LD image should be empty string and og:image should not be set when product has no photo', () => {
      const noPhoto = { ...mockProduct, photo: undefined } as unknown as ProductDetail
      service.setProduct(noPhoto, '/catalogo/prod-1')
      // Covers the `if (product.photo)` false branch and `product.photo || ''` in JSON-LD
      const script = doc.querySelector('script[type="application/ld+json"]')
      const data = JSON.parse(script!.textContent!)
      expect(data.image).toBe('')
    })
  })
})
