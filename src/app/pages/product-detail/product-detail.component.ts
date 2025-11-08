/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, RouterModule } from '@angular/router'
import { ProductService } from '../../services/product/product.service'
import { ProductsCardComponent } from '../../components/products-card/products-card.component'
import { ButtonComponent } from '../../components/button/button.component'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, ProductsCardComponent, ButtonComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute)
  private productSrv = inject(ProductService)

  product = signal<any | null>(null)
  suggested = signal<any[]>([])
  activeTab = signal<'img' | 'video' | '3d'>('img')
  copying = signal(false)
  copiedCode = signal<string | null>(null)

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') as string
    this.productSrv.getById(id).subscribe((p) => {
      console.log(p)
      this.product.set(p)
    })
    this.productSrv
      .getSuggested(id)
      .subscribe((list) => this.suggested.set(list))
  }

  photoUrl(): string {
    const p = this.product()
    return p?.photo?.asset?.url || p?.photoUrl || 'assets/products/stock.png'
  }

  copyUrl() {
    this.copying.set(true)
    navigator.clipboard.writeText(location.href).finally(() => {
      setTimeout(() => this.copying.set(false), 900)
    })
  }

  mailto() {
    const p = this.product()
    const subject = encodeURIComponent(`Consulta por ${p?.title || 'producto'}`)
    const body = encodeURIComponent(
      `Hola, me interesa el producto ${p?.title || ''} (ID: ${p?._id || ''})`,
    )
    location.href = `mailto:ventas@bodach.com.ar?subject=${subject}&body=${body}`
  }
}
