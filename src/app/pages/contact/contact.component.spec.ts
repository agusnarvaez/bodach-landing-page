import { ComponentFixture, TestBed } from '@angular/core/testing'

import { ContactComponent } from './contact.component'
import { commonAngularTestProviders } from '../../testing/common-test-providers'

describe('ContactComponent', () => {
  let component: ContactComponent
  let fixture: ComponentFixture<ContactComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactComponent],
      providers: [...commonAngularTestProviders],
    })
    .compileComponents()

    fixture = TestBed.createComponent(ContactComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
