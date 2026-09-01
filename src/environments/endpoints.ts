export const WASHING_MACHINE_ENDPOINTS = {
  create: () => `/v1/washing-machines/create`,
  getRecommendation: (serialNumber: string) => `/v1/washing-machines/${serialNumber}/recommendation`,
  getReport: (serialNumber: string) => `/v1/washing-machines/${serialNumber}/report`,
  search: () => `/v1/washing-machines/search`,
  load: (serialNumber: string) => `/v1/washing-machines/${serialNumber}`,
  loadMany: () => `/v1/washing-machines/many`,
  delete: (serialNumber: string) => `/v1/washing-machines/${serialNumber}`,
  validate: (serialNumber: string) => `/v1/washing-machines/${serialNumber}/validate`
}

export const SOLAR_PANEL_ENDPOINTS = {
  create: () => `/v1/solar-panels/create`,
  getRecommendation: (serialNumber: string) => `/v1/solar-panels/${serialNumber}/recommendation`,
  search: () => `/v1/solar-panels/search`,
  load: (serialNumber: string) => `/v1/solar-panels/${serialNumber}`,
  loadMany: () => `/v1/solar-panels/many`,
  delete: (serialNumber: string) => `/v1/solar-panels/${serialNumber}`,
}

export const PRODUCT_ENDPOINTS = {
  getManufacturers: (productCategory: string) => `/v1/products/${productCategory}/manufacturers`,
  getModelsAndTypes: (productManufacturer: string) => `/v1/products/${productManufacturer}/models-and-types`,
  getProductIdentification: (qrCode: string) => `/v1/products/${qrCode}`
}

export const AUTH_ENDPOINTS = {
  login: () => `/api/v1/users/login`,
  update: () => `/auth/update`,
  updatePassword: () => `/auth/password`,
  register: () => `/api/v1/users/register`,
  getOrganizationAndCountry: (registerCode: string) => `/api/v1/users/${registerCode}/organization-and-country`,
  validate: (registerCode: string) => `/api/v1/users/${registerCode}`
}
