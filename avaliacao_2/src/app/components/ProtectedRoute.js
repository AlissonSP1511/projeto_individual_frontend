'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/pages/home');
        }
    }, []);

    return children;
};

export default ProtectedRoute; 


// 'use client'


// export default function Dashboard() {
//     return (
//         <ProtectedRoute>
//             <Pagina titulo="Dashboard">
//                 {/* conteúdo da página */}
//             </Pagina>
//         </ProtectedRoute>
//     );
// }