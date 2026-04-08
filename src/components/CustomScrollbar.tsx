import { useState, useEffect, useCallback, useRef } from 'react';

interface CustomScrollbarProps {
    children: React.ReactNode;
}

const CustomScrollbar: React.FC<CustomScrollbarProps> = ({ children }) => {
    const [scrollPercentage, setScrollPercentage] = useState(0);
    const [thumbHeight, setThumbHeight] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [showScrollbar, setShowScrollbar] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const dragStartY = useRef(0);
    const dragStartScroll = useRef(0);
    const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Calculate thumb size and position
    const calculateScrollbar = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;

        const { scrollHeight, clientHeight, scrollTop } = container;

        // Calculate if content is scrollable
        if (scrollHeight <= clientHeight) {
            setShowScrollbar(false);
            return;
        }

        setShowScrollbar(true);

        // Calculate thumb height (minimum 40px for usability)
        const ratio = clientHeight / scrollHeight;
        const calculatedThumbHeight = Math.max(ratio * clientHeight, 40);
        setThumbHeight(calculatedThumbHeight);

        // Calculate scroll percentage
        const maxScroll = scrollHeight - clientHeight;
        const percentage = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
        setScrollPercentage(percentage);
    }, []);

    // Handle scroll events
    const handleScroll = useCallback(() => {
        calculateScrollbar();

        // Show scrollbar on scroll
        setIsHovered(true);

        // Auto-hide after 1.5 seconds of no scrolling
        if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current);
        }
        hideTimeoutRef.current = setTimeout(() => {
            if (!isDragging) {
                setIsHovered(false);
            }
        }, 1500);
    }, [calculateScrollbar, isDragging]);

    // Initialize and handle resize
    useEffect(() => {
        calculateScrollbar();
        window.addEventListener('resize', calculateScrollbar);
        return () => {
            window.removeEventListener('resize', calculateScrollbar);
            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
            }
        };
    }, [calculateScrollbar]);

    // Observe content changes
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const observer = new MutationObserver(calculateScrollbar);
        observer.observe(container, {
            childList: true,
            subtree: true,
            attributes: true
        });

        return () => observer.disconnect();
    }, [calculateScrollbar]);

    // Handle mouse drag for scrollbar thumb
    const handleThumbMouseDown = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsDragging(true);
        dragStartY.current = e.clientY;
        dragStartScroll.current = containerRef.current?.scrollTop || 0;
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!isDragging || !containerRef.current) return;

            const container = containerRef.current;
            const { scrollHeight, clientHeight } = container;
            const trackHeight = clientHeight - thumbHeight;
            const maxScroll = scrollHeight - clientHeight;

            const deltaY = e.clientY - dragStartY.current;
            const scrollDelta = (deltaY / trackHeight) * maxScroll;

            container.scrollTop = dragStartScroll.current + scrollDelta;
        };

        const handleMouseUp = () => {
            setIsDragging(false);
        };

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging, thumbHeight]);

    // Handle track click to jump to position
    const handleTrackClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const container = containerRef.current;
        if (!container) return;

        const track = e.currentTarget;
        const trackRect = track.getBoundingClientRect();
        const clickY = e.clientY - trackRect.top;
        const trackHeight = trackRect.height;

        const { scrollHeight, clientHeight } = container;
        const maxScroll = scrollHeight - clientHeight;

        // Calculate target scroll position (center thumb on click)
        const ratio = (clickY - thumbHeight / 2) / (trackHeight - thumbHeight);
        const clampedRatio = Math.max(0, Math.min(1, ratio));

        container.scrollTo({
            top: clampedRatio * maxScroll,
            behavior: 'smooth'
        });
    };

    // Calculate thumb position
    const trackHeight = containerRef.current?.clientHeight || 0;
    const thumbTop = ((trackHeight - thumbHeight) * scrollPercentage) / 100;

    return (
        <div
            className="fixed inset-0 overflow-hidden"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => !isDragging && setIsHovered(false)}
        >
            {/* Scrollable content container */}
            <div
                ref={containerRef}
                className="h-full w-full overflow-y-auto overflow-x-hidden custom-scroll-container"
                onScroll={handleScroll}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                }}
            >
                {children}
            </div>

            {/* Custom Scrollbar Track - completely transparent */}
            {showScrollbar && (
                <div
                    className={`fixed right-0 top-0 bottom-0 w-3 z-[9999] transition-opacity duration-300 ${isHovered || isDragging ? 'opacity-100' : 'opacity-0'
                        }`}
                    onClick={handleTrackClick}
                    style={{
                        cursor: 'pointer',
                        // Completely transparent track - no background at all
                        background: 'transparent',
                    }}
                >
                    {/* Custom Scrollbar Thumb - Gold floating bar */}
                    <div
                        className={`absolute right-1 w-[6px] rounded-full cursor-grab transition-all duration-150 ${isDragging ? 'cursor-grabbing scale-x-125' : 'hover:scale-x-125'
                            }`}
                        style={{
                            top: `${thumbTop}px`,
                            height: `${thumbHeight}px`,
                            background: isDragging
                                ? '#D4AF37' // Darker gold when dragging
                                : 'linear-gradient(180deg, #F5C542 0%, #D4AF37 100%)', // Gold gradient
                            boxShadow: isHovered
                                ? '0 0 10px rgba(245, 197, 66, 0.5), 0 0 20px rgba(212, 175, 55, 0.3)'
                                : '0 0 5px rgba(245, 197, 66, 0.3)',
                            border: 'none',
                        }}
                        onMouseDown={handleThumbMouseDown}
                    />
                </div>
            )}
        </div>
    );
};

export default CustomScrollbar;
