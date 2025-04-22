"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// routes.js
const ERROR_MESSAGES = {
    NOT_FOUND: 'Page not found.',
    INTERNAL_ERROR: 'Internal Server Error.',
    SOMETHING_WRONG: 'Something went wrong',
    DATABASE_ERROR: 'Database error',
    UNAUTHENTIC_USER: 'Unauthentic user',
    RECORD_NOT_FOUND: 'Record not found',
    FETCHED_SUCCESS: (title) => `${title} fetched succesfully`,
    ID_REQUIRED: (title) => `${title} ID is required`,
    UPDATE_SUCCESS: (title) => `${title} Updated successfully`,
    DELETE_SUCCESS: (title) => `${title} deleted successfully`,
    CREATED_SUCCESS: (title) => `${title} added successfully`,
    INVALID: (title) => `${title} is invalid`,
    AUTH: {
        NO_ACCOUND_FOUND: 'No account found with this email',
        ALREADY_REGISTERED: 'User already exists',
        INVALID_EMAIL_PASSWORD: 'Invalid email or password.',
        SUCCESS_LOGIN: 'Logged in successfully',
        LOGOUT_SUCCESS: 'Logged out successfully',
        REGISTER_SUCCESS: 'User registered successfully',
        USER_NOT_FOUND: 'User not exist'
    },
    USER: {
        NO_FILE_FOUND: 'No file found',
        PROFILE_PIC_UPLOAD_SUCCESS: 'Profile picture uploaded successfully',
        PROFILE_UPDATED_SUCCESS: 'Profile has been updated successfully'
    },
    CATEGORY: {
        CREATED_SUCCESS: 'Category added successfully',
        DELETED_SUCCESS: 'Category deleted successfully'
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
exports.default = ERROR_MESSAGES;
