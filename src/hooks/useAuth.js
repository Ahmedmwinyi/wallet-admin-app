import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const useAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const key = localStorage.getItem('key');
        if (!key) {
            navigate('/');
        }
    }, [navigate]);
};

export default useAuth;
