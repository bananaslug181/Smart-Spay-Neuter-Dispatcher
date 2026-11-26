import './index.css'
const API_BASE_URL = (import.meta as ImportMeta & { readonly env: { readonly VITE_API_URL?: string } }).env.VITE_API_URL || 'http://localhost:8001';

function LoginPage() {

    const handleLoginRedirect = (role: 'client' | 'clinic') => {
         window.location.href = `${API_BASE_URL}/login?role=${role}`;
    };

    // direct the user to the login route on backend when clicked?
    return (
    <>
        <html>
        <head>
            <title>Login with OAuth2.0</title>
        </head>
        <body>
            <h1>Login/Register</h1>
            <button onClick={() =>
                handleLoginRedirect('client')}>
            Login as a Client
            </button>
            <button onClick={() =>
                handleLoginRedirect('clinic')}>
            Login as a Clinic
            </button>
        </body>
        </html>
    </>
    );
}
export default LoginPage;