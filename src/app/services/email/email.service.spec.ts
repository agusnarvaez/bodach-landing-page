import { TestBed } from '@angular/core/testing'
import { HttpTestingController } from '@angular/common/http/testing'

import { EmailService } from './email.service'
import { commonAngularTestProviders } from '../../testing/common-test-providers'
import { environment } from '../../../environments/environment'
import { Mail } from '../../models/mail'

describe('EmailService', () => {
  let service: EmailService
  let httpMock: HttpTestingController

  const mockMail = new Mail(
    'ventas@bodach.com.ar',
    'test@example.com',
    'Consulta',
    'Hola, me interesa un producto.',
    '<p>Hola, me interesa un producto.</p>',
  )

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [...commonAngularTestProviders],
    })
    service = TestBed.inject(EmailService)
    httpMock = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpMock.verify()
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('sendEmail() should make a POST request to the mail API', () => {
    service.sendEmail(mockMail).subscribe()

    const req = httpMock.expectOne(`${environment.MAIL_API}/mail/send`)
    expect(req.request.method).toBe('POST')
    req.flush({ success: true })
  })

  it('sendEmail() should send the mail payload in the request body', () => {
    service.sendEmail(mockMail).subscribe()

    const req = httpMock.expectOne(`${environment.MAIL_API}/mail/send`)
    expect(req.request.body).toEqual(mockMail)
    req.flush({ success: true })
  })

  it('sendEmail() should return the response from the server', () => {
    const serverResponse = { success: true, id: 'msg-001' }
    let result: unknown

    service.sendEmail(mockMail).subscribe((r) => (result = r))

    const req = httpMock.expectOne(`${environment.MAIL_API}/mail/send`)
    req.flush(serverResponse)

    expect(result).toEqual(serverResponse)
  })

  it('sendEmail() should propagate HTTP errors', () => {
    let error: unknown

    service.sendEmail(mockMail).subscribe({ error: (e) => (error = e) })

    const req = httpMock.expectOne(`${environment.MAIL_API}/mail/send`)
    req.flush('Server Error', { status: 500, statusText: 'Internal Server Error' })

    expect(error).toBeDefined()
  })
})
