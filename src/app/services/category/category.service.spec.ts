import { TestBed } from '@angular/core/testing'
import { HttpTestingController } from '@angular/common/http/testing'
import { CategoryService, SanityCategory } from './category.service'
import { commonAngularTestProviders } from '../../testing/common-test-providers'
import { SANITY_BASE_URL } from '../../../environments/environment'

describe('CategoryService', () => {
  let service: CategoryService
  let httpMock: HttpTestingController

  const mockCategories: SanityCategory[] = [
    { _id: '1', title: 'Bulones', slug: { current: 'bulones' } },
    { _id: '2', title: 'Herrajes', slug: { current: 'herrajes' } },
  ]

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...commonAngularTestProviders],
    })
    service = TestBed.inject(CategoryService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('getAll() should make a GET request to Sanity API', () => {
    service.getAll().subscribe()
    const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
    expect(req.request.method).toBe('GET')
    req.flush({ result: mockCategories })
  })

  it('getAll() should return mapped categories', () => {
    let result: SanityCategory[] = []
    service.getAll().subscribe((cats) => (result = cats))
    const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
    req.flush({ result: mockCategories })
    expect(result).toEqual(mockCategories)
  })

  it('getAll() should return [] when result is null', () => {
    let result: SanityCategory[] = [{ _id: 'x', title: 'x' }]
    service.getAll().subscribe((cats) => (result = cats))
    const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
    req.flush({ result: null })
    expect(result).toEqual([])
  })

  it('getAll() should propagate HTTP errors', () => {
    let error: unknown
    service.getAll().subscribe({ error: (e) => (error = e) })
    const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
    req.flush('Server error', { status: 500, statusText: 'Internal Server Error' })
    expect(error).toBeDefined()
  })

  it('shareReplay: second subscription should not trigger another HTTP request', () => {
    // First call initializes the cached observable
    service.getAll().subscribe()
    const req = httpMock.expectOne((r) => r.url.startsWith(SANITY_BASE_URL))
    req.flush({ result: mockCategories })

    // Second call must be served from cache — no new HTTP request
    let cached: SanityCategory[] = []
    service.getAll().subscribe((cats) => (cached = cats))
    httpMock.expectNone((r) => r.url.startsWith(SANITY_BASE_URL))
    expect(cached).toEqual(mockCategories)
  })
})
