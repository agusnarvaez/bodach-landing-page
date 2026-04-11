import { TestBed } from '@angular/core/testing'
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http'
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing'

import { httpStateInterceptor } from './http-state.interceptor'
import { LoadingService } from '../services/loading/loading.service'

describe('httpStateInterceptor', () => {
  let httpMock: HttpTestingController
  let httpClient: HttpClient
  let loadingService: LoadingService

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpStateInterceptor])),
        provideHttpClientTesting(),
      ],
    })

    httpMock = TestBed.inject(HttpTestingController)
    httpClient = TestBed.inject(HttpClient)
    loadingService = TestBed.inject(LoadingService)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should call LoadingService.start() when request is made', () => {
    spyOn(loadingService, 'start').and.callThrough()

    httpClient.get('/api/test').subscribe()
    // Before flushing, start() should have been called
    expect(loadingService.start).toHaveBeenCalled()

    httpMock.expectOne('/api/test').flush({})
  })

  it('isLoading should be true while request is in flight', () => {
    httpClient.get('/api/test').subscribe()
    expect(loadingService.isLoading()).toBeTrue()
    httpMock.expectOne('/api/test').flush({})
  })

  it('should call LoadingService.stop() after a successful response', () => {
    spyOn(loadingService, 'stop').and.callThrough()

    httpClient.get('/api/test').subscribe()
    httpMock.expectOne('/api/test').flush({ ok: true })

    expect(loadingService.stop).toHaveBeenCalled()
  })

  it('isLoading should be false after a successful response', () => {
    httpClient.get('/api/test').subscribe()
    httpMock.expectOne('/api/test').flush({})
    expect(loadingService.isLoading()).toBeFalse()
  })

  it('should call LoadingService.stop() after an error response', () => {
    spyOn(loadingService, 'stop').and.callThrough()

    httpClient.get('/api/test').subscribe({ error: () => {} })
    httpMock
      .expectOne('/api/test')
      .flush('Error', { status: 500, statusText: 'Internal Server Error' })

    expect(loadingService.stop).toHaveBeenCalled()
  })

  it('isLoading should be false after an error response', () => {
    httpClient.get('/api/test').subscribe({ error: () => {} })
    httpMock
      .expectOne('/api/test')
      .flush('Error', { status: 503, statusText: 'Service Unavailable' })
    expect(loadingService.isLoading()).toBeFalse()
  })

  it('should propagate the error to subscribers', () => {
    let caughtError: unknown
    httpClient.get('/api/test').subscribe({ error: (e) => (caughtError = e) })
    httpMock
      .expectOne('/api/test')
      .flush('Error', { status: 404, statusText: 'Not Found' })
    expect(caughtError).toBeDefined()
  })
})
