import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Subject } from 'rxjs'
import { By } from '@angular/platform-browser'
import { convertToParamMap } from '@angular/router'

import { ProductDetailComponent } from './product-detail.component'
import { commonAngularTestProviders } from '../../testing/common-test-providers'
import { ProductService } from '../../services/product/product.service'
import { SeoService } from '../../services/seo/seo.service'
import { ProductCard, ProductDetail } from '../../models/product'
import { ActivatedRoute } from '@angular/router'

const ROUTE_ID = 'test-product-42'

const mockDetail: ProductDetail = {
  id: ROUTE_ID,
  title: 'Bulon hexagonal M8',
  category: 'Bulones',
  description: 'Bulon de acero de alta resistencia para uso en construcción.',
  materials: ['Acero'],
  variants: ['M8x10', 'M8x15', 'M8x20'],
  photo: 'https://cdn.sanity.io/img.jpg',
}

const mockSuggested: ProductCard[] = [
  {
    id: 's1',
    title: 'Tuerca M8',
    category: 'Tuercas',
    materials: ['Acero'],
    photo: 'https://cdn.sanity.io/s1.jpg',
    variants_quantity: 2,
  },
]

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent
  let fixture: ComponentFixture<ProductDetailComponent>
  let productSpy: jasmine.SpyObj<ProductService>
  let seoSpy: jasmine.SpyObj<SeoService>
  let byIdSubject$: Subject<ProductDetail>
  let suggestedSubject$: Subject<ProductCard[]>

  beforeEach(async () => {
    byIdSubject$ = new Subject<ProductDetail>()
    suggestedSubject$ = new Subject<ProductCard[]>()

    productSpy = jasmine.createSpyObj('ProductService', ['getById', 'getSuggested'])
    productSpy.getById.and.returnValue(byIdSubject$.asObservable())
    productSpy.getSuggested.and.returnValue(suggestedSubject$.asObservable())

    seoSpy = jasmine.createSpyObj('SeoService', [
      'setPage',
      'setProduct',
      'setCanonical',
      'setProductJsonLd',
    ])

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [
        ...commonAngularTestProviders,
        { provide: ProductService, useValue: productSpy },
        { provide: SeoService, useValue: seoSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ id: ROUTE_ID }) } },
        },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges() // triggers ngOnInit → forkJoin subscribed, loading = true
  })

  /** Helper: emit on both subjects so forkJoin resolves. */
  function resolveWith(
    detail: ProductDetail,
    suggested: ProductCard[] = [],
  ): void {
    byIdSubject$.next(detail)
    byIdSubject$.complete()
    suggestedSubject$.next(suggested)
    suggestedSubject$.complete()
    fixture.detectChanges()
  }

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('ngOnInit should call getById() with the route param ID', () => {
    expect(productSpy.getById).toHaveBeenCalledWith(ROUTE_ID)
  })

  it('ngOnInit should call getSuggested() with the route param ID', () => {
    expect(productSpy.getSuggested).toHaveBeenCalledWith(ROUTE_ID)
  })

  it('forkJoin should make exactly 2 HTTP-level calls (not N+1)', () => {
    expect(productSpy.getById).toHaveBeenCalledTimes(1)
    expect(productSpy.getSuggested).toHaveBeenCalledTimes(1)
  })

  it('while loading should show loading skeleton', () => {
    // subjects have not emitted yet → loading is true
    expect(component.loading()).toBeTrue()
    const skeleton = fixture.debugElement.query(By.css('.hero--loading'))
    expect(skeleton).toBeTruthy()
  })

  it('successful load should display product title and category', () => {
    resolveWith(mockDetail)

    expect(component.loading()).toBeFalse()
    expect(component.error()).toBeFalse()

    const h1 = fixture.debugElement.query(By.css('h1'))
    expect(h1.nativeElement.textContent).toContain(mockDetail.title)

    const h2 = fixture.debugElement.query(By.css('.info h2'))
    expect(h2.nativeElement.textContent).toContain(mockDetail.category)
  })

  it('successful load should display product description', () => {
    resolveWith(mockDetail)

    const desc = fixture.debugElement.query(By.css('.info > p'))
    expect(desc.nativeElement.textContent).toContain(mockDetail.description)
  })

  it('successful load should call SeoService.setProduct()', () => {
    resolveWith(mockDetail)
    expect(seoSpy.setProduct).toHaveBeenCalledWith(mockDetail, jasmine.any(String))
  })

  it('HTTP error should set error() to true and show error state', () => {
    byIdSubject$.error(new Error('Network error'))
    fixture.detectChanges()

    expect(component.error()).toBeTrue()
    expect(component.loading()).toBeFalse()

    const errorSection = fixture.debugElement.query(By.css('.state-error'))
    expect(errorSection).toBeTruthy()
  })

  it('error state should contain a link back to catalogue', () => {
    byIdSubject$.error(new Error('Network error'))
    fixture.detectChanges()

    const backLink = fixture.debugElement.query(By.css('.state-error a'))
    expect(backLink).toBeTruthy()
  })

  it('suggested products section should render when suggestions exist', () => {
    resolveWith(mockDetail, mockSuggested)

    const section = fixture.debugElement.query(By.css('.suggested'))
    expect(section).toBeTruthy()
    const cards = fixture.debugElement.queryAll(By.css('app-products-card'))
    expect(cards.length).toBe(mockSuggested.length)
  })

  it('suggested products section should NOT render when empty', () => {
    resolveWith(mockDetail, [])

    const section = fixture.debugElement.query(By.css('.suggested'))
    expect(section).toBeNull()
  })

  it('copyUrl() should set copying() to true', () => {
    spyOn(navigator.clipboard, 'writeText').and.returnValue(Promise.resolve())
    resolveWith(mockDetail)

    component.copyUrl()
    expect(component.copying()).toBeTrue()
  })

  it('photoUrl() should return stock fallback when product is not yet loaded', () => {
    // product() is null during the loading state — covers the fallback branch
    expect(component.photoUrl()).toBe('assets/products/stock.png')
  })
})
