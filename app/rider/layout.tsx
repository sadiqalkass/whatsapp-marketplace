'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';

export default function RiderLayout({
    children, 
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();

    useEffect(() => {
        const user = authService.getUser();
        const isAuth = authService.isAuthenticated();

        // Check if user is logged in and is a rider
        if (!isAuth) {
            router.replace('/rider/login');
            return;
        }

        if (user?.role !== 'RIDER') {
            router.replace('/');
            return;
        }
    }, [router]);

    return (
        <div className='min-h-screen bg-gray-50'>
            {children}
        </div>
    )
}