import { createRandomCredentials } from "../components/task.helper";
import userService from "@/services/userService";
import { faker } from "@faker-js/faker";


global.fetch = jest.fn();

describe('User Service', () => {
    let fetchSpy;

    beforeAll(() => {
        fetchSpy = jest.spyOn(global, 'fetch').mockImplementation(() => Promise.resolve({
            ok: true,
            json: () => Promise.resolve({})
        }));
    });

    afterEach(() => {
        fetchSpy.mockClear();
    });

    afterAll(() => {
        fetchSpy.mockRestore();
    });
    
    it('should handle login', async () => {
        // UUID should be good enough for the token
        const token = faker.string.uuid();
        const credentials = createRandomCredentials();
        const expectingPayload = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(credentials)
        };

        fetchSpy.mockResolvedValueOnce({
            ok: true, json: async () => token
        });

        const result = await userService.login(credentials);
        expect(result).toEqual(token);
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });

    it('should handle a registration', async () => {
        // UUID should be good enough for the token
        const token = faker.string.uuid();
        const credentials = createRandomCredentials();
        const expectingPayload = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        };

        fetchSpy.mockResolvedValueOnce({
            ok: true, json: async () => token
        });

        const result = await userService.register(credentials);
        expect(result).toEqual(token);
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });

    it('should handle a logout', async () => {
        const expectingPayload = { method: 'POST', credentials: 'include' };
        await userService.logout();
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });
});
