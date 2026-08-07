import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import rawJsonData from '../data/resources.json' // Path preserved
import { Link, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

const FILE_KEY = "Front_end/my-app/src/data/AUN QA 2025 (Non-electronics).xlsx"
const FILE_KEY_2 = "Front_end/my-app/src/data/AUN QA 2025-2026 (electronics).xlsx"
const ITEMS_PER_PAGE = 60

const Dashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // if (!localStorage.getItem('username')) navigate('/sign-in')
    }, [navigate])

    const dataset = useMemo(() => {
        return { ...rawJsonData[FILE_KEY], ...rawJsonData[FILE_KEY_2] }
    }, [])

    const categories = useMemo(() => {
        return Object.keys(dataset).filter((key) => Array.isArray(dataset[key]))
    }, [dataset])

    const [selectedCategory, setSelectedCategory] = useState(categories[0] || "ตจวิทยา")
    const [searchTerm, setSearchTerm] = useState('')
    const [showAllMajors, setShowAllMajors] = useState(false)
    const [currentPage, setCurrentPage] = useState(0)

    const allMajorBooks = useMemo(() => {
        return categories.flatMap((category) => {
            const rawCategoryData = dataset[category]
            if (!Array.isArray(rawCategoryData)) return []

            return rawCategoryData.filter(
                (item) => item && item["Item OCLC Number"] !== "Item OCLC Number"
            )
        })
    }, [categories, dataset])

    const books = useMemo(() => {
        if (showAllMajors) return allMajorBooks

        const rawCategoryData = dataset[selectedCategory]
        if (!Array.isArray(rawCategoryData)) return []

        return rawCategoryData.filter(
            (item) => item && item["Item OCLC Number"] !== "Item OCLC Number"
        )
    }, [allMajorBooks, dataset, selectedCategory, showAllMajors])

    const filteredBooks = useMemo(() => {
        if (!searchTerm.trim()) return books
        const query = searchTerm.toLowerCase()

        return books.filter((book) => {
            const title = book["Title"]?.toString().toLowerCase() || ''
            const author = book["Author Name"]?.toString().toLowerCase() || ''
            const subject = book["Conspectus Subject"]?.toString().toLowerCase() || ''
            const oclc = book["Item OCLC Number"]?.toString().toLowerCase() || ''
            const callNum = book["LHR Item Call Number"]?.toString().toLowerCase() || ''

            return (
                title.includes(query) ||
                author.includes(query) ||
                subject.includes(query) ||
                oclc.includes(query) ||
                callNum.includes(query)
            )
        })
    }, [books, searchTerm])

    const pageCount = Math.max(1, Math.ceil(filteredBooks.length / ITEMS_PER_PAGE))

    const visiblePageNumbers = useMemo(() => {
        const delta = 3 // Number of pages to show on each side of the current page
        const start = Math.max(0, currentPage - delta) // Ensure delta don't go below 0
        const end = Math.min(pageCount - 1, currentPage + delta)// maximum page number is used to avoid going beyond the last page
        return Array.from({ length: end - start + 1 }, (_, i) => start + i)// Create an array of page numbers from start to end
    }, [currentPage, pageCount])

    const paginatedBooks = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE
        return filteredBooks.slice(start, start + ITEMS_PER_PAGE)
    }, [currentPage, filteredBooks])

    useEffect(() => {
        setCurrentPage(0)
    }, [selectedCategory, searchTerm, showAllMajors])

    return (
        <div className='min-h-screen bg-slate-50/70 px-3 py-5 sm:px-6 lg:px-8 text-slate-800 font-sans'>
            <div className='max-w-7xl mx-auto space-y-4'>
                
                {/* 1. Header */}
                <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm'>
                    <div className='flex items-center gap-3'>
                        {/* Header Icon (20px) */}
                        <div className='p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0 border border-indigo-100 flex items-center justify-center'>
                            <svg style={{ width: '20px', height: '20px', minWidth: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                        </div>
                        <div>
                            <div className='flex items-center gap-1.5'>
                                <span className='inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse'></span>
                                <span className='text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-slate-400'>AUN QA 2025 Portal</span>
                            </div>
                            <h1 className='text-base sm:text-lg font-bold text-slate-900 tracking-tight'>
                                Resource Catalog
                            </h1>
                        </div>
                    </div>

                    {/* Stat Badge Icon (15px) */}
                    <div className='flex items-center gap-2 self-start sm:self-auto bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80'>
                        <svg style={{ width: '15px', height: '15px', minWidth: '15px' }} className='text-indigo-600 shrink-0' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                        </svg>
                        <div className='text-xs'>
                            <span className='font-bold text-slate-800'>{categories.length}</span> <span className='text-slate-500 text-[11px]'>Departments</span>
                        </div>
                    </div>
                </header>

                {/* 2. Navigation Tabs */}
                <div className='bg-white p-1.5 rounded-xl border border-slate-200/80 shadow-sm'>
                    <div className='flex items-center gap-1.5 overflow-x-auto pb-0.5 pt-0.5 px-0.5 scrollbar-none'>
                        {categories.map((category) => {
                            const categoryItems = Array.isArray(dataset[category]) ? dataset[category] : []
                            const count = categoryItems.filter(
                                (item) => item && item["Item OCLC Number"] !== "Item OCLC Number"
                            ).length
                            const isActive = selectedCategory === category

                            return (
                                <button
                                    key={category}
                                    onClick={() => {
                                        setSelectedCategory(category)
                                        setSearchTerm('')
                                    }}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                                        isActive
                                            ? 'bg-slate-900 text-white shadow-sm'
                                            : 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                                    }`}
                                >
                                    {/* Category Folder Icon (13px) */}
                                    <svg style={{ width: '13px', height: '13px', minWidth: '13px' }} className='shrink-0 opacity-80' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z' />
                                    </svg>
                                    <span>{category}</span>
                                    <span
                                        className={`px-1.5 py-0.2 text-[10px] rounded-full font-semibold ${
                                            isActive
                                                ? 'bg-slate-800 text-slate-200'
                                                : 'bg-slate-100 text-slate-500'
                                        }`}
                                    >
                                        {count}
                                    </span>
                                </button>
                            )
                        })}
                         <button
                            onClick={() => setShowAllMajors((prev) => !prev)}
                            className='px-2.5 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-[11px] font-semibold text-slate-700 hover:bg-slate-100 hover:text-slate-900 transition-colors'>
                            {showAllMajors ? 'Show selected majors' : 'Show all entries'}
                        </button>
                        <div className='text-xs font-medium text-slate-500 flex items-center gap-1'>
                            Showing <span className='font-bold text-slate-800'>{filteredBooks.length}</span> of <span className='font-bold text-slate-800'>{books.length}</span>
                        </div>
                    </div>
                </div>

                {/* 3. Search Bar */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm'>
                    <div className='relative flex-1 max-w-md'>
                        {/* Search Icon (14px) */}
                        <div className='absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400'>
                            <svg style={{ width: '14px', height: '14px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={showAllMajors ? 'Search all entries...' : `Search ${selectedCategory}...`}
                            className='w-full pl-8 pr-8 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:bg-white transition-all'
                        />
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm('')}
                                className='absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600'
                            >
                                <svg style={{ width: '13px', height: '13px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                </svg>
                            </button>
                        )}
                    </div>

                    <div className='flex items-center gap-2'>
                        <div className='text-xs font-medium text-slate-500 flex items-center gap-1'>
                            Showing <span className='font-bold text-slate-800'>{Math.min(filteredBooks.length, currentPage * ITEMS_PER_PAGE + 1)}</span>
                            <span className='text-slate-400'>-</span>
                            <span className='font-bold text-slate-800'>{Math.min((currentPage + 1) * ITEMS_PER_PAGE, filteredBooks.length)}</span>
                            of <span className='font-bold text-slate-800'>{filteredBooks.length}</span>
                        </div>
                    </div>
                </div>

                {/* 4. Table */}
                <div className='bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left text-xs border-collapse'>
                            <thead>
                                <tr className='bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase select-none'>
                                    <th className='px-3 py-2.5 w-12 text-center'>
                                        <div className='flex items-center justify-center gap-1'>
                                            <span>No.</span>
                                        </div>
                                    </th>
                                    
                                    <th className='px-3.5 py-2.5'>
                                        <div className='flex items-center gap-1'>
                                            <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 20l4-16m2 16l4-16M6 9h14M4 15h14' />
                                            </svg>
                                            <span>OCLC / Call No.</span>
                                        </div>
                                    </th>

                                    <th className='px-3.5 py-2.5 min-w-[180px]'>
                                        <div className='flex items-center gap-1'>
                                            <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                                            </svg>
                                            <span>Title</span>
                                        </div>
                                    </th>

                                    <th className='px-3.5 py-2.5'>
                                        <div className='flex items-center gap-1'>
                                            <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
                                            </svg>
                                            <span>Author</span>
                                        </div>
                                    </th>

                                    <th className='px-3.5 py-2.5'>
                                        <div className='flex items-center gap-1'>
                                            <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                                            </svg>
                                            <span>Subject</span>
                                        </div>
                                    </th>

                                    <th className='px-3.5 py-2.5'>
                                        <div className='flex items-center gap-1'>
                                            <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' />
                                            </svg>
                                            <span>Publisher</span>
                                        </div>
                                    </th>

                                    <th className='px-3.5 py-2.5 text-center'>
                                        <div className='flex items-center justify-center gap-1'>
                                            <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='text-slate-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' />
                                            </svg>
                                            <span>Year</span>
                                        </div>
                                    </th>

                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100'>
                                {paginatedBooks.length > 0 ? (
                                    paginatedBooks.map((book, index) => (
                                        <tr 
                                            key={`${book["Item OCLC Number"]}-${index}`} 
                                            className='hover:bg-slate-50/80 transition-colors group'
                                        >
                                            <td className='px-3 py-2.5 align-top text-center text-slate-500 font-semibold'>
                                                {currentPage * ITEMS_PER_PAGE + index + 1}
                                            </td>
                                            <td className='px-3.5 py-2.5 align-top'>
                                                <div className='flex flex-col gap-0.5'>
                                                    <span className='font-mono text-[11px] font-semibold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded w-fit border border-slate-200/50'>
                                                        {book["Item OCLC Number"] || '-'}
                                                    </span>
                                                    {book["LHR Item Call Number"] && (
                                                        <span className='font-mono text-[10px] text-slate-400'>
                                                            {book["LHR Item Call Number"]}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>

                                            <td className='px-3.5 py-2.5 align-top max-w-sm'>
                                                {book["URL"] ? (
                                                    <a 
                                                        href={book["URL"]} 
                                                        target='_blank' 
                                                        rel='noreferrer' 
                                                        className='font-semibold text-slate-800 hover:text-blue-600 inline-flex items-center gap-1 transition-colors group-hover:text-blue-600'
                                                    >
                                                        <span>{book["Title"]}</span>
                                                        {/* Link Icon (12px) */}
                                                        <svg style={{ width: '12px', height: '12px', minWidth: '12px' }} className='opacity-0 group-hover:opacity-100 transition-opacity text-blue-500' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14' />
                                                        </svg>
                                                    </a>
                                                ) : (
                                                    <span className='font-semibold text-slate-800'>{book["Title"]}</span>
                                                )}
                                            </td>

                                            <td className='px-3.5 py-2.5 align-top text-slate-600 font-medium'>
                                                {book["Author Name"] || <span className='text-slate-300'>—</span>}
                                            </td>

                                            <td className='px-3.5 py-2.5 align-top'>
                                                {book["Conspectus Subject"] ? (
                                                    <span className='inline-block bg-indigo-50 text-indigo-700 border border-indigo-100/80 text-[10px] px-2 py-0.5 rounded font-medium whitespace-nowrap'>
                                                        {book["Conspectus Subject"]}
                                                    </span>
                                                ) : (
                                                    <span className='text-slate-300'>—</span>
                                                )}
                                            </td>

                                            <td className='px-3.5 py-2.5 align-top text-slate-500 text-[11px]'>
                                                {book["Publisher Name"] || <span className='text-slate-300'>—</span>}
                                            </td>

                                            <td className='px-3.5 py-2.5 align-top text-center'>
                                                {book["Publication Date"] ? (
                                                    <span className='inline-block bg-slate-100 text-slate-600 text-[10px] font-semibold px-1.5 py-0.5 rounded'>
                                                        {book["Publication Date"]}
                                                    </span>
                                                ) : (
                                                    <span className='text-slate-300'>—</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={7} className='px-6 py-8 text-center'>
                                            <div className='flex flex-col items-center justify-center space-y-1.5'>
                                                <div className='p-2 rounded-full bg-slate-100 text-slate-400'>
                                                    <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                                                    </svg>
                                                </div>
                                                <p className='text-slate-700 font-semibold text-xs'>No matching books found</p>
                                                <p className='text-[11px] text-slate-400 max-w-xs'>
                                                    {searchTerm 
                                                        ? `No items matched "${searchTerm}".`
                                                        : `No records available under "${selectedCategory}".`
                                                    }
                                                </p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                {pageCount > 1 && (
                    <div className='flex flex-col items-center gap-2 py-4'>
                        <div className='flex flex-wrap items-center justify-center gap-2 text-sm'>
                            <button
                                type='button'
                                onClick={() => setCurrentPage((page) => Math.max(0, page - 1))}
                                disabled={currentPage === 0}
                                className='px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                ← Previous
                            </button>/*Layout */

                            {visiblePageNumbers[0] > 0 && (
                                <>
                                    <button
                                        type='button'
                                        onClick={() => setCurrentPage(0)}
                                        className='px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    >
                                        1
                                    </button>
                                    {visiblePageNumbers[0] > 1 && <span className='text-slate-400'>...</span>}
                                </>
                            )}

                            {visiblePageNumbers.map((page) => (
                                <button
                                    key={page}
                                    type='button'
                                    onClick={() => setCurrentPage(page)}
                                    className={`px-3 py-2 rounded-lg border border-slate-200 hover:bg-slate-100 ${page === currentPage ? 'bg-slate-900 text-white' : 'bg-white text-slate-600'}`}
                                >
                                    {page + 1}
                                </button>
                            ))}

                            {visiblePageNumbers[visiblePageNumbers.length - 1] < pageCount - 1 && (
                                <>
                                    {visiblePageNumbers[visiblePageNumbers.length - 1] < pageCount - 2 && <span className='text-slate-400'>...</span>}
                                    <button
                                        type='button'
                                        onClick={() => setCurrentPage(pageCount - 1)}
                                        className='px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                    >
                                        {pageCount}
                                    </button>
                                </>
                            )}

                            <button
                                type='button'
                                onClick={() => setCurrentPage((page) => Math.min(pageCount - 1, page + 1))}
                                disabled={currentPage === pageCount - 1}
                                className='px-3 py-2 rounded-lg border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed'
                            >
                                Next →
                            </button>
                        </div>
                        <div className='text-xs text-slate-500'>
                            Page {currentPage + 1} of {pageCount}
                        </div>
                    </div>
                )}

                <Link to="/">
                    <button className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded">Go to HomePage</button>
                </Link>
                <Link to="/curriculum-analytics">
                    <button className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded">Go to Analytics</button>
                </Link>
            </div>
        </div>
    )
}

export default Dashboard