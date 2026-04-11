import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, signal } from '@angular/core'
import { CommonModule } from '@angular/common'
import { LucideAngularModule } from 'lucide-angular'

@Component({
  selector: 'app-share-modal',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './share-modal.component.html',
  styleUrl: './share-modal.component.css',
})
export class ShareModalComponent {
  @Input() isOpen = false
  @Input() url = ''
  @Input() title = ''
  @Output() closed = new EventEmitter<void>()

  copied = signal(false)
  canShare = signal(typeof navigator !== 'undefined' && 'share' in navigator)
  closing = signal(false)

  dismiss() {
    this.closing.set(true)
    setTimeout(() => {
      this.closing.set(false)
      this.closed.emit()
    }, 220)
  }

  copyLink() {
    navigator.clipboard.writeText(this.url).then(() => {
      this.copied.set(true)
      setTimeout(() => this.copied.set(false), 2000)
    })
  }

  shareWhatsapp() {
    const text = encodeURIComponent(`${this.title}\n${this.url}`)
    window.open(`https://wa.me/?text=${text}`, '_blank', 'noopener')
  }

  shareEmail() {
    const subject = encodeURIComponent(this.title)
    const body = encodeURIComponent(this.url)
    window.open(`mailto:?subject=${subject}&body=${body}`)
  }

  shareNative() {
    navigator.share({ title: this.title, url: this.url }).catch(() => {})
  }
}
