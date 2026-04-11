import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-home-development',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './home-development.component.html',
  styleUrl: './home-development.component.css'
})
export class HomeDevelopmentComponent {

}
