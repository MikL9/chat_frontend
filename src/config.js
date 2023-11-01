const prod = process.env.NODE_ENV === 'production'

export const VUE_APP_SITE = process.env.VUE_APP_SITE + prod ? '/api' : ''
export const VUE_APP_WS = process.env.VUE_APP_WS + (prod ? '/api' : '') + '/ws'
