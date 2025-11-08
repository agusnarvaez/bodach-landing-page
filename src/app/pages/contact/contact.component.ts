import { FormsModule, NgForm } from '@angular/forms'
import { Component, ViewChild } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../components/button/button.component'
import { EmailService } from '../../services/email/email.service'
import { Mail } from '../../models/mail'


@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule,ButtonComponent],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})


export class ContactComponent {
  @ViewChild('myForm') myForm!: NgForm
  message: string = ''
  fullName: string = ''
  email: string = ''
  phone: string = ''
  subject: string = ''

  constructor(
    public emailService: EmailService
  ) {}

  /* sendMail = (mailToSend: Mail) => {

    this.emailService.sendEmail(mailToSend).subscribe({
      next: (response) => {
        console.log(response)
      },
      error: (error) => {
        console.log(error)
      }
    })

  } */

  onSubmit() {
    console.log(this.myForm.value)
    /* this.message = 'Mensaje enviado' */
    /* this.myForm.reset() */
  }
}
