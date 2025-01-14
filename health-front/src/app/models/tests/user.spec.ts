import { User, UserRole, UsersResponse } from '../../models/user';

describe('User Service', () => {
  let mockUser: User;

  beforeEach(() => {
    mockUser = {
      id: '1',
      username: 'test',
      email: 'test@test.com',
      role: UserRole.Admin,
      firstName: 'Test',
      lastName: 'User'
    };
  });

  it('should create a UsersResponse object with user items', () => {
    const usersResponse: UsersResponse = {
      items: [mockUser], // Use 'items' instead of 'users'
      totalCount: 1,
      pageNumber: 1,
      pageSize: 10
    };

    expect(usersResponse.items).toBeDefined();
    expect(usersResponse.items.length).toBe(1);
    expect(usersResponse.items[0]).toEqual(mockUser);
  });

  it('should create an empty UsersResponse object', () => {
    const usersResponse: UsersResponse = {
      items: [], // Use 'items' instead of 'users'
      totalCount: 0,
      pageNumber: 1,
      pageSize: 10
    };

    expect(usersResponse.items).toBeDefined();
    expect(usersResponse.items.length).toBe(0);
  });
});
