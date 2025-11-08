import { Component } from '@angular/core'
import { CommonModule } from '@angular/common'
import { HomeBannerComponent } from '../../sections/home/home-banner/home-banner.component'
import { HomeIntroductionComponent } from '../../sections/home/home-introduction/home-introduction.component'
import { HomeProductsComponent } from '../../sections/home/home-products/home-products.component'
import { HomeDevelopmentComponent } from '../../sections/home/home-development/home-development.component'
import { HomeSellersComponent } from '../../sections/home/home-sellers/home-sellers.component'
import { HomeFaqComponent } from '../../sections/home/home-faq/home-faq.component'
import { ProductService } from '../../services/product/product.service'

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    HomeBannerComponent,
    HomeIntroductionComponent,
    HomeBannerComponent,
    HomeProductsComponent,
    HomeDevelopmentComponent,
    HomeSellersComponent,
    HomeFaqComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  constructor(private productsService: ProductService) {}

  ngOnInit(): void {
    this.productsService.getAll().subscribe((products) => {
      console.log('Productos en HomeComponent:', products)
    })
  }
}
