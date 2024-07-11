import UserAuth from "@/components/UserAuth";
import userService from "@/services/userService";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.mock('../../src/services/userService', () => ({
    login: jest.fn(),
    logout: jest.fn(),
    register: jest.fn()
}));

describe('UserAuth Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renders login form initially', () => {
        render(<UserAuth />);
        
        expect(screen.getByRole('heading', { name: /login/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
        expect(screen.getByText(/don't have an account?/i)).toBeInTheDocument();
        expect(screen.getByText(/register/i)).toBeInTheDocument();
    });
    
    it('toggles to registration form', () => {
        render(<UserAuth />);
        
        fireEvent.click(screen.getByText(/register/i));
        
        expect(screen.getByRole('heading', { name: /register/i })).toBeInTheDocument();
        expect(screen.getByLabelText(/email:/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/password:/i)).toBeInTheDocument();
        expect(screen.getByText(/already have an account?/i)).toBeInTheDocument();
        expect(screen.getByText(/login/i)).toBeInTheDocument();
    });

    it('submits login form', async () => {
        const email = 'test@example.com';
        const password = 'password';
        
        userService.login.mockResolvedValueOnce({});
        
        render(<UserAuth />);
        
        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        
        expect(userService.login).toHaveBeenCalledWith({ email, password });
    });

    it('submits invalid login form', async () => {
        const email = 'test@example.com';
        const password = 'password';

        userService.login.mockImplementationOnce(() => { throw new Error(); });
        render(<UserAuth />);

        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));

        const errorText = await screen.findByText('Login failed, check credentials')
        expect(errorText).toBeInTheDocument();
        expect(userService.login).toHaveBeenCalledWith({ email, password });
    });
    
    it('submits registration form', async () => {
        const email = 'test@example.com';
        const password = 'password';
        
        render(<UserAuth />);
        
        fireEvent.click(screen.getByText(/register/i));
        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));
        
        expect(userService.register).toHaveBeenCalledWith({ email, password });
    });

    it('submits invalid registration form', async () => {
        const email = 'test@example.com';
        const password = 'password';

        userService.register.mockImplementationOnce(() => { throw new Error(); });
        render(<UserAuth />);

        fireEvent.click(screen.getByText(/register/i));
        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /register/i }));

        const errorText = await screen.findByText('Registration failed, try again')
        expect(errorText).toBeInTheDocument();
        expect(userService.register).toHaveBeenCalledWith({ email, password });
    });
    
    it('logs out user', async () => {
        const email = 'test@example.com';
        const password = 'password';

        render(<UserAuth />);

        fireEvent.change(screen.getByLabelText(/email:/i), { target: { value: email } });
        fireEvent.change(screen.getByLabelText(/password:/i), { target: { value: password } });
        fireEvent.click(screen.getByRole('button', { name: /login/i }));
        fireEvent.click(await screen.findByRole('button', { name: /logout/i }));
        
        expect(userService.logout).toHaveBeenCalled();
    });
});