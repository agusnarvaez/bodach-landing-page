import { ComponentFixture, TestBed } from '@angular/core/testing'

import { HomeSellersComponent } from './home-sellers.component'
import { commonAngularTestProviders } from '../../../testing/common-test-providers'

describe('HomeSellersComponent', () => {
  let component: HomeSellersComponent
  let fixture: ComponentFixture<HomeSellersComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeSellersComponent],
      providers: [...commonAngularTestProviders],
    })
    .compileComponents()

    fixture = TestBed.createComponent(HomeSellersComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
