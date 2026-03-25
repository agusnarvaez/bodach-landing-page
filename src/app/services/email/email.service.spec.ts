import { TestBed } from '@angular/core/testing'

import { EmailService } from './email.service'
import { commonAngularTestProviders } from '../../testing/common-test-providers'

describe('EmailService', () => {
  let service: EmailService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...commonAngularTestProviders],
    })
    service = TestBed.inject(EmailService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })
})
