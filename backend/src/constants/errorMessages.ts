// routes.js
const ERROR_MESSAGES = {
  NOT_FOUND: 'Page not found.',
  INTERNAL_ERROR: 'Internal Server Error.',
  SOMETHING_WRONG: 'Something went wrong',
  AUTH: {
    NO_ACCOUND_FOUND: 'No account found with this email',
    INVALID_EMAIL_PASSWORD: 'Invalid email or password.',
    SUCCESS_LOGIN: 'Logged in successfully',
    LOGOUT_SUCCESS: 'Logged out successfully'
  },
  POST: {
    POST_NO_FOUND: 'Post Not Found',
    POST_CREATE_SUCCESS: 'Post created successfully',
    POST_DELETED_SUCCESS: 'Post deleted successfully',
    POST_UPDATED_SUCCSS: 'Post updated successfully'
  }
};

export default ERROR_MESSAGES;
