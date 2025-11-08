/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, inject, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../components/products-card/products-card.component'
import { ProductService } from '../../services/product/product.service'

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductsBannerComponent,
    ProductsFilterComponent,
    ProductsCardComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private productSrv = inject(ProductService)

  products = signal<any[]>([])
  loading = signal(false)

  ngOnInit() {
    this.fetch()
  }

  fetch() {
    this.loading.set(true)
    this.productSrv.getAll().subscribe({
      next: (list) => this.products.set(list),
      complete: () => {
        console.log(this.products())
        this.loading.set(false)
      },
    })
  }

  onApply() {
    this.fetch()
  }

  trackById = (_: number, p: any) => p?._id
}
