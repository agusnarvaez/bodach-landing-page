import { ChangeDetectionStrategy, Component, DestroyRef, inject, signal } from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import { ActivatedRoute, Router, RouterModule } from '@angular/router'
import { forkJoin } from 'rxjs'
import { ProductService } from '../../services/product/product.service'
import { ProductsCardComponent } from '../../components/products-card/products-card.component'
import { ButtonComponent } from '../../components/button/button.component'
import { SeoService } from '../../services/seo/seo.service'
import { ProductCard, ProductDetail } from '../../models/product'
import { LucideAngularModule } from 'lucide-angular'
import { ShareModalComponent } from '../../components/share-modal/share-modal.component'

@Component({
  selector: 'app-product-detail',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, RouterModule, ProductsCardComponent, ButtonComponent, LucideAngularModule, ShareModalComponent],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export class ProductDetailComponent {
  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private productSrv = inject(ProductService)
  private seoService = inject(SeoService)
  private destroyRef = inject(DestroyRef)

  product = signal<ProductDetail | null>(null)
  suggested = signal<ProductCard[]>([])
  loading = signal(true)
  error = signal(false)
  activeTab = signal<'img' | 'video' | '3d'>('img')
  shareOpen = signal(false)

  shareUrl = signal('')
  shareTitle = signal('')

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id') as string

    forkJoin([this.productSrv.getById(id), this.productSrv.getSuggested(id)])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: ([p, list]) => {
          this.product.set(p)
          this.suggested.set(list)
          this.loading.set(false)
          if (p) {
            this.seoService.setProduct(p, this.router.url)
            this.shareUrl.set(typeof window !== 'undefined' ? window.location.href : '')
            this.shareTitle.set(`${p.title} — Bodach`)
          }
        },
        error: () => {
          this.error.set(true)
          this.loading.set(false)
        },
      })
  }

  photoUrl(): string {
    const p = this.product()
    return p?.photo || 'assets/products/stock.png'
  }

  mailto() {
    const p = this.product()
    const subject = encodeURIComponent(`Consulta por ${p?.title || 'producto'}`)
    const body = encodeURIComponent(
      `Hola, me interesa el producto ${p?.title || ''} (ID: ${p?.id || ''})`,
    )
    location.href = `mailto:ventas@bodach.com.ar?subject=${subject}&body=${body}`
  }
}
