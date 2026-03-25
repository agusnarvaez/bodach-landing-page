import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductsCardComponent } from './products-card.component'
import { commonAngularTestProviders } from '../../testing/common-test-providers'

describe('ProductsCardComponent', () => {
  let component: ProductsCardComponent
  let fixture: ComponentFixture<ProductsCardComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsCardComponent],
      providers: [...commonAngularTestProviders],
    })
    .compileComponents()

    fixture = TestBed.createComponent(ProductsCardComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
