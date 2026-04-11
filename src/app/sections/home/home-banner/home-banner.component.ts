import { ChangeDetectionStrategy, Component } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-home-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './home-banner.component.html',
  styleUrl: './home-banner.component.css'
})
export class HomeBannerComponent {

}
