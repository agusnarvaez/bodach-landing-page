import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, map, catchError, throwError, shareReplay } from 'rxjs'
import { SANITY_BASE_URL, environment } from '../../../environments/environment'

export interface SanityCategory {
  _id: string
  title: string
  slug?: { current: string }
}

interface Response<T> {
  result: T
}

@Injectable({ providedIn: 'root' })
export class CategoryService {
  private readonly categories$: Observable<SanityCategory[]>

  constructor(private http: HttpClient) {
    const q = `*[_type=="category"]{ _id, title, slug } | order(title asc)`
    const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(q)}&perspective=${environment.sanity.perspective}`
    this.categories$ = this.http.get<Response<SanityCategory[]>>(url).pipe(
      catchError((err) => throwError(() => new Error(err.message))),
      map((r) => r.result || []),
      shareReplay(1),
    )
  }

  getAll(): Observable<SanityCategory[]> {
    return this.categories$
  }
}
