// routes.js
const ERROR_MESSAGES = {
  NOT_FOUND: 'Page not found.',
  INTERNAL_ERROR: 'Internal Server Error.',
  SOMETHING_WRONG: 'Something went wrong',
  DATABASE_ERROR: 'Database error',
  AUTH: {
    NO_ACCOUND_FOUND: 'No account found with this email',
    ALREADY_REGISTERED: 'User already exists',
    INVALID_EMAIL_PASSWORD: 'Invalid email or password.',
    SUCCESS_LOGIN: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully',
    REGISTER_SUCCESS: 'User registered successfully',
    USER_NOT_FOUND: 'User not exist'
  },
  POST: {
    POST_NO_FOUND: 'Post Not Found',
    POST_CREATE_SUCCESS: 'Post created successfully',
    POST_DELETED_SUCCESS: 'Post deleted successfully',
    POST_UPDATED_SUCCSS: 'Post updated successfully',
    POST_ALREADY_EXISTS: 'This Record Already Exists'
  },
  CUSTOMER: {
    CUSTOMER_NO_FOUND: 'Customer Not Found',
    POST_CREATE_SUCCESS: 'Post created successfully',
    POST_DELETED_SUCCESS: 'Post deleted successfully',
    POST_UPDATED_SUCCSS: 'Post updated successfully',
    CUSTOMER_ALREADY_EXISTS: 'Customer is already exists'
  },
  PRODUCT: {
    PRODUCT_NO_FOUND: 'Product Not Found',
    POST_CREATE_SUCCESS: 'Post created successfully',
    POST_DELETED_SUCCESS: 'Post deleted successfully',
    POST_UPDATED_SUCCSS: 'Post updated successfully',
    PRODUCT_ALREADY_EXISTS: 'Product is already exists'
  }
};

export default ERROR_MESSAGES;
