// services/product/product.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, map, switchMap, throwError } from 'rxjs'
import { Product, SanityProduct } from '../../models/product'
import { FiltersService } from '../filters/filters.service'
import { SANITY_BASE_URL, environment } from '../../../../environment.prod'

interface Response<T> {
  result: T
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private filtersService: FiltersService,
    private http: HttpClient,
  ) {}

  getAll(): Observable<Product[]> {
    const query = this.filtersService.getQuery()
    const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(query)}&perspective=${environment.sanity.perspective}`
    return this.http.get<Response<SanityProduct[]>>(url).pipe(
      catchError((err) => throwError(() => new Error(err.message))),
      map((res) => (res.result || []).map((p) => new Product().fromSanity(p))),
    )
  }

  getById(id: string): Observable<Product> {
    const q = `*[_type=="product" && _id=="${id}"]{
      _id, title, slug, materials, description,
      "category": category->{_id, title, slug},
      "photo": photo{ asset->{ url } },
      "variants": variants[]{ title, code, "photo": photo{ asset->{ url } }, attributes[]{ key, value } }
    }[0]`

    const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(q)}&perspective=${environment.sanity.perspective}`
    return this.http.get<Response<SanityProduct>>(url).pipe(
      catchError((err) => throwError(() => new Error(err.message))),
      map((res) => new Product().fromSanity(res.result as SanityProduct)),
    )
  }

  getSuggested(id: string): Observable<Product[]> {
    // sugeridos: mismo tipo de categoría, distinto _id
    const q = `*[_type=="product" && _id=="${id}"][0].category._ref`
    const urlCat = `${SANITY_BASE_URL}?query=${encodeURIComponent(q)}`
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.http.get<any>(urlCat).pipe(
      map((r) => r.result as string),
      // con el _ref de categoría, traemos 6 del mismo grupo
      // (si no hay categoría, volvemos a getAll sin filtros)
      switchMap((catRef?: string) => {
        const where = catRef
          ? `*[_type=="product" && category._ref=="${catRef}" && _id!="${id}"]`
          : `*[_type=="product" && _id!="${id}"]`
        const q2 = `${where}{
          _id, title, "photo": photo{asset->{url}}, "category": category->{_id, title}
        } | order(title asc) [0...6]`
        const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(q2)}`
        return this.http
          .get<Response<SanityProduct[]>>(url)
          .pipe(
            map((res) =>
              (res.result || []).map((p) => new Product().fromSanity(p)),
            ),
          )
      }),
    )
  }
}
