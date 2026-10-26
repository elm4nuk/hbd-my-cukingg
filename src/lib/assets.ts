// Path aset publik yang tetap benar saat situs di-deploy di subpath (vite `base: './'`).
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
