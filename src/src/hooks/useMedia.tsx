import { useMediaQuery } from 'react-responsive'

interface MediaProps {
    isMobile: boolean
    isTablet: boolean
    isLaptop: boolean
    isDesktop: boolean
}
export function useMedia(): MediaProps {
    const isMobile = useMediaQuery({ query: '(max-width: 640px)' })
    const isTablet = useMediaQuery({ query: '(max-width: 768px)' })
    const isLaptop = useMediaQuery({ query: '(max-width: 1024px)' })
    const isDesktop = useMediaQuery({ query: '(min-width: 1025px)' })

    return {
        isMobile,
        isTablet,
        isLaptop,
        isDesktop,
    }
}