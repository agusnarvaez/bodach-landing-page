import { ChangeDetectionStrategy, Component, Input, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ButtonComponent } from '../button/button.component'
import { ProductCard } from '../../models/product'

const DEFAULT_STOCK = 'assets/products/stock.png'

@Component({
  selector: 'app-products-card',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css',
})
export class ProductsCardComponent {
  @Input() product: ProductCard | null = null
  loading = signal(true)

  photoUrl(): string {
    return this.product?.photo || DEFAULT_STOCK
  }

  onLoad() {
    this.loading.set(false)
  }
}
