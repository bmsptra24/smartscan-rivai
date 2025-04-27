// Export all services
import AuthService from './Auth';
import DocumentService from './Document';
import StorageService from './Storage';
import UserService from './User';
import GroupService from './Group';

export const authService = new AuthService();
export const documentService = new DocumentService();
export const storageService = new StorageService();
export const userService = new UserService();
export const groupService = new GroupService();

export default {
    authService,
    documentService,
    storageService,
    userService,
    groupService,
};
