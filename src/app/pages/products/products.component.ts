import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import { ProductsBannerComponent } from '../../sections/products/products-banner/products-banner.component'
import { ProductsFilterComponent } from '../../sections/products/products-filter/products-filter.component'
import { ProductsCardComponent } from '../../components/products-card/products-card.component'
import { ProductSkeletonComponent } from '../../components/product-skeleton/product-skeleton.component'
import { ProductService } from '../../services/product/product.service'
import { FiltersService } from '../../services/filters/filters.service'
import { ProductCard } from '../../models/product'

@Component({
  selector: 'app-products',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ProductsBannerComponent,
    ProductsFilterComponent,
    ProductsCardComponent,
    ProductSkeletonComponent,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent {
  private productSrv = inject(ProductService)
  private filtersSrv = inject(FiltersService)
  private destroyRef = inject(DestroyRef)

  products = signal<ProductCard[]>([])
  loading = signal(false)
  error = signal(false)

  ngOnInit() {
    this.fetch()
  }

  fetch() {
    this.loading.set(true)
    this.error.set(false)
    this.productSrv
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (list) => {
          this.products.set(list)
          this.loading.set(false)
        },
        error: () => {
          this.error.set(true)
          this.loading.set(false)
        },
      })
  }

  onApply() {
    this.fetch()
  }

  clearAndFetch() {
    this.filtersSrv.clear()
    this.fetch()
  }

  trackById = (_: number, p: ProductCard) => p?.id
}
