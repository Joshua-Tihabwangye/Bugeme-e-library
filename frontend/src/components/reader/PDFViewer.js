import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// Set worker source
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
const HIGHLIGHT_COLORS = [
    { name: 'Yellow', value: 'yellow', bg: 'rgba(255, 255, 0, 0.3)' },
    { name: 'Green', value: 'green', bg: 'rgba(0, 255, 0, 0.3)' },
    { name: 'Blue', value: 'blue', bg: 'rgba(0, 150, 255, 0.3)' },
    { name: 'Pink', value: 'pink', bg: 'rgba(255, 105, 180, 0.3)' },
    { name: 'Purple', value: 'purple', bg: 'rgba(147, 51, 234, 0.3)' },
    { name: 'Orange', value: 'orange', bg: 'rgba(255,  165, 0, 0.3)' },
];
const ANNOTATION_TYPES = [
    { name: 'Highlight', value: 'highlight', icon: '🖍️' },
    { name: 'Underline', value: 'underline', icon: '📏' },
];
const PDFViewer = ({ fileUrl, initialPage = 1, onPageChange, onLoadSuccess, highlights = [], onCreateHighlight, onDeleteHighlight, userEmail = 'user@bugema.com' }) => {
    const [numPages, setNumPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(initialPage);
    const [scale, setScale] = useState(1.0);
    const [showPreview, setShowPreview] = useState(false); // Hidden by default on mobile
    const [selectedColor, setSelectedColor] = useState('yellow');
    const [selectedText, setSelectedText] = useState('');
    const [showHighlightMenu, setShowHighlightMenu] = useState(false);
    const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
    const [annotationType, setAnnotationType] = useState('highlight');
    const [isMobile, setIsMobile] = useState(false);
    const [showMobileToolbar, setShowMobileToolbar] = useState(true);
    const [pdfError, setPdfError] = useState(null);
    const [retryCount, setRetryCount] = useState(0);
    const [activeHighlightId, setActiveHighlightId] = useState(null);
    const containerRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const pageRefs = useRef(new Map());
    // Detect mobile device and set appropriate defaults
    // Detect mobile device and set appropriate defaults
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 768;
            setIsMobile(mobile);
            // Auto-adjust scale for mobile - optimize for readability
            if (mobile) {
                // Calculate scale to fit screen width with minimal padding for maximum reading area
                const containerWidth = window.innerWidth - 16; // 8px padding each side
                const pdfDefaultWidth = 612; // Standard PDF page width in points
                // Scale up to fit width, minimum 0.8 for readability
                const idealScale = containerWidth / pdfDefaultWidth;
                const newScale = Math.max(0.8, Math.min(idealScale, 1.5));
                // Only update scale if it changes significantly (prevent flickering from small browser UI resizes)
                setScale(prevScale => {
                    if (Math.abs(prevScale - newScale) > 0.05) {
                        return newScale;
                    }
                    return prevScale;
                });
                setShowPreview(false);
            }
            else {
                setScale(1.5);
                setShowPreview(true);
            }
        };
        checkMobile();
        // Debounce resize event
        let timeoutId;
        const handleResize = () => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(checkMobile, 100);
        };
        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
            clearTimeout(timeoutId);
        };
    }, []);
    useEffect(() => {
        setCurrentPage(initialPage);
    }, [initialPage]);
    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages);
        setPdfError(null);
        if (onLoadSuccess)
            onLoadSuccess(numPages);
    }
    function onDocumentLoadError(error) {
        console.error('PDF load error:', error);
        setPdfError(error.message || 'Failed to load PDF');
    }
    const handleRetry = () => {
        setPdfError(null);
        setRetryCount(prev => prev + 1);
    };
    // Track scroll position to update current page
    const handleScroll = useCallback(() => {
        if (!scrollContainerRef.current)
            return;
        // Find which page is most visible
        let maxVisiblePage = 1;
        let maxVisibility = 0;
        pageRefs.current.forEach((element, pageNum) => {
            const rect = element.getBoundingClientRect();
            const containerRect = scrollContainerRef.current.getBoundingClientRect();
            const visibleTop = Math.max(rect.top, containerRect.top);
            const visibleBottom = Math.min(rect.bottom, containerRect.bottom);
            const visibleHeight = Math.max(0, visibleBottom - visibleTop);
            if (visibleHeight > maxVisibility) {
                maxVisibility = visibleHeight;
                maxVisiblePage = pageNum;
            }
        });
        if (maxVisiblePage !== currentPage) {
            setCurrentPage(maxVisiblePage);
            if (onPageChange)
                onPageChange(maxVisiblePage);
        }
    }, [currentPage, onPageChange]);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container)
            return;
        container.addEventListener('scroll', handleScroll);
        return () => container.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);
    // Handle text selection for highlighting
    const handleTextSelection = () => {
        const selection = window.getSelection();
        if (!selection || selection.isCollapsed) {
            setShowHighlightMenu(false);
            return;
        }
        const text = selection.toString().trim();
        if (text.length === 0) {
            setShowHighlightMenu(false);
            return;
        }
        setSelectedText(text);
        // Get selection position
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        setMenuPosition({
            x: rect.left + rect.width / 2,
            y: rect.top - 50
        });
        setShowHighlightMenu(true);
        setActiveHighlightId(null);
    };
    const createHighlight = (type) => {
        if (!selectedText || !onCreateHighlight)
            return;
        const selection = window.getSelection();
        if (!selection)
            return;
        const range = selection.getRangeAt(0);
        const clientRects = Array.from(range.getClientRects());
        const pageElement = pageRefs.current.get(currentPage);
        if (!pageElement)
            return;
        const pageRect = pageElement.getBoundingClientRect();
        const rects = clientRects.map(rect => ({
            x: (rect.left - pageRect.left) / pageRect.width,
            y: (rect.top - pageRect.top) / pageRect.height,
            width: rect.width / pageRect.width,
            height: rect.height / pageRect.height,
            pageIndex: currentPage
        }));
        onCreateHighlight({
            page_number: currentPage,
            text_content: selectedText,
            color: type === 'underline' ? `${selectedColor}-underline` : selectedColor,
            position_data: { rects },
        });
        setShowHighlightMenu(false);
        selection.removeAllRanges();
        setSelectedText('');
    };
    const handleDeleteHighlight = (id) => {
        if (onDeleteHighlight) {
            onDeleteHighlight(id);
            setActiveHighlightId(null);
        }
    };
    const scrollToPage = (pageNum) => {
        const pageElement = pageRefs.current.get(pageNum);
        if (pageElement && scrollContainerRef.current) {
            pageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    // Mobile page jump
    const handlePageJump = (e) => {
        const page = parseInt(e.target.value, 10);
        if (page >= 1 && page <= numPages) {
            scrollToPage(page);
        }
    };
    return (_jsxs("div", { className: `flex ${isMobile ? 'flex-col' : 'gap-4'} h-full`, ref: containerRef, children: [_jsxs("div", { className: "flex-1 flex flex-col", children: [isMobile && (_jsxs("button", { onClick: () => setShowMobileToolbar(!showMobileToolbar), className: "mb-2 flex items-center justify-center gap-2 rounded-lg bg-slate-100 p-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-300", children: [showMobileToolbar ? 'Hide Controls' : 'Show Controls', _jsx("svg", { className: `h-4 w-4 transition-transform ${showMobileToolbar ? 'rotate-180' : ''}`, fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 9l-7 7-7-7" }) })] })), (!isMobile || showMobileToolbar) && (_jsxs("div", { className: `mb-4 flex items-center justify-between gap-2 rounded-lg bg-white p-2 shadow-lg dark:bg-slate-800 ${isMobile ? 'flex-wrap' : 'gap-4 p-3'}`, children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { type: "button", onClick: () => setScale(s => Math.max(0.5, s - 0.1)), className: "rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition", title: "Zoom Out", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20 12H4" }) }) }), _jsxs("span", { className: "min-w-[50px] text-center text-sm font-medium text-slate-600 dark:text-slate-400", children: [Math.round(scale * 100), "%"] }), _jsx("button", { type: "button", onClick: () => setScale(s => Math.min(2.5, s + 0.1)), className: "rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition", title: "Zoom In", children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 4v16m8-8H4" }) }) })] }), _jsx("div", { className: "flex items-center gap-2", children: isMobile ? (_jsxs("div", { className: "flex items-center gap-1", children: [_jsx("input", { type: "number", min: 1, max: numPages, value: currentPage, onChange: handlePageJump, className: "w-12 rounded border border-slate-300 p-1 text-center text-sm dark:border-slate-600 dark:bg-slate-700" }), _jsxs("span", { className: "text-sm text-slate-600 dark:text-slate-400", children: ["/ ", numPages] })] })) : (_jsxs("span", { className: "text-sm font-medium text-slate-900 dark:text-white", children: ["Page ", currentPage, " of ", numPages] })) }), !isMobile && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Type:" }), ANNOTATION_TYPES.map(type => (_jsx("button", { onClick: () => setAnnotationType(type.value), className: `px-2 py-1 rounded text-xs font-medium transition ${annotationType === type.value
                                                    ? 'bg-brand-500 text-white'
                                                    : 'bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-300'}`, title: type.name, children: type.icon }, type.value)))] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("span", { className: "text-xs text-slate-600 dark:text-slate-400", children: "Color:" }), HIGHLIGHT_COLORS.map(color => (_jsx("button", { onClick: () => setSelectedColor(color.value), className: `w-6 h-6 rounded border-2 transition ${selectedColor === color.value
                                                    ? 'border-slate-900 dark:border-white scale-110'
                                                    : 'border-slate-300 dark:border-slate-600'}`, style: { backgroundColor: color.bg }, title: color.name }, color.value)))] })] })), !isMobile && (_jsx("button", { type: "button", onClick: () => setShowPreview(!showPreview), className: "rounded p-2 hover:bg-slate-100 dark:hover:bg-slate-700 transition", title: showPreview ? 'Hide Preview' : 'Show Preview', children: _jsx("svg", { className: "h-5 w-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 6h16M4 12h16M4 18h16" }) }) }))] })), pdfError && (_jsxs("div", { className: "flex flex-col items-center justify-center gap-4 rounded-lg bg-rose-50 p-6 text-center dark:bg-rose-500/10", children: [_jsx("svg", { className: "h-12 w-12 text-rose-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-rose-700 dark:text-rose-400", children: "Failed to load PDF" }), _jsx("p", { className: "text-sm text-rose-600 dark:text-rose-300", children: pdfError })] }), _jsx("button", { onClick: handleRetry, className: "rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600", children: "Try Again" })] })), !pdfError && (_jsx("div", { ref: scrollContainerRef, className: `flex-1 overflow-y-auto overflow-x-hidden rounded-lg border border-slate-200 bg-slate-100 dark:border-slate-700 dark:bg-slate-900 ${isMobile ? 'p-1' : 'p-6'}`, style: {
                            maxHeight: isMobile ? 'calc(100vh - 120px)' : 'calc(100vh - 120px)',
                            minHeight: isMobile ? '500px' : '750px',
                            WebkitOverflowScrolling: 'touch' // Smooth scrolling on iOS
                        }, onMouseUp: handleTextSelection, onTouchEnd: handleTextSelection, children: _jsx("div", { className: "flex flex-col items-center gap-4", children: _jsx(Document, { file: fileUrl, onLoadSuccess: onDocumentLoadSuccess, onLoadError: onDocumentLoadError, loading: _jsxs("div", { className: "flex h-96 w-full flex-col items-center justify-center gap-3", children: [_jsx("div", { className: "h-12 w-12 animate-spin rounded-full border-4 border-brand-500 border-t-transparent" }), _jsx("p", { className: "text-sm text-slate-600 dark:text-slate-400", children: "Loading book..." })] }), error: _jsxs("div", { className: "flex h-96 w-full flex-col items-center justify-center text-rose-500", children: [_jsx("svg", { className: "h-12 w-12 mb-2", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }), _jsx("p", { children: "Failed to load PDF" }), _jsx("button", { onClick: handleRetry, className: "mt-3 rounded-lg bg-rose-500 px-4 py-2 text-sm font-medium text-white hover:bg-rose-600", children: "Try Again" })] }), children: Array.from(new Array(numPages), (el, index) => {
                                    const pageNum = index + 1;
                                    return (_jsxs("div", { ref: (el) => {
                                            if (el)
                                                pageRefs.current.set(pageNum, el);
                                        }, className: `relative ${isMobile ? 'mb-1' : 'mb-6'} shadow-2xl`, children: [_jsx(Page, { pageNumber: pageNum, scale: scale, renderTextLayer: true, renderAnnotationLayer: !isMobile, className: "bg-white", width: isMobile ? window.innerWidth - 16 : undefined }), !isMobile && highlights
                                                .filter(h => h.page_number === pageNum)
                                                .map(highlight => {
                                                const isUnderline = highlight.color.includes('-underline');
                                                const baseColor = highlight.color.replace('-underline', '');
                                                const colorConfig = HIGHLIGHT_COLORS.find(c => c.value === baseColor);
                                                const rects = highlight.position_data?.rects || [{ x: 0, y: 0, width: 1, height: 1 }];
                                                return (_jsxs("div", { className: "absolute inset-0 pointer-events-none", children: [rects.map((rect, i) => (_jsx("div", { className: "absolute cursor-pointer pointer-events-auto hover:opacity-80 transition-opacity", style: isUnderline ? {
                                                                left: `${rect.x * 100}%`,
                                                                top: `${rect.y * 100}%`,
                                                                width: `${rect.width * 100}%`,
                                                                height: `${rect.height * 100}%`,
                                                                borderBottom: `3px solid ${colorConfig?.bg.replace('0.3', '0.8') || 'rgba(255, 255, 0, 0.8)'}`,
                                                            } : {
                                                                left: `${rect.x * 100}%`,
                                                                top: `${rect.y * 100}%`,
                                                                width: `${rect.width * 100}%`,
                                                                height: `${rect.height * 100}%`,
                                                                backgroundColor: colorConfig?.bg || 'rgba(255, 255, 0, 0.3)'
                                                            }, title: highlight.text_content, onClick: (e) => {
                                                                e.stopPropagation();
                                                                setActiveHighlightId(activeHighlightId === highlight.id ? null : highlight.id);
                                                            } }, i))), activeHighlightId === highlight.id && (_jsx("div", { className: "absolute z-50 bg-white rounded shadow-lg border border-slate-200 p-1 pointer-events-auto", style: {
                                                                left: `${rects[0].x * 100}%`,
                                                                top: `${(rects[0].y * 100) - 5}%`,
                                                                transform: 'translateY(-100%)'
                                                            }, children: _jsxs("button", { onClick: (e) => {
                                                                    e.stopPropagation();
                                                                    handleDeleteHighlight(highlight.id);
                                                                }, className: "flex items-center gap-1 px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded", children: [_jsx("svg", { className: "w-3 h-3", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" }) }), "Remove"] }) }))] }, highlight.id));
                                            })] }, `page_${pageNum}`));
                                }) }, retryCount) }) }))] }), showPreview && !isMobile && (_jsxs("div", { className: "w-[280px] flex flex-col gap-3 rounded-lg bg-white p-4 shadow-lg dark:bg-slate-800 overflow-y-auto", style: { maxHeight: 'calc(100vh - 120px)' }, children: [_jsx("h3", { className: "text-sm font-bold text-slate-900 dark:text-white mb-2", children: "Page Navigation" }), _jsx("div", { className: "space-y-3", children: Array.from(new Array(Math.min(numPages, 50)), (el, index) => {
                            const pageNum = index + 1;
                            const isCurrent = pageNum === currentPage;
                            return (_jsxs("button", { onClick: () => scrollToPage(pageNum), className: `group relative w-full rounded-lg border-2 p-2 transition ${isCurrent
                                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/20'
                                    : 'border-slate-200 hover:border-brand-300 dark:border-slate-700'}`, children: [_jsxs("div", { className: "text-xs font-semibold text-slate-600 dark:text-slate-400 mb-1", children: ["Page ", pageNum] }), _jsx("div", { className: "aspect-[8.5/11] bg-slate-100 dark:bg-slate-700 rounded overflow-hidden", children: _jsx(Document, { file: fileUrl, loading: _jsx("div", { className: "w-full h-full bg-slate-200 dark:bg-slate-600" }), children: _jsx(Page, { pageNumber: pageNum, scale: 0.15, renderTextLayer: false, renderAnnotationLayer: false }) }) }), isCurrent && (_jsx("div", { className: "absolute top-1 right-1 w-2 h-2 rounded-full bg-brand-500 animate-pulse" }))] }, `preview_${pageNum}`));
                        }) }), numPages > 50 && (_jsx("p", { className: "text-xs text-slate-500 dark:text-slate-400 text-center mt-2", children: "Showing first 50 pages" }))] })), showHighlightMenu && !isMobile && (_jsx("div", { className: "fixed z-50 rounded-lg bg-white p-2 shadow-xl dark:bg-slate-800 border border-slate-200 dark:border-slate-700", style: {
                    left: `${menuPosition.x}px`,
                    top: `${menuPosition.y}px`,
                    transform: 'translateX(-50%)'
                }, children: _jsxs("div", { className: "space-y-1", children: [_jsxs("button", { onClick: () => createHighlight('highlight'), className: "flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700 transition w-full", children: [_jsx("div", { className: "w-4 h-4 rounded", style: { backgroundColor: HIGHLIGHT_COLORS.find(c => c.value === selectedColor)?.bg } }), "\uD83D\uDD8D\uFE0F Highlight"] }), _jsxs("button", { onClick: () => createHighlight('underline'), className: "flex items-center gap-2 rounded px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-100 dark:text-white dark:hover:bg-slate-700 transition w-full", children: [_jsx("div", { className: "w-4 h-1 rounded", style: { backgroundColor: HIGHLIGHT_COLORS.find(c => c.value === selectedColor)?.bg.replace('0.3', '0.8') } }), "\uD83D\uDCCF Underline"] })] }) }))] }));
};
export default PDFViewer;
