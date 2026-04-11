import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'

import { ProductSkeletonComponent } from './product-skeleton.component'

describe('ProductSkeletonComponent', () => {
  let component: ProductSkeletonComponent
  let fixture: ComponentFixture<ProductSkeletonComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductSkeletonComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductSkeletonComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('items getter should return an array of length equal to count', () => {
    component.count = 4
    expect(component.items.length).toBe(4)
  })

  it('should render default 6 skeleton cards', () => {
    const cards = fixture.debugElement.queryAll(By.css('.skeleton-card'))
    expect(cards.length).toBe(6)
  })

  it('should render the correct number of cards when count is changed', () => {
    fixture.componentRef.setInput('count', 3)
    fixture.detectChanges()
    const cards = fixture.debugElement.queryAll(By.css('.skeleton-card'))
    expect(cards.length).toBe(3)
  })

  it('each skeleton card should have aria-hidden="true"', () => {
    const cards = fixture.debugElement.queryAll(By.css('.skeleton-card'))
    cards.forEach((card) => {
      expect(card.nativeElement.getAttribute('aria-hidden')).toBe('true')
    })
  })

  it('each skeleton card should contain a shimmer element', () => {
    const shimmers = fixture.debugElement.queryAll(By.css('.shimmer'))
    expect(shimmers.length).toBeGreaterThan(0)
  })
})
