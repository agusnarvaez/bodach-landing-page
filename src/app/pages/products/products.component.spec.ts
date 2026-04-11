import { ComponentFixture, TestBed } from '@angular/core/testing'
import { Subject } from 'rxjs'
import { By } from '@angular/platform-browser'

import { ProductsComponent } from './products.component'
import { commonAngularTestProviders } from '../../testing/common-test-providers'
import { ProductService } from '../../services/product/product.service'
import { FiltersService } from '../../services/filters/filters.service'
import { ProductCard } from '../../models/product'

const mockProducts: ProductCard[] = [
  {
    id: 'p1',
    title: 'Bulon hexagonal',
    category: 'Bulones',
    materials: ['Acero'],
    photo: 'https://cdn.sanity.io/img1.jpg',
    variants_quantity: 3,
  },
  {
    id: 'p2',
    title: 'Tuerca M8',
    category: 'Tuercas',
    materials: ['Acero'],
    photo: 'https://cdn.sanity.io/img2.jpg',
    variants_quantity: 2,
  },
]

describe('ProductsComponent', () => {
  let component: ProductsComponent
  let fixture: ComponentFixture<ProductsComponent>
  let productSpy: jasmine.SpyObj<ProductService>
  let filtersSpy: jasmine.SpyObj<FiltersService>
  let subject$: Subject<ProductCard[]>

  beforeEach(async () => {
    subject$ = new Subject<ProductCard[]>()

    productSpy = jasmine.createSpyObj('ProductService', ['getAll'])
    productSpy.getAll.and.returnValue(subject$.asObservable())

    filtersSpy = jasmine.createSpyObj('FiltersService', [
      'clear',
      'get',
      'add',
      'remove',
      'isActive',
      'getQuery',
      'getCardsQuery',
    ])
    filtersSpy.get.and.returnValue({})

    await TestBed.configureTestingModule({
      imports: [ProductsComponent],
      providers: [
        ...commonAngularTestProviders,
        { provide: ProductService, useValue: productSpy },
        { provide: FiltersService, useValue: filtersSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsComponent)
    component = fixture.componentInstance
    fixture.detectChanges() // triggers ngOnInit → fetch() → loading.set(true)
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('ngOnInit should call ProductService.getAll()', () => {
    expect(productSpy.getAll).toHaveBeenCalledTimes(1)
  })

  it('while loading should show skeleton and hide product cards', () => {
    // subject$ has not emitted yet → loading is still true
    expect(component.loading()).toBeTrue()
    const skeleton = fixture.debugElement.query(By.css('app-product-skeleton'))
    expect(skeleton).toBeTruthy()
    const card = fixture.debugElement.query(By.css('app-products-card'))
    expect(card).toBeNull()
  })

  it('successful load should render a card for each product', () => {
    subject$.next(mockProducts)
    fixture.detectChanges()

    const cards = fixture.debugElement.queryAll(By.css('app-products-card'))
    expect(cards.length).toBe(mockProducts.length)
    expect(component.loading()).toBeFalse()
    expect(component.error()).toBeFalse()
  })

  it('empty result should show empty-state message and no product cards', () => {
    subject$.next([])
    fixture.detectChanges()

    const emptyDiv = fixture.debugElement.query(By.css('.state-empty'))
    expect(emptyDiv).toBeTruthy()

    const cards = fixture.debugElement.queryAll(By.css('app-products-card'))
    expect(cards.length).toBe(0)
    expect(component.loading()).toBeFalse()
  })

  it('HTTP error should set error() to true and show error state', () => {
    subject$.error(new Error('Network error'))
    fixture.detectChanges()

    expect(component.error()).toBeTrue()
    expect(component.loading()).toBeFalse()

    const errorDiv = fixture.debugElement.query(By.css('.state-error'))
    expect(errorDiv).toBeTruthy()
  })

  it('retry button in error state should call getAll() again', () => {
    subject$.error(new Error('Network error'))
    fixture.detectChanges()

    const retry$ = new Subject<ProductCard[]>()
    productSpy.getAll.and.returnValue(retry$.asObservable())

    const retryBtn = fixture.debugElement.query(By.css('.state-error .retry-btn'))
    retryBtn.nativeElement.click()
    fixture.detectChanges()

    expect(productSpy.getAll).toHaveBeenCalledTimes(2)
    // New fetch started → loading again
    expect(component.loading()).toBeTrue()
    expect(component.error()).toBeFalse()
  })

  it('"Limpiar filtros" button in empty state should call FiltersService.clear() and re-fetch', () => {
    subject$.next([])
    fixture.detectChanges()

    const retry$ = new Subject<ProductCard[]>()
    productSpy.getAll.and.returnValue(retry$.asObservable())

    const clearBtn = fixture.debugElement.query(By.css('.state-empty .retry-btn'))
    clearBtn.nativeElement.click()
    fixture.detectChanges()

    expect(filtersSpy.clear).toHaveBeenCalledTimes(1)
    expect(productSpy.getAll).toHaveBeenCalledTimes(2)
  })

  it('onApply() should trigger a new fetch', () => {
    subject$.next(mockProducts)
    fixture.detectChanges()

    const retry$ = new Subject<ProductCard[]>()
    productSpy.getAll.and.returnValue(retry$.asObservable())

    component.onApply()
    fixture.detectChanges()

    expect(productSpy.getAll).toHaveBeenCalledTimes(2)
    expect(component.loading()).toBeTrue()
  })
})
