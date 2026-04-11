import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'

import { ProductsCardComponent } from './products-card.component'
import { ProductCard } from '../../models/product'

const mockProduct: ProductCard = {
  id: 'card-1',
  title: 'Bulon hexagonal',
  category: 'Bulones',
  materials: ['Acero', 'Inox'],
  photo: 'https://cdn.sanity.io/img.jpg',
  variants_quantity: 5,
}

describe('ProductsCardComponent', () => {
  let component: ProductsCardComponent
  let fixture: ComponentFixture<ProductsCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCardComponent],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsCardComponent)
    component = fixture.componentInstance
    component.product = mockProduct
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should display product title', () => {
    const title = fixture.debugElement.query(By.css('.title'))
    expect(title.nativeElement.textContent).toContain(mockProduct.title)
  })

  it('should display product category', () => {
    const cat = fixture.debugElement.query(By.css('.category'))
    expect(cat.nativeElement.textContent).toContain(mockProduct.category)
  })

  it('should display variants count', () => {
    const variants = fixture.debugElement.query(By.css('.variants'))
    expect(variants.nativeElement.textContent).toContain('5')
  })

  it('should start with loading skeleton visible', () => {
    expect(component.loading()).toBeTrue()
    const skeleton = fixture.debugElement.query(By.css('.skeleton'))
    expect(skeleton.nativeElement.classList).not.toContain('hide')
  })

  it('onLoad() should hide the skeleton', () => {
    component.onLoad()
    fixture.detectChanges()
    expect(component.loading()).toBeFalse()
    const skeleton = fixture.debugElement.query(By.css('.skeleton'))
    expect(skeleton.nativeElement.classList).toContain('hide')
  })

  it('photoUrl() should return product photo when available', () => {
    expect(component.photoUrl()).toBe(mockProduct.photo)
  })

  it('photoUrl() should return fallback when photo is missing', () => {
    component.product = { ...mockProduct, photo: undefined as unknown as string }
    expect(component.photoUrl()).toContain('stock.png')
  })

  it('should render an img with lazy loading', () => {
    const img = fixture.debugElement.query(By.css('img'))
    expect(img.nativeElement.getAttribute('loading')).toBe('lazy')
  })

  it('should set alt text from product title', () => {
    const img = fixture.debugElement.query(By.css('img'))
    expect(img.nativeElement.getAttribute('alt')).toBe(mockProduct.title)
  })
})
