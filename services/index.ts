// Export all services
import AuthService from './Auth';
import DocumentService from './Document';
import UserService from './User';
import GroupService from './Group';
import SystemService from './System';

export const authService = new AuthService();
export const documentService = new DocumentService();
export const userService = new UserService();
export const groupService = new GroupService();
export const systemService = new SystemService();

export default {
    authService,
    documentService,
    userService,
    groupService,
    systemService
};
