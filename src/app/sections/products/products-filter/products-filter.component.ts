import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  Input,
  Output,
  signal,
  inject,
} from '@angular/core'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop'
import { CommonModule } from '@angular/common'
import {
  CategoryService,
  SanityCategory,
} from '../../../services/category/category.service'
import {
  FiltersService,
  Filters,
} from '../../../services/filters/filters.service'
import { FormsModule } from '@angular/forms'
import { ButtonComponent } from '../../../components/button/button.component'

type Lado = 'Derecha' | 'Izquierda' | 'Ambos'

@Component({
  selector: 'app-products-filter',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, FormsModule, ButtonComponent],
  templateUrl: './products-filter.component.html',
  styleUrl: './products-filter.component.css',
})
export class ProductsFilterComponent {
  @Input() compact = false
  @Output() apply = new EventEmitter<Filters>()

  private categoriesSrv = inject(CategoryService)
  private filtersSrv = inject(FiltersService)
  private destroyRef = inject(DestroyRef)

  categories = signal<SanityCategory[]>([])
  selectedCategoryId: string | undefined
  q = ''
  material = ''
  lado: Lado | '' = ''
  orificios = ''
  hasPhoto = false

  ngOnInit() {
    this.categoriesSrv
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((cs) => this.categories.set(cs))

    const f = this.filtersSrv.get()
    this.selectedCategoryId = f.categoryId
    this.q = f.q || ''
    this.material = f.material || ''
    this.lado = (f.lado || '') as Lado | ''
    this.orificios = f.orificios || ''
    this.hasPhoto = !!f.hasPhoto
  }

  clearAll() {
    this.selectedCategoryId = undefined
    this.q = ''
    this.material = ''
    this.lado = ''
    this.orificios = ''
    this.hasPhoto = false
    this.filtersSrv.clear()
    this.apply.emit(this.filtersSrv.get())
  }

  onApply() {
    this.filtersSrv.clear()

    if (this.selectedCategoryId)
      this.filtersSrv.add({ name: 'categoryId', value: this.selectedCategoryId })
    if (this.q.trim()) this.filtersSrv.add({ name: 'q', value: this.q.trim() })
    if (this.material.trim())
      this.filtersSrv.add({ name: 'material', value: this.material.trim() })
    if (this.lado) this.filtersSrv.add({ name: 'lado', value: this.lado })
    if (this.orificios)
      this.filtersSrv.add({ name: 'orificios', value: this.orificios })
    if (this.hasPhoto) this.filtersSrv.add({ name: 'hasPhoto', value: true })

    this.apply.emit(this.filtersSrv.get())
  }
}
