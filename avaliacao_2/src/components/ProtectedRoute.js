// projeto_individual_frontend/avaliacao_2/src/components/ProtectedRoute.js
'use client'

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ProtectedRoute = ({ children }) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');

        if (!token || !userId) {
            localStorage.clear();
            router.push('/pages/login');
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