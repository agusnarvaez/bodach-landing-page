import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterLink, RouterModule } from '@angular/router'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-button',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterLink, RouterModule, LucideAngularModule],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
})
export class ButtonComponent {
  @Input() type: string = ''
  @Input() link: string = ''
  @Input() text: string = ''
  @Input() icon: string = ''

  isSecondary = () => this.type === 'secondary'

  buttonType = () =>
    this.isSecondary() || this.type === 'button' ? 'button' : 'submit'

  isLink = () => this.link !== ''
}
