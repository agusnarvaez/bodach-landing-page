import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms'
import { ButtonComponent } from '../../components/button/button.component'
import { EmailService } from '../../services/email/email.service'
import { Mail } from '../../models/mail'

@Component({
  selector: 'app-contact',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  private fb = inject(FormBuilder)
  private emailService = inject(EmailService)
  private destroyRef = inject(DestroyRef)

  sending = signal(false)
  sent = signal(false)
  sendError = signal(false)

  form = this.fb.nonNullable.group({
    fullName: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    subject: ['', Validators.required],
    message: ['', [Validators.required, Validators.minLength(10)]],
  })

  get fullName() { return this.form.controls.fullName }
  get email() { return this.form.controls.email }
  get phone() { return this.form.controls.phone }
  get subject() { return this.form.controls.subject }
  get message() { return this.form.controls.message }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched()
      return
    }

    const { fullName, email, phone, subject, message } = this.form.getRawValue()
    const mail = new Mail(
      'ventas@bodach.com.ar',
      email,
      subject,
      message,
      `<p><strong>De:</strong> ${fullName} (${email}${phone ? ', ' + phone : ''})</p>
       <p><strong>Asunto:</strong> ${subject}</p>
       <p><strong>Mensaje:</strong><br>${message}</p>`,
    )

    this.sending.set(true)
    this.sendError.set(false)

    this.emailService
      .sendEmail(mail)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.sent.set(true)
          this.sending.set(false)
          this.form.reset()
        },
        error: () => {
          this.sendError.set(true)
          this.sending.set(false)
        },
      })
  }
}
