const { handleLoginRequest } = require('./budgetRoutes');

describe('handleLoginRequest', () => {
    it('should send 401 if user does not exist', async () => {
        const req = {
            body: {
                id: 'testuser',
                username: 'testuser',
            }
        };
        const res = {
            status: jest.fn(() => res),
            json: jest.fn()
        };

        await handleLoginRequest(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith("Login failed. There seems to be an issue with the username or ID.");
    });

    // Add more test cases for other scenarios
});