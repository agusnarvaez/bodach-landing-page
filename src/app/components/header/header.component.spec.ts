import { ComponentFixture, TestBed } from '@angular/core/testing'
import { By } from '@angular/platform-browser'
import { provideRouter } from '@angular/router'

import { HeaderComponent } from './header.component'

describe('HeaderComponent', () => {
  let component: HeaderComponent
  let fixture: ComponentFixture<HeaderComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeaderComponent],
      providers: [provideRouter([])],
    }).compileComponents()

    fixture = TestBed.createComponent(HeaderComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('menuOpen should start as false', () => {
    expect(component.menuOpen()).toBeFalse()
  })

  it('toggleHeader() should set menuOpen to true', () => {
    component.toggleHeader()
    expect(component.menuOpen()).toBeTrue()
  })

  it('toggleHeader() should toggle back to false', () => {
    component.toggleHeader()
    component.toggleHeader()
    expect(component.menuOpen()).toBeFalse()
  })

  it('hamburger button should have aria-expanded="false" initially', () => {
    const btn = fixture.debugElement.query(By.css('.header-button'))
    expect(btn.nativeElement.getAttribute('aria-expanded')).toBe('false')
  })

  it('hamburger button aria-expanded should update to "true" after toggle', () => {
    component.toggleHeader()
    fixture.detectChanges()
    const btn = fixture.debugElement.query(By.css('.header-button'))
    expect(btn.nativeElement.getAttribute('aria-expanded')).toBe('true')
  })

  it('hamburger button aria-label should be "Abrir menú" when closed', () => {
    const btn = fixture.debugElement.query(By.css('.header-button'))
    expect(btn.nativeElement.getAttribute('aria-label')).toBe('Abrir menú')
  })

  it('hamburger button aria-label should be "Cerrar menú" when open', () => {
    component.toggleHeader()
    fixture.detectChanges()
    const btn = fixture.debugElement.query(By.css('.header-button'))
    expect(btn.nativeElement.getAttribute('aria-label')).toBe('Cerrar menú')
  })

  it('nav should have aria-hidden="true" when menu is closed', () => {
    const nav = fixture.debugElement.query(By.css('nav'))
    expect(nav.nativeElement.getAttribute('aria-hidden')).toBe('true')
  })

  it('nav should not have aria-hidden when menu is open', () => {
    component.toggleHeader()
    fixture.detectChanges()
    const nav = fixture.debugElement.query(By.css('nav'))
    expect(nav.nativeElement.getAttribute('aria-hidden')).toBeNull()
  })

  it('clicking hamburger button should toggle the menu', () => {
    const btn = fixture.debugElement.query(By.css('.header-button'))
    btn.nativeElement.click()
    expect(component.menuOpen()).toBeTrue()
  })
})
