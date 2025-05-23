export const ROUTES = {
  BASE: '/',
  AUTH: {
    BASE: '/auth',
    LOGIN: '/login',
    REGISTER: '/register'
  },
  DASHBOARD: {
    BASE: '/dashboard'
  },
  USER: {
    BASE: '/user',
    WHO_M_I: '/whomi',
    UPLOAD_PROFILE_PIC: '/uploadprofilepic',
    UPDATE_PROFILE: '/profileupdate'
  },
  CATEGORY: {
    BASE: '/category',
    GETALLCATEGORY: '/getAllcategory',
    ADDCATEGORY: '/addCategory',
    DELETECATEGORY: '/deleteCategory',
    UPDATECATEGORY: '/updateCategory'
  },
  CUSTOMER: {
    BASE: '/customer',

    GETALLCUSTOMER: '/getAllCustomer',
    ADD_CUSTOMER: '/addCustomer',
    DELETECUSTOMER: '/deleteCustomer',
    UPDATECUSTOMER: '/updateCustomer'
  },
  FARM: {
    BASE: '/farm',
    GETALL_FARM: '/getFarm',
    ADD_FARM: '/addFarm',
    DELETE_FARM: '/deleteFarm',
    UPDATE_FARM: '/updateFarm'
  },
  VILLAGE: {
    BASE: '/village',
    GET_VILLAGE: '/getVillage'
  },
  PRODUCT: {
    BASE: '/product',
    GET_PRODUCT: '/getProduct',
    DELETE_PRODUCT: '/deleteProduct',
    UPDATE_PRODUCT: '/updateProduct',
    ADD_PRODUCT: '/addProduct',
    PRODUCT_IMAGES: '/getProductPresign'
  },
  DOSAGE: {
    BASE: '/dosage',
    GET_FARM_DOSAGE: '/:farm_id',
    GET_DOSAGE_BY_ID: '/dosageById/:dosage_id',
    UPDATE_DOSAGE: '/updateDosage',
    MARK_DASOAGE_AS_PURCHASED: '/markAsPurchased/:dosage_id',
    GET_PRODUCT: '/getProduct',
    DELETE_DOSAGE: '/deleteDosage',
    UPDATE_PRODUCT: '/updateProduct',
    ADD_DOSAGE: '/addDosage',
    PRODUCT_IMAGES: '/getProductPresign'
  }
};
