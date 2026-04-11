// services/product/product.service.ts
import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { Observable, catchError, map, throwError } from 'rxjs'
import { ProductCard, ProductDetail } from '../../models/product'
import { FiltersService } from '../filters/filters.service'
import { SANITY_BASE_URL, environment } from '../../../environments/environment'

interface Response<T> {
  result: T
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  constructor(
    private filtersService: FiltersService,
    private http: HttpClient,
  ) {}

  getAll(): Observable<ProductCard[]> {
    const query = this.filtersService.getCardsQuery()
    const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(query)}&perspective=${environment.sanity.perspective}`
    return this.http.get<Response<ProductCard[]>>(url).pipe(
      catchError((err) => throwError(() => new Error(err.message))),
      map((res) => res.result || []),
    )
  }

  getById(id: string): Observable<ProductDetail> {
    const q = `*[_type=="product" && _id=="${id}"]{
      "id": _id,
      title,
      "category": coalesce(category->title, ""),
      "materials": coalesce(materials, []),
      "variants": coalesce(variants[].title, []),
      "description": coalesce(description, ""),
      "photo": photo.asset->url
    }[0]`
    const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(q)}&perspective=${environment.sanity.perspective}`
    return this.http.get<Response<ProductDetail>>(url).pipe(
      catchError((err) => throwError(() => new Error(err.message))),
      map((res) => res.result as ProductDetail),
    )
  }

  getSuggested(id: string): Observable<ProductCard[]> {
    // Single GROQ query using ^ parent reference — eliminates the N+1 pattern
    const q = `*[_type=="product" && _id=="${id}"]{
      "suggestions": *[_type=="product" && category._ref == ^.category._ref && _id!="${id}"]{
        "id": _id,
        title,
        "category": coalesce(category->title, ""),
        "materials": coalesce(materials, []),
        "photo": photo.asset->url,
        "variants_quantity": count(variants)
      } | order(title asc) [0...6]
    }[0].suggestions`

    const url = `${SANITY_BASE_URL}?query=${encodeURIComponent(q)}&perspective=${environment.sanity.perspective}`
    return this.http.get<Response<ProductCard[]>>(url).pipe(
      catchError((err) => throwError(() => new Error(err.message))),
      map((res) => res.result ?? []),
    )
  }
}
