import { ComponentFixture, TestBed } from '@angular/core/testing'
import { FaqItemComponent } from './faq-item.component'
import { By } from '@angular/platform-browser'

describe('FaqItemComponent', () => {
  let component: FaqItemComponent
  let fixture: ComponentFixture<FaqItemComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FaqItemComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(FaqItemComponent)
    component = fixture.componentInstance
    component.question = '¿Cómo hago un pedido?'
    component.answer = 'Podés contactarnos por email o teléfono.'
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  it('should start with answer hidden (showAnswer = false)', () => {
    expect(component.showAnswer()).toBeFalse()
  })

  it('should render question text', () => {
    const h3 = fixture.debugElement.query(By.css('h3'))
    expect(h3.nativeElement.textContent).toContain('¿Cómo hago un pedido?')
  })

  it('toggleAnswer() should set showAnswer to true', () => {
    component.toggleAnswer()
    expect(component.showAnswer()).toBeTrue()
  })

  it('toggleAnswer() should toggle back to false', () => {
    component.toggleAnswer()
    component.toggleAnswer()
    expect(component.showAnswer()).toBeFalse()
  })

  it('clicking the trigger button should call toggleAnswer()', () => {
    spyOn(component, 'toggleAnswer').and.callThrough()
    const btn = fixture.debugElement.query(By.css('.faq-trigger'))
    btn.nativeElement.click()
    expect(component.toggleAnswer).toHaveBeenCalled()
  })

  it('trigger button should have aria-expanded="false" initially', () => {
    const btn = fixture.debugElement.query(By.css('.faq-trigger'))
    expect(btn.nativeElement.getAttribute('aria-expanded')).toBe('false')
  })

  it('trigger button aria-expanded should update to "true" after toggle', () => {
    component.toggleAnswer()
    fixture.detectChanges()
    const btn = fixture.debugElement.query(By.css('.faq-trigger'))
    expect(btn.nativeElement.getAttribute('aria-expanded')).toBe('true')
  })

  it('faq-item should have class "show" when answer is visible', () => {
    component.toggleAnswer()
    fixture.detectChanges()
    const item = fixture.debugElement.query(By.css('.faq-item'))
    expect(item.nativeElement.classList).toContain('show')
  })
})
