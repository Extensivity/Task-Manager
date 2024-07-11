import { useState } from "react";
import userService from "@/services/userService";

export default function UserAuth() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false);
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await userService.login({ email, password });
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            setError('Login failed, check credentials');
        }
    };

    const handleLogout = async () => {
        try {
            await userService.logout();
            setIsAuthenticated(false);
        } catch (err) {
            setError('Logout failed, try again');
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            await userService.register({ email, password });
            setIsAuthenticated(true);
            setError('');
        } catch (err) {
            setError('Registration failed, try again');
        }
    }

    return (
        <div>
            {!isAuthenticated ? (
                <form onSubmit={isRegistering ? handleRegister : handleLogin}>
                    <h2>{isRegistering ? 'Register' : 'Login'}</h2>
                    <div>
                        <label htmlFor="emailInput">Email:</label>
                        <input id="emailInput" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div>
                        <label htmlFor="passwordInput">Password:</label>
                        <input id="passwordInput" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    {error && <p>{error}</p>}
                    <button type="submit">{isRegistering ? 'Register' : 'Login'}</button>
                    <p>
                        {isRegistering ? (
                            <span>
                                Already have an account?
                                <a onClick={() => setIsRegistering(false)}>Login</a>
                            </span>
                        ) : (
                            <span>
                                Don't have an account?
                                <a onClick={() => setIsRegistering(true)}>Register</a>
                            </span>
                        )}
                    </p>
                </form>
            ) : (
                <div>
                    <p>Welcome, you are now logged in!</p>
                    <button onClick={handleLogout}>Logout</button>
                </div>
            )}
        </div>
    );
}
