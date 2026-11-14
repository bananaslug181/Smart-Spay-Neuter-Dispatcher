import './index.css'
const API_BASE_URL = (import.meta as ImportMeta & { readonly env: { readonly VITE_API_URL?: string } }).env.VITE_API_URL || 'http://localhost:8001';

function LoginPage() {

    // direct the user to the login route on backend when clicked?
    return (
    <>
        <html>
        <head>
        <title>OAuth Example</title>
        </head>
        <body>

            <h1>OAuth Example</h1>

            <h2>Click the button to authenticate</h2>

            <form method="POST">
                <a href={`${API_BASE_URL}/login`}>Log in with Google</a>
            </form>

        </body>
        </html>
    </>
    );
}
export default LoginPage;