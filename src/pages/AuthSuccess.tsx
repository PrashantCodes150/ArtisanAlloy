import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context';
import { Loader2 } from 'lucide-react';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { updateUser } = useAuth();

    useEffect(() => {
        const handleAuthSuccess = async () => {
            const token = searchParams.get('token');
            const refreshToken = searchParams.get('refresh');

            if (token && refreshToken) {
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);

                try {
                    // Fetch user data after setting tokens
                    const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const user = result.data.user;
                        updateUser(user);

                        // Redirect based on onboarding status
                        if (!user.preferences?.onboardingCompleted) {
                            navigate('/onboarding');
                        } else {
                            navigate('/dashboard');
                        }
                    } else {
                        navigate('/login-required');
                    }
                } catch (error) {
                    console.error('Error fetching user after Google login:', error);
                    navigate('/login-required');
                }
            } else {
                navigate('/login-required');
            }
        };

        handleAuthSuccess();
    }, [searchParams, navigate, updateUser]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-jewelry-dark text-jewelry-cream">
            <div className="w-20 h-20 bg-jewelry-gold/20 rounded-full flex items-center justify-center mb-6">
                <Loader2 className="w-10 h-10 text-jewelry-gold animate-spin" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-2 tracking-wide">Authenticating...</h2>
            <p className="font-sans text-jewelry-cream/60">Preparing your exclusive experience</p>
        </div>
    );
};

export default AuthSuccess;
