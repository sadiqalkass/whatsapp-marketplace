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

    return (
        <div className='min-h-screen bg-gray-50'>
            {children}
        </div>
    )
}