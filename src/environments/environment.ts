export const environment = {
  production: false,
  APP_URL: 'https://www.bodach.ar',
  MAPS_KEY: 'AIzaSyCyAobo-SoKaF8cDJrZnJ_DlgFYkHL03e4',
  MAIL_API: 'https://mailing-api.fly.dev',
  SANITY_KEY: '5lmhl5ew',
  SANITY_VERSION: '2025-10-20',
  sanity: {
    perspective: 'published' as const,
  },
}

export const SANITY_BASE_URL = `https://${environment.SANITY_KEY}.api.sanity.io/v${environment.SANITY_VERSION}/data/query/production`