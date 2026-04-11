import { ChangeDetectionStrategy, Component, signal } from '@angular/core'
import { CommonModule, NgClass } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router'

@Component({
  selector: 'app-header',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, NgClass, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  menuOpen = signal(false)

  toggleHeader() {
    this.menuOpen.update((v) => !v)
  }
}
