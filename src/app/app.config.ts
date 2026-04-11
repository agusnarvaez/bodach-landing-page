import { ApplicationConfig, importProvidersFrom } from '@angular/core'
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router'

import { routes } from './app.routes'
import { provideHttpClient, withInterceptors } from '@angular/common/http'
import { httpStateInterceptor } from './interceptors/http-state.interceptor'
import {
  LucideAngularModule,
  ArrowRight, Box, Check, ChevronLeft, Copy, DollarSign,
  ExternalLink, FilePlus, FilterX, FlaskConical, Link,
  ListFilter, Mail, MessageCircle, Package, Ruler,
  Settings, Share2, Store, Wrench, X,
} from 'lucide-angular'

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([httpStateInterceptor])),
    importProvidersFrom(
      LucideAngularModule.pick({
        ArrowRight, Box, Check, ChevronLeft, Copy, DollarSign,
        ExternalLink, FilePlus, FilterX, FlaskConical, Link,
        ListFilter, Mail, MessageCircle, Package, Ruler,
        Settings, Share2, Store, Wrench, X,
      })
    ),
  ],
}
