import { supabase } from '../services/supabaseClient';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Interface for waitlist status
export interface WaitlistStatus {
  isWaitlisted: boolean;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

/**
 * Custom hook to check if the current user is on the waitlist
 * and redirect to the waitlist page if needed
 * 
 * @param {string[]} publicRoutes - Routes that are accessible without authentication
 * @param {string[]} exemptRoutes - Routes that waitlisted users can access
 * @param {string} redirectPath - Path to redirect waitlisted users to
 * @returns {WaitlistStatus} Waitlist status object
 */
export const useWaitlistCheck = (
  publicRoutes: string[] = ['/home', '/', '/login', '/register', '/forgot-password', '/waitlist', '/demo-stock'],
  exemptRoutes: string[] = ['/waitlist', '/auth/callback', '/login', '/register', '/forgot-password', '/demo-stock'],
  redirectPath: string = '/waitlist'
): WaitlistStatus => {
  const [isWaitlisted, setIsWaitlisted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkWaitlistStatus = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Current path
        const currentPath = window.location.pathname;
        
        // Check if current path is a public route that doesn't require authentication
        const isPublicRoute = publicRoutes.some(route => 
          currentPath === route || currentPath.startsWith(route + '/')
        );
        
        if (isPublicRoute) {
          // Public routes should be accessible without authentication checks
          setIsWaitlisted(false);
          setIsLoading(false);
          return;
        }

        // First check if user is authenticated
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          throw sessionError;
        }

        // If not authenticated, redirect to login or allow public access
        if (!session || !session.user) {
          setIsAuthenticated(false);
          setIsWaitlisted(false);
          
          // If not a public route, redirect to login
          if (!isPublicRoute) {
            navigate('/login');
          }
          
          setIsLoading(false);
          return;
        }

        // User is authenticated
        setIsAuthenticated(true);

        // Get user profile to check waitlist status
        const { data: profile, error: profileError } = await supabase
          .from('users')
          .select('is_waitlisted')
          .eq('uid', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error:', profileError);
          // Don't throw error, assume not waitlisted if we can't fetch profile
          setIsWaitlisted(false);
          setIsLoading(false);
          return;
        }

        // Important fix: Only set waitlisted to true if is_waitlisted is explicitly true
        const waitlisted = profile?.is_waitlisted === true;
        setIsWaitlisted(waitlisted);

        console.log('Waitlist status:', waitlisted);

        // Check if current path is exempt from redirect
        const isExemptRoute = exemptRoutes.some(route => 
          currentPath === route || currentPath.startsWith(route + '/')
        );

        // Only redirect if explicitly waitlisted AND not on an exempt route
        if (waitlisted && !isExemptRoute) {
          navigate(redirectPath);
        }
      } catch (err) {
        console.error('Error checking waitlist status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check waitlist status');
        // Assume not waitlisted on error to prevent wrongful redirects
        setIsWaitlisted(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkWaitlistStatus();
  }, [navigate, redirectPath, exemptRoutes, publicRoutes]);

  return { isWaitlisted, isLoading, error, isAuthenticated };
};

/**
 * Checks if a user is on the waitlist
 * @param userId User ID to check
 * @returns Promise with waitlist status
 */
export const checkUserWaitlistStatus = async (userId: string): Promise<boolean> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('is_waitlisted')
      .eq('uid', userId)
      .single();
    
    if (error) throw error;
    
    // Only return true if is_waitlisted is explicitly true
    return data?.is_waitlisted === true;
  } catch (error) {
    console.error('Error checking user waitlist status:', error);
    // Default to false (not restricted) if there's an error
    return false;
  }
};

/**
 * Call the Supabase function to get current user's waitlist status
 * @returns Promise with waitlist status
 */
export const getCurrentUserWaitlistStatus = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.rpc('get_waitlist_status');
    
    if (error) throw error;
    
    // Only return true if explicitly true
    return data === true;
  } catch (error) {
    console.error('Error getting waitlist status:', error);
    // Default to false (not restricted) if there's an error
    return false;
  }
}; 