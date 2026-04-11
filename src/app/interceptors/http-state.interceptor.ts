import { HttpInterceptorFn } from '@angular/common/http'
import { inject } from '@angular/core'
import { tap, finalize } from 'rxjs'
import { LoadingService } from '../services/loading/loading.service'

export const httpStateInterceptor: HttpInterceptorFn = (req, next) => {
  const loadingService = inject(LoadingService)

  loadingService.start()

  return next(req).pipe(
    tap({
      error: () => {
        // Error is propagated naturally; loading is stopped in finalize
      },
    }),
    finalize(() => loadingService.stop()),
  )
}
