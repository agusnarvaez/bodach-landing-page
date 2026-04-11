import { ComponentFixture, TestBed } from '@angular/core/testing'
import { of } from 'rxjs'
import { By } from '@angular/platform-browser'

import { ProductsFilterComponent } from './products-filter.component'
import { commonAngularTestProviders } from '../../../testing/common-test-providers'
import { CategoryService, SanityCategory } from '../../../services/category/category.service'
import { FiltersService } from '../../../services/filters/filters.service'

const mockCategories: SanityCategory[] = [
  { _id: '1', title: 'Bulones', slug: { current: 'bulones' } },
  { _id: '2', title: 'Herrajes', slug: { current: 'herrajes' } },
]

describe('ProductsFilterComponent', () => {
  let component: ProductsFilterComponent
  let fixture: ComponentFixture<ProductsFilterComponent>
  let categorySpy: jasmine.SpyObj<CategoryService>
  let filtersSpy: jasmine.SpyObj<FiltersService>

  beforeEach(async () => {
    categorySpy = jasmine.createSpyObj('CategoryService', ['getAll'])
    categorySpy.getAll.and.returnValue(of(mockCategories))

    filtersSpy = jasmine.createSpyObj('FiltersService', [
      'get',
      'add',
      'remove',
      'clear',
      'isActive',
      'getQuery',
      'getCardsQuery',
    ])
    filtersSpy.get.and.returnValue({})

    await TestBed.configureTestingModule({
      imports: [ProductsFilterComponent],
      providers: [
        ...commonAngularTestProviders,
        { provide: CategoryService, useValue: categorySpy },
        { provide: FiltersService, useValue: filtersSpy },
      ],
    }).compileComponents()

    fixture = TestBed.createComponent(ProductsFilterComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('ngOnInit should call CategoryService.getAll()', () => {
    expect(categorySpy.getAll).toHaveBeenCalledTimes(1)
  })

  it('categories signal should be populated after init', () => {
    expect(component.categories()).toEqual(mockCategories)
  })

  it('clearAll() should call FiltersService.clear()', () => {
    component.clearAll()
    expect(filtersSpy.clear).toHaveBeenCalledTimes(1)
  })

  it('clearAll() should emit the apply output', () => {
    let emitted = false
    component.apply.subscribe(() => (emitted = true))
    component.clearAll()
    expect(emitted).toBeTrue()
  })

  it('clearAll() should reset local filter fields', () => {
    component.q = 'tornillo'
    component.material = 'Acero'
    component.clearAll()
    expect(component.q).toBe('')
    expect(component.material).toBe('')
    expect(component.selectedCategoryId).toBeUndefined()
  })

  it('onApply() should call FiltersService.clear() before adding filters', () => {
    component.onApply()
    expect(filtersSpy.clear).toHaveBeenCalled()
  })

  it('onApply() should add categoryId filter when category is selected', () => {
    component.selectedCategoryId = '1'
    component.onApply()
    expect(filtersSpy.add).toHaveBeenCalledWith({ name: 'categoryId', value: '1' })
  })

  it('onApply() should add q filter when search text is set', () => {
    component.q = 'tornillo'
    component.onApply()
    expect(filtersSpy.add).toHaveBeenCalledWith({ name: 'q', value: 'tornillo' })
  })

  it('onApply() should NOT add q filter when search text is blank', () => {
    component.q = '   '
    component.onApply()
    const addCalls = filtersSpy.add.calls.allArgs()
    const qCall = addCalls.find(([f]: [{ name: string }]) => f.name === 'q')
    expect(qCall).toBeUndefined()
  })

  it('onApply() should emit apply output', () => {
    let emitted = false
    component.apply.subscribe(() => (emitted = true))
    component.onApply()
    expect(emitted).toBeTrue()
  })

  it('"Aplicar Filtros" button click should call onApply()', () => {
    spyOn(component, 'onApply')
    const btn = fixture.debugElement.queryAll(By.css('app-button'))[0]
    btn.nativeElement.click()
    expect(component.onApply).toHaveBeenCalled()
  })

  it('"Limpiar Filtros" button click should call clearAll()', () => {
    spyOn(component, 'clearAll')
    const btn = fixture.debugElement.queryAll(By.css('app-button'))[1]
    btn.nativeElement.click()
    expect(component.clearAll).toHaveBeenCalled()
  })
})
