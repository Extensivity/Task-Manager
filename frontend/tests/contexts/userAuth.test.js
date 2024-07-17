import React from 'react';
import { render, act, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '@/contexts/userAuth';
import userService from '@/services/userService';


jest.mock('next/router', () => jest.requireActual('next-router-mock'));
jest.mock('../../src/services/userService');


const TestComponent = () => {
    const { user, login, logout } = useAuth();
    return (
        <div>
            <div>{user ? `User: ${user.username}` : 'No user'}</div>
            <button onClick={() => login('test', 'password')}>Login</button>
            <button onClick={logout}>Logout</button>
        </div>
    );
};

describe('AuthContext', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should provide login and logout functionality', async () => {
        const mockUser = { id: 1, username: 'test' };
        userService.login.mockResolvedValueOnce({ token: 'testToken', user: mockUser });
        userService.fetchUser.mockResolvedValueOnce({ user: mockUser });

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(getByText('No user')).toBeInTheDocument();
        await act(async () => { getByText('Login').click(); });
        await waitFor(() => expect(getByText(`User: ${mockUser.username}`)).toBeInTheDocument());
        await act(async () => { getByText('Logout').click(); });
        await waitFor(() => expect(getByText('No user')).toBeInTheDocument());
    });

    it('should handle login failure', async () => {
        userService.login.mockRejectedValueOnce(new Error('Login failed'));

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => { getByText('Login').click(); });
        await waitFor(() => expect(getByText('No user')).toBeInTheDocument());
    });

    it('should handle logout failure', async () => {
        const mockUser = { id: 1, username: 'test' };
        userService.login.mockResolvedValueOnce({ token: 'testToken', user: mockUser });
        userService.logout.mockRejectedValueOnce(new Error('Logout failed'));

        const { getByText } = render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        await act(async () => { getByText('Login').click(); });
        await waitFor(() => expect(getByText(`User: ${mockUser.username}`)).toBeInTheDocument());
        await act(async () => { getByText('Logout').click(); });
        await waitFor(() => expect(getByText(`User: ${mockUser.username}`)).toBeInTheDocument());
    });
});
