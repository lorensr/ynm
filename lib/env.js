export const inProduction = process.env.NODE_ENV === 'production'

export const DOMAIN = inProduction
  ? 'https://yesnomaybe.menu'
  : 'http://localhost:3000'
