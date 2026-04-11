import { TestBed } from '@angular/core/testing'
import { GroqBuilderService } from './groq-builder.service'

describe('GroqBuilderService', () => {
  let service: GroqBuilderService

  beforeEach(() => {
    TestBed.configureTestingModule({})
    service = TestBed.inject(GroqBuilderService)
  })

  it('should be created', () => {
    expect(service).toBeTruthy()
  })

  describe('getCardsQuery()', () => {
    it('should always include _type == "product" constraint', () => {
      const q = service.getCardsQuery({})
      expect(q).toContain('_type == "product"')
    })

    it('should not add extra WHERE clauses when filters are empty', () => {
      const q = service.getCardsQuery({})
      expect(q).not.toContain('category._ref')
      expect(q).not.toContain('in materials')
    })

    it('should include categoryId filter when set', () => {
      const q = service.getCardsQuery({ categoryId: 'abc123' })
      expect(q).toContain('category._ref == "abc123"')
    })

    it('should include categorySlug filter when set', () => {
      const q = service.getCardsQuery({ categorySlug: 'bulones' })
      expect(q).toContain('category->slug.current == "bulones"')
    })

    it('should include material filter when set', () => {
      const q = service.getCardsQuery({ material: 'Aluminio' })
      expect(q).toContain('"Aluminio" in materials')
    })

    it('should include hasPhoto filter when set', () => {
      const q = service.getCardsQuery({ hasPhoto: true })
      expect(q).toContain('defined(photo.asset)')
    })

    it('should include lado filter when set', () => {
      const q = service.getCardsQuery({ lado: 'Derecha' })
      expect(q).toContain('key == "Lado" && value == "Derecha"')
    })

    it('should include orificios filter when set', () => {
      const q = service.getCardsQuery({ orificios: '2' })
      expect(q).toContain('key == "Orificios" && value == "2"')
    })

    it('should include text search filter when q is set', () => {
      const q = service.getCardsQuery({ q: 'tornillo' })
      expect(q).toContain('title match "*tornillo*"')
    })

    it('should combine multiple filters with &&', () => {
      const q = service.getCardsQuery({ categoryId: 'abc', material: 'Aluminio' })
      expect(q).toContain('&&')
      expect(q).toContain('category._ref == "abc"')
      expect(q).toContain('"Aluminio" in materials')
    })

    it('should include cards projection with "id": _id', () => {
      const q = service.getCardsQuery({})
      expect(q).toContain('"id": _id')
      expect(q).toContain('"variants_quantity": count(variants)')
    })

    it('should escape double quotes in values to prevent GROQ injection', () => {
      const q = service.getCardsQuery({ material: 'alu"minio' })
      expect(q).toContain('alu\\"minio')
    })
  })

  describe('getQuery()', () => {
    it('should include full projection with variants', () => {
      const q = service.getQuery({})
      expect(q).toContain('"variants": variants[]')
      expect(q).toContain('attributes[]{ key, value }')
    })

    it('should differ from getCardsQuery() projection', () => {
      const cards = service.getCardsQuery({})
      const full = service.getQuery({})
      expect(full).not.toEqual(cards)
    })

    it('should apply the same filters as getCardsQuery()', () => {
      const q = service.getQuery({ categoryId: 'xyz' })
      expect(q).toContain('category._ref == "xyz"')
    })
  })
})
