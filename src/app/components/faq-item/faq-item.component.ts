import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-faq-item',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './faq-item.component.html',
  styleUrl: './faq-item.component.css',
})
export class FaqItemComponent {
  @Input() question = ''
  @Input() answer = ''

  showAnswer = signal(false)

  toggleAnswer() {
    this.showAnswer.update((v) => !v)
  }
}
