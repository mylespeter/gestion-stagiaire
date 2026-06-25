"use client";

import { useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter, usePathname } from 'next/navigation';
import { Loader } from './ui/Loader';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Pages publiques (accessibles sans connexion)
  const publicPages = ['/login', '/register', '/forgot-password'];

  useEffect(() => {
    if (!loading) {
      const isPublicPage = publicPages.includes(pathname);

      if (!isAuthenticated && !isPublicPage) {
        // Sauvegarder la page demandée pour rediriger après login
        sessionStorage.setItem('redirectAfterLogin', pathname);
        router.replace('/login');
      }

      // Si l'utilisateur est connecté et tente d'accéder à une page publique
      if (isAuthenticated && isPublicPage) {
        const redirectPath = sessionStorage.getItem('redirectAfterLogin') || '/dashboard';
        sessionStorage.removeItem('redirectAfterLogin');
        router.replace(redirectPath);
      }
    }
  }, [isAuthenticated, loading, pathname, router]);

  // Afficher un loader global pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className='w-16 w mx-auto'>


         <Loader />
          </div>
          <p className="text-sm text-gray-500">Vérification de votre session...</p>
        </div>
      </div>
    );
  }

  // Si on est sur une page publique, on affiche normalement
  const isPublicPage = publicPages.includes(pathname);
  if (isPublicPage) {
    return <>{children}</>;
  }

  // Si pas authentifié et pas sur une page publique, ne rien afficher
  if (!isAuthenticated) {
    return null;
  }

  // Authentifié, afficher le contenu
  return <>{children}</>;
}