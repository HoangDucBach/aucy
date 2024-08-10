import { useState, useEffect } from 'react';

function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
        const mediaQueryList = window.matchMedia(query);
        const documentChangeHandler = () => setMatches(mediaQueryList.matches);

        mediaQueryList.addEventListener('change', documentChangeHandler);

        // Set the initial state
        setMatches(mediaQueryList.matches);

        return () => {
            mediaQueryList.removeEventListener('change', documentChangeHandler);
        };
    }, [query]);

    return matches;
}
interface MediaProps {
    isMobile: boolean;
    isTablet: boolean;
    isLaptop: boolean;
    isDesktop: boolean;
}

export function useMedia(): MediaProps {
    const isMobile = useMediaQuery('(max-width: 640px)');
    const isTablet = useMediaQuery('(max-width: 768px)');
    const isLaptop = useMediaQuery('(max-width: 1024px)');
    const isDesktop = useMediaQuery('(min-width: 1025px)');

    return {
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
    };
}