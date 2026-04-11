import { TestBed } from '@angular/core/testing'
import { LoadingService } from './loading.service'

describe('LoadingService', () => {
  let service: LoadingService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(LoadingService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should start with isLoading = false', () => {
    expect(service.isLoading()).toBeFalse()
  })

  it('start() should set isLoading to true', () => {
    service.start()
    expect(service.isLoading()).toBeTrue()
  })

  it('stop() after start() should set isLoading to false', () => {
    service.start()
    service.stop()
    expect(service.isLoading()).toBeFalse()
  })

  it('should remain true while multiple requests are in flight', () => {
    service.start()
    service.start()
    service.stop()
    expect(service.isLoading()).toBeTrue()
  })

  it('should become false only when all requests complete', () => {
    service.start()
    service.start()
    service.stop()
    service.stop()
    expect(service.isLoading()).toBeFalse()
  })

  it('stop() when no active requests should not go below 0', () => {
    service.stop()
    expect(service.isLoading()).toBeFalse()
  })
})
