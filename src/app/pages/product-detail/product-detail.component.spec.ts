import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ProductDetailComponent } from './product-detail.component'
import { commonAngularTestProviders } from '../../testing/common-test-providers'

describe('ProductDetailComponent', () => {
  let component: ProductDetailComponent
  let fixture: ComponentFixture<ProductDetailComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      providers: [...commonAngularTestProviders],
    })
    .compileComponents()

    fixture = TestBed.createComponent(ProductDetailComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
