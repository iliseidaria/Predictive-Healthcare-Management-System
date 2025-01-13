import { User, UserRole } from '../user';

describe('User Model', () => {
  describe('UserRole Enum', () => {
    it('should have correct role values', () => {
      expect(UserRole.Admin).toBe('Admin');
      expect(UserRole.Doctor).toBe('Doctor');
      expect(UserRole.Patient).toBe('Patient');
    });
  });

  describe('User Interface', () => {
    it('should create user object with required properties', () => {
      const user: User = {
        id: '1',
        username: 'test',
        email: 'test@test.com',
        role: UserRole.Admin,
        firstName: 'Test',
        lastName: 'User'
      };
      expect(user.id).toBeDefined();
      expect(user.username).toBeDefined();
      expect(user.email).toBeDefined();
      expect(user.role).toBeDefined();
      expect(user.firstName).toBeDefined();
      expect(user.lastName).toBeDefined();
    });
  });
});
