import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductsFilterComponent } from './products-filter.component'
import { commonAngularTestProviders } from '../../../testing/common-test-providers'

describe('ProductsFilterComponent', () => {
  let component: ProductsFilterComponent
  let fixture: ComponentFixture<ProductsFilterComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsFilterComponent],
      providers: [...commonAngularTestProviders],
    })
    .compileComponents()

    fixture = TestBed.createComponent(ProductsFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
