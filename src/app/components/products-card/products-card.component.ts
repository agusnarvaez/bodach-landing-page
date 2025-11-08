/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Input } from '@angular/core'
import { CommonModule } from '@angular/common'
import { RouterModule } from '@angular/router'
import { ButtonComponent } from "../button/button.component";

const DEFAULT_STOCK = 'assets/products/stock.png'
const FALLBACK_SVG = `data:image/svg+xml;utf8,
<svg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'>
  <rect width='100%' height='100%' fill='%23eee8e3'/>
  <g fill='%238a7a6f' font-family='sans-serif'>
    <text x='50%' y='50%' text-anchor='middle' font-size='24'>Imagen no disponible</text>
  </g>
</svg>`

@Component({
  selector: 'app-products-card',
  standalone: true,
  imports: [CommonModule, RouterModule, ButtonComponent],
  templateUrl: './products-card.component.html',
  styleUrl: './products-card.component.css',
})
export class ProductsCardComponent {
  @Input() product: any
  loading = true

  photoUrl(p: any): string {
    return p?.photo?.asset?.url || DEFAULT_STOCK
  }

  onLoad() {
    this.loading = false
  }

  variantsQty(): number {
    return this.product?.variants?.length || 0
  }
}
