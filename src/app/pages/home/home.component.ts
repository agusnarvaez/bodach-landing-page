import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeBannerComponent } from '../../sections/home/home-banner/home-banner.component'
import { HomeIntroductionComponent } from '../../sections/home/home-introduction/home-introduction.component'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HomeBannerComponent,HomeIntroductionComponent,HomeBannerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {

}
