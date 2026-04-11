import { TestBed } from '@angular/core/testing'
import { FilterStateService } from './filter-state.service'

describe('FilterStateService', () => {
  let service: FilterStateService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(FilterStateService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  it('should start with empty filters', () => {
    expect(service.get()).toEqual({})
  })

  it('activeCount should be 0 initially', () => {
    expect(service.activeCount()).toBe(0)
  })

  it('add() should update the filter signal', () => {
    service.add({ name: 'material', value: 'Aluminio' })
    expect(service.get().material).toBe('Aluminio')
  })

  it('add() should not overwrite other filters', () => {
    service.add({ name: 'material', value: 'Aluminio' })
    service.add({ name: 'q', value: 'tornillo' })
    expect(service.get().material).toBe('Aluminio')
    expect(service.get().q).toBe('tornillo')
    expect(service.activeCount()).toBe(2)
  })

  it('remove() should delete the specified filter', () => {
    service.add({ name: 'material', value: 'Aluminio' })
    service.add({ name: 'q', value: 'tornillo' })
    service.remove({ name: 'material', value: 'Aluminio' })
    expect(service.get().material).toBeUndefined()
    expect(service.get().q).toBe('tornillo')
  })

  it('clear() should reset to empty filters', () => {
    service.add({ name: 'material', value: 'Aluminio' })
    service.add({ name: 'q', value: 'tornillo' })
    service.clear()
    expect(service.get()).toEqual({})
    expect(service.activeCount()).toBe(0)
  })

  it('isActive() without expected value should return true when filter is set', () => {
    service.add({ name: 'hasPhoto', value: true })
    expect(service.isActive('hasPhoto')).toBeTrue()
  })

  it('isActive() without expected value should return false when filter is not set', () => {
    expect(service.isActive('material')).toBeFalse()
  })

  it('isActive() with expected value should match correctly', () => {
    service.add({ name: 'lado', value: 'Derecha' })
    expect(service.isActive('lado', 'Derecha')).toBeTrue()
    expect(service.isActive('lado', 'Izquierda')).toBeFalse()
  })

  it('filters computed signal reflects state changes', () => {
    service.add({ name: 'q', value: 'bulon' })
    expect(service.filters().q).toBe('bulon')
    service.clear()
    expect(service.filters().q).toBeUndefined()
  })
})
