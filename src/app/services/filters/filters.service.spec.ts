import { TestBed } from '@angular/core/testing'

import { FiltersService } from './filters.service'
import { FilterStateService } from './filter-state.service'
import { GroqBuilderService } from './groq-builder.service'

describe('FiltersService (facade)', () => {
  let service: FiltersService
  let stateSpy: jasmine.SpyObj<FilterStateService>
  let builderSpy: jasmine.SpyObj<GroqBuilderService>

  beforeEach(() => {
    stateSpy = jasmine.createSpyObj('FilterStateService', [
      'get',
      'add',
      'remove',
      'clear',
      'isActive',
    ])
    stateSpy.get.and.returnValue({})

    builderSpy = jasmine.createSpyObj('GroqBuilderService', ['getQuery', 'getCardsQuery'])
    builderSpy.getQuery.and.returnValue('*[_type == "product"]{...}')
    builderSpy.getCardsQuery.and.returnValue('*[_type == "product"]{id, title}')

    TestBed.configureTestingModule({
      providers: [
        FiltersService,
        { provide: FilterStateService, useValue: stateSpy },
        { provide: GroqBuilderService, useValue: builderSpy },
      ],
    })

    service = TestBed.inject(FiltersService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('get() should delegate to FilterStateService.get()', () => {
    service.get()
    expect(stateSpy.get).toHaveBeenCalledTimes(1)
  })

  it('add() should delegate to FilterStateService.add()', () => {
    service.add({ name: 'material', value: 'Acero' })
    expect(stateSpy.add).toHaveBeenCalledWith({ name: 'material', value: 'Acero' })
  })

  it('remove() should delegate to FilterStateService.remove()', () => {
    service.remove({ name: 'material', value: 'Acero' })
    expect(stateSpy.remove).toHaveBeenCalledWith({ name: 'material', value: 'Acero' })
  })

  it('clear() should delegate to FilterStateService.clear()', () => {
    service.clear()
    expect(stateSpy.clear).toHaveBeenCalledTimes(1)
  })

  it('isActive() should delegate to FilterStateService.isActive()', () => {
    service.isActive('material', 'Acero')
    expect(stateSpy.isActive).toHaveBeenCalledWith('material', 'Acero')
  })

  it('getCardsQuery() should call GroqBuilderService.getCardsQuery() with current filters', () => {
    const filters = { material: 'Acero' }
    stateSpy.get.and.returnValue(filters)
    service.getCardsQuery()
    expect(builderSpy.getCardsQuery).toHaveBeenCalledWith(filters)
  })

  it('getQuery() should call GroqBuilderService.getQuery() with current filters', () => {
    const filters = { q: 'tornillo' }
    stateSpy.get.and.returnValue(filters)
    service.getQuery()
    expect(builderSpy.getQuery).toHaveBeenCalledWith(filters)
  })
})
