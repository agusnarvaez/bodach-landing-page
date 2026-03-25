import { TestBed } from '@angular/core/testing'

import { CategoryService } from './category.service'
import { commonAngularTestProviders } from '../../testing/common-test-providers'

describe('CategoryService', () => {
  let service: CategoryService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...commonAngularTestProviders],
    })
    service = TestBed.inject(CategoryService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
