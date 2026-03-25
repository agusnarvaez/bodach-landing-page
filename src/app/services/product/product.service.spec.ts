import { TestBed } from '@angular/core/testing'

import { ProductService } from './product.service'
import { commonAngularTestProviders } from '../../testing/common-test-providers'

describe('ProductService', () => {
  let service: ProductService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...commonAngularTestProviders],
    })
    service = TestBed.inject(ProductService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
