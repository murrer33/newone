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
  publicRoutes: string[] = ['/home', '/', '/login', '/register', '/forgot-password', '/waitlist'],
  exemptRoutes: string[] = ['/waitlist', '/auth/callback', '/login', '/register', '/forgot-password'],
  redirectPath: string = '/waitlist'
): WaitlistStatus => {
  const [isWaitlisted, setIsWaitlisted] = useState<boolean>(true);
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
          throw profileError;
        }

        // Set waitlist status (default to true if not set)
        const waitlisted = profile?.is_waitlisted !== false;
        setIsWaitlisted(waitlisted);

        // Check if current path is exempt from redirect
        const isExemptRoute = exemptRoutes.some(route => 
          currentPath === route || currentPath.startsWith(route + '/')
        );

        // Redirect if on waitlist and not on an exempt route
        if (waitlisted && !isExemptRoute) {
          navigate(redirectPath);
        }
      } catch (err) {
        console.error('Error checking waitlist status:', err);
        setError(err instanceof Error ? err.message : 'Failed to check waitlist status');
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
    
    // If is_waitlisted is explicitly false, return false, otherwise return true
    return data?.is_waitlisted !== false;
  } catch (error) {
    console.error('Error checking user waitlist status:', error);
    // Default to true (restricted) if there's an error
    return true;
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
    
    // If explicitly false, return false, otherwise true
    return data !== false;
  } catch (error) {
    console.error('Error getting waitlist status:', error);
    // Default to true (restricted) if there's an error
    return true;
  }
}; 