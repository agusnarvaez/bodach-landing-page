import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ButtonComponent } from '../../../components/button/button.component'
import { ShareModalComponent } from '../../../components/share-modal/share-modal.component'

@Component({
  selector: 'app-products-banner',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, ButtonComponent, ShareModalComponent],
  templateUrl: './products-banner.component.html',
  styleUrl: './products-banner.component.css',
})
export class ProductsBannerComponent {
  shareOpen = signal(false)

  readonly catalogUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/catalogo`
    : '/catalogo'

  openShare() {
    this.shareOpen.set(true)
  }
}
