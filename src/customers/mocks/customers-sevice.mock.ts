export const mockCustomersService = {
  create: jest.fn().mockImplementation(() => Promise.resolve()),
  findAll: jest.fn().mockImplementation(() => Promise.resolve([])),
};
