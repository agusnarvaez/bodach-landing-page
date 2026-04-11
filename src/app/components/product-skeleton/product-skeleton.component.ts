import { ChangeDetectionStrategy, Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'

@Component({
  selector: 'app-product-skeleton',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule],
  templateUrl: './product-skeleton.component.html',
  styleUrl: './product-skeleton.component.css',
})
export class ProductSkeletonComponent {
  @Input() count = 6

  get items(): number[] {
    return Array.from({ length: this.count }, (_, i) => i)
  }
}
