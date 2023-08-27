const { authenticateToken } = require('./middleware');

describe('authenticateToken', () => {
    it('should send 401 if authHeader is undefined', () => {
        const req = {
            headers: {
                authorization: undefined
            }
        };
        const jsonMock = jest.fn();
        const statusMock = jest.fn(() => ({ json: jsonMock }));
        const res = {
            status: statusMock
        };
        const next = jest.fn();

        authenticateToken(req, res, next);

        expect(statusMock).toHaveBeenCalledWith(401);
        expect(jsonMock).toHaveBeenCalledWith('Please provide token');
        expect(next).not.toHaveBeenCalled();
    });
});