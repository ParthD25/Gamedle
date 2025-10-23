import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
    children: React.ReactElement;
}
// Sources:
// - React Router Docs. “<Navigate> for redirects; route protection patterns.” Accessed 23 Oct. 2025.
// - AI assistance: Portions drafted with OpenAI ChatGPT (GPT-5 Thinking), verified and adapted by the author for correctness.
// Accessed 23 Oct. 2025.
export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return <div />;
    }

    if (!isAuthenticated) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};