import { TestBed } from '@angular/core/testing'
import { HttpTestingController } from '@angular/common/http/testing'
import { ProductService } from './product.service'
import { commonAngularTestProviders } from '../../testing/common-test-providers'
import { SANITY_BASE_URL } from '../../../environments/environment'
import { ProductCard, ProductDetail } from '../../models/product'

describe('ProductService', () => {
  let service: ProductService
  let httpMock: HttpTestingController

  const mockCard: ProductCard = {
    id: 'p1',
    title: 'Bulon hexagonal',
    category: 'Bulones',
    materials: ['Acero'],
    photo: 'https://cdn.sanity.io/img.jpg',
    variants_quantity: 3,
  }

  const mockDetail: ProductDetail = {
    id: 'p1',
    title: 'Bulon hexagonal',
    category: 'Bulones',
    description: 'Bulon de acero para construcción',
    materials: ['Acero'],
    variants: ['M6x10', 'M8x15'],
    photo: 'https://cdn.sanity.io/img.jpg',
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...commonAngularTestProviders],
    })
    service = TestBed.inject(ProductService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getAll()', () => {
    it('should make a GET request to Sanity API', () => {
      service.getAll().subscribe()
      const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
      expect(req.request.method).toBe('GET')
      req.flush({ result: [mockCard] })
    })

    it('should map result to ProductCard[]', () => {
      let result: ProductCard[] = []
      service.getAll().subscribe((p) => (result = p))
      const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
      req.flush({ result: [mockCard] })
      expect(result).toEqual([mockCard])
    })

    it('should return [] when result is null', () => {
      let result: ProductCard[] = [mockCard]
      service.getAll().subscribe((p) => (result = p))
      const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
      req.flush({ result: null })
      expect(result).toEqual([])
    })

    it('should propagate HTTP errors', () => {
      let error: unknown
      service.getAll().subscribe({ error: (e) => (error = e) })
      const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
      req.flush('Error', { status: 503, statusText: 'Service Unavailable' })
      expect(error).toBeDefined()
    })
  })

  describe('getById()', () => {
    it('should include the product ID in the GROQ query', () => {
      service.getById('p1').subscribe()
      const req = httpMock.expectOne((r) => r.url.includes('p1'))
      expect(req.request.method).toBe('GET')
      req.flush({ result: mockDetail })
    })

    it('should return the product detail', () => {
      let result: ProductDetail | undefined
      service.getById('p1').subscribe((p) => (result = p))
      const req = httpMock.expectOne((r) => r.url.includes('p1'))
      req.flush({ result: mockDetail })
      expect(result).toEqual(mockDetail)
    })
  })

  describe('getSuggested()', () => {
    it('should make exactly ONE HTTP call (not N+1)', () => {
      service.getSuggested('p1').subscribe()
      const reqs = httpMock.match((r) => r.url.startsWith(SANITY_BASE_URL))
      expect(reqs.length).toBe(1)
      reqs[0].flush({ result: [mockCard] })
    })

    it('should return ProductCard[]', () => {
      let result: ProductCard[] = []
      service.getSuggested('p1').subscribe((p) => (result = p))
      const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
      req.flush({ result: [mockCard] })
      expect(result).toEqual([mockCard])
    })

    it('should return [] when result is null', () => {
      let result: ProductCard[] = [mockCard]
      service.getSuggested('p1').subscribe((p) => (result = p))
      const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
      req.flush({ result: null })
      expect(result).toEqual([])
    })
  })
})
