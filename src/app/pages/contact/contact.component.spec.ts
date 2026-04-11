import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing'
import { ContactComponent } from './contact.component'
import { commonAngularTestProviders } from '../../testing/common-test-providers'
import { EmailService } from '../../services/email/email.service'
import { of, throwError } from 'rxjs'
import { By } from '@angular/platform-browser'

describe('ContactComponent', () => {
  let component: ContactComponent
  let fixture: ComponentFixture<ContactComponent>
  let emailSpy: jasmine.SpyObj<EmailService>

  beforeEach(async () => {
    emailSpy = jasmine.createSpyObj('EmailService', ['sendEmail'])

    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [
        ...commonAngularTestProviders,
        { provide: EmailService, useValue: emailSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ContactComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('form should be invalid when empty', () => {
    expect(component.form.invalid).toBeTrue()
  })

  it('email field should be invalid for non-email values', () => {
    component.email.setValue('not-an-email')
    expect(component.email.invalid).toBeTrue()
  })

  it('email field should be valid for correct email', () => {
    component.email.setValue('test@example.com')
    expect(component.email.valid).toBeTrue()
  })

  it('onSubmit() should NOT call sendEmail when form is invalid', () => {
    component.onSubmit()
    expect(emailSpy.sendEmail).not.toHaveBeenCalled()
  })

  it('onSubmit() should mark all controls as touched when invalid', () => {
    component.onSubmit()
    expect(component.fullName.touched).toBeTrue()
    expect(component.email.touched).toBeTrue()
  })

  it('onSubmit() should call sendEmail when form is valid', () => {
    emailSpy.sendEmail.and.returnValue(of({}))
    fillValidForm(component)
    component.onSubmit()
    expect(emailSpy.sendEmail).toHaveBeenCalledTimes(1)
  })

  it('successful send should set sent() to true', fakeAsync(() => {
    emailSpy.sendEmail.and.returnValue(of({}))
    fillValidForm(component)
    component.onSubmit()
    tick()
    expect(component.sent()).toBeTrue()
    expect(component.sending()).toBeFalse()
  }))

  it('failed send should set sendError() to true', fakeAsync(() => {
    emailSpy.sendEmail.and.returnValue(throwError(() => new Error('Network error')))
    fillValidForm(component)
    component.onSubmit()
    tick()
    expect(component.sendError()).toBeTrue()
    expect(component.sent()).toBeFalse()
    expect(component.sending()).toBeFalse()
  }))

  it('send button should be present in template', () => {
    const btn = fixture.debugElement.query(By.css('app-button[type="submit"]'))
    expect(btn).toBeTruthy()
  })

  it('onSubmit() should build mail correctly when phone is empty', fakeAsync(() => {
    emailSpy.sendEmail.and.returnValue(of({}))
    // Fill form WITHOUT phone to cover the '' (falsy) branch in the phone ternary
    component.fullName.setValue('Juan Perez')
    component.email.setValue('juan@example.com')
    component.subject.setValue('Consulta General')
    component.message.setValue('Este es mi mensaje de consulta.')
    component.onSubmit()
    tick()
    expect(emailSpy.sendEmail).toHaveBeenCalledTimes(1)
  }))
})

function fillValidForm(component: ContactComponent) {
  component.fullName.setValue('Juan Perez')
  component.email.setValue('juan@example.com')
  component.phone.setValue('11 1234 5678')
  component.subject.setValue('Consulta General')
  component.message.setValue('Este es mi mensaje de consulta.')
}
