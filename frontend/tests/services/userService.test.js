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
        const credentials = createRandomCredentials();
        const mockResponse = {
            token: faker.string.uuid(),
            user: {
                id: faker.number.int({ min: 1 }),
                username: faker.internet.userName()
            }
        };

        const expectingPayload = {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            credentials: 'include',
            body: JSON.stringify(credentials)
        };

        fetchSpy.mockResolvedValueOnce({
            ok: true, json: async () => mockResponse
        });

        const result = await userService.login(credentials);
        expect(result).toEqual(mockResponse);
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });

    it('should throw an error if login fails', async () => {
        const credentials = createRandomCredentials();
        fetchSpy.mockResolvedValueOnce({ ok: false });
        await expect(userService.login(credentials))
            .rejects.toThrow(/login failed/i);
    });

    it('should handle a registration', async () => {
        const credentials = createRandomCredentials();
        const mockResponse = {
            token: faker.string.uuid(),
            user: {
                id: faker.number.int({ min: 1 }),
                username: faker.internet.userName()
            }
        };

        const expectingPayload = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(credentials)
        };

        fetchSpy.mockResolvedValueOnce({
            ok: true, json: async () => mockResponse
        });

        const result = await userService.register(credentials);
        expect(result).toEqual(mockResponse);
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });

    it('should throw an error if registration fails', async () => {
        const credentials = createRandomCredentials();
        fetchSpy.mockResolvedValueOnce({ ok: false });
        await expect(userService.register(credentials))
            .rejects.toThrow(/registration failed/i);
    });

    it('should handle a logout', async () => {
        const expectingPayload = { method: 'POST', credentials: 'include' };
        await userService.logout();
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });

    it('should throw an error if logout fails', async () => {
        fetchSpy.mockResolvedValueOnce({ ok: false });
        await expect(userService.logout())
            .rejects.toThrow(/logout failed/i);
    });

    it('should handle fetching a user', async () => {
        const token = faker.string.uuid();
        const mockResponse = { user: {
            id: faker.number.int({ min: 1 }),
            username: faker.internet.userName()
        }};
        const expectingPayload = {
            headers: { 'Authorization': `Bearer ${token}` }
        };

        fetchSpy.mockResolvedValueOnce({
            ok: true, json: async () => mockResponse
        });

        const result = await userService.fetchUser(token);
        expect(result).toEqual(mockResponse);
        expect(fetchSpy).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining(expectingPayload)
        );
    });

    it('should throw an error if fetching user fails', async () => {
        const token = faker.string.uuid();
        fetchSpy.mockResolvedValueOnce({ ok: false });
        await expect(userService.fetchUser(token))
            .rejects.toThrow(/failed to fetch user/i);
    });
});

