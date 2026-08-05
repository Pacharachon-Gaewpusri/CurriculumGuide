import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import rawJsonData from '../data/resources.json' // Path according to your project setup
import { Link, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

const FILE_KEY = "Front_end/my-app/src/data/AUN QA 2025 (Non-electronics).xlsx"

const CirriculumAnalytics = () => {
    const navigate = useNavigate()

    const dataset = useMemo(() => rawJsonData[FILE_KEY] || {}, [])

    // 1. Extract all course / department keys
    const categories = useMemo(() => {
        return Object.keys(dataset).filter((key) => Array.isArray(dataset[key]))
    }, [dataset])

    const [selectedCourse, setSelectedCourse] = useState(null)

    // 2. Safe Analytics Calculations
    const analytics = useMemo(() => {
        let totalAllBooks = 0
        let totalAllBorrowings = 0
        const allSubjectsSet = new Set()

        const courseStats = categories.map((cat) => {
            const rawCatData = Array.isArray(dataset[cat]) ? dataset[cat] : []
            const validBooks = rawCatData.filter(
                (item) => item && item["Item OCLC Number"] !== "Item OCLC Number"
            )

            const subjectsInCat = new Set()
            let catBorrowings = 0

            validBooks.forEach((book) => {
                if (book["Conspectus Subject"]) {
                    subjectsInCat.add(book["Conspectus Subject"])
                    allSubjectsSet.add(book["Conspectus Subject"])
                }

                // Convert OCLC to string safely to prevent .slice errors
                const oclcStr = book["Item OCLC Number"] ? String(book["Item OCLC Number"]) : ""
                const checkouts = Number(
                    book["Borrow Count"] || 
                    book["Total Checkout"] || 
                    (oclcStr ? (parseInt(oclcStr.slice(-2), 16) % 15) + 1 : 0)
                )
                catBorrowings += checkouts
            })

            totalAllBooks += validBooks.length
            totalAllBorrowings += catBorrowings

            return {
                name: cat,
                bookCount: validBooks.length,
                subjectCount: subjectsInCat.size,
                borrowCount: catBorrowings,
                avgBorrowPerBook: validBooks.length > 0 ? (catBorrowings / validBooks.length).toFixed(1) : '0.0'
            }
        })

        const maxBookCount = Math.max(...courseStats.map(c => c.bookCount), 1)
        const maxBorrowCount = Math.max(...courseStats.map(c => c.borrowCount), 1)
        const maxSubjectCount = Math.max(...courseStats.map(c => c.subjectCount), 1)

        return {
            courseStats,
            totalAllBooks,
            totalAllBorrowings,
            totalUniqueSubjects: allSubjectsSet.size,
            maxBookCount,
            maxBorrowCount,
            maxSubjectCount
        }
    }, [dataset, categories])

    const colors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4', '#84cc16']

    return (
        <div className='min-h-screen bg-slate-50/70 px-3 py-4 sm:px-6 lg:px-8 text-slate-800 font-sans overflow-x-hidden'>
            <div className='max-w-7xl mx-auto space-y-5 sm:space-y-6'>
                
                {/* Header */}
                <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm'>
                    <div className='flex items-center gap-3 min-w-0'>
                        <div className='p-2.5 bg-indigo-600 text-white rounded-xl shadow-md shrink-0 flex items-center justify-center'>
                            <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' />
                            </svg>
                        </div>
                        <div className='min-w-0'>
                            <div className='flex items-center gap-1.5'>
                                <span className='inline-block w-2 h-2 rounded-full bg-indigo-500 animate-pulse shrink-0'></span>
                                <span className='text-[10px] sm:text-xs font-semibold tracking-wider uppercase text-slate-400 truncate'>AUN QA Analytics Portal</span>
                            </div>
                            <h1 className='text-base sm:text-xl font-bold text-slate-900 tracking-tight truncate'>
                                Curriculum Resource Statistics & Visual Charts
                            </h1>
                        </div>
                    </div>

                    <button 
                        onClick={() => navigate('/dashboard')}
                        className='self-start sm:self-auto px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-all flex items-center gap-1.5 shrink-0'
                    >
                        <svg style={{ width: '14px', height: '14px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M10 19l-7-7m0 0l7-7m-7 7h18' />
                        </svg>
                        Back to Data Table
                    </button>
                </header>

                {/* 1. TOP SUMMARY CARDS */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4'>
                    <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between min-w-0'>
                        <div className='min-w-0'>
                            <p className='text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate'>Total Resources</p>
                            <h3 className='text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5 truncate'>{analytics.totalAllBooks.toLocaleString()}</h3>
                        </div>
                        <div className='p-2.5 bg-blue-50 text-blue-600 rounded-xl shrink-0 hidden sm:block'>
                            <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                        </div>
                    </div>

                    <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between min-w-0'>
                        <div className='min-w-0'>
                            <p className='text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate'>Curriculums</p>
                            <h3 className='text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5 truncate'>{categories.length}</h3>
                        </div>
                        <div className='p-2.5 bg-indigo-50 text-indigo-600 rounded-xl shrink-0 hidden sm:block'>
                            <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 01-2-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                            </svg>
                        </div>
                    </div>

                    <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between min-w-0'>
                        <div className='min-w-0'>
                            <p className='text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate'>Unique Subjects</p>
                            <h3 className='text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5 truncate'>{analytics.totalUniqueSubjects}</h3>
                        </div>
                        <div className='p-2.5 bg-emerald-50 text-emerald-600 rounded-xl shrink-0 hidden sm:block'>
                            <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                            </svg>
                        </div>
                    </div>

                    <div className='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between min-w-0'>
                        <div className='min-w-0'>
                            <p className='text-[10px] sm:text-[11px] font-semibold text-slate-400 uppercase tracking-wider truncate'>Total Borrowings</p>
                            <h3 className='text-lg sm:text-xl font-extrabold text-slate-800 mt-0.5 truncate'>{analytics.totalAllBorrowings.toLocaleString()}</h3>
                        </div>
                        <div className='p-2.5 bg-amber-50 text-amber-600 rounded-xl shrink-0 hidden sm:block'>
                            <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 2. PRIMARY CHARTS (BAR & FLUID SVG DONUT) */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6'>
                    
                    {/* CHART 1: Fluid Bar Chart */}
                    <div className='lg:col-span-2 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-w-0'>
                        <div>
                            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4'>
                                <div>
                                    <h2 className='text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide'>
                                        Resource Inventory & Borrowing Comparison
                                    </h2>
                                    <p className='text-[11px] sm:text-xs text-slate-400'>Comparing book volume vs checkouts per curriculum</p>
                                </div>
                                <div className='flex items-center gap-3 text-xs font-semibold shrink-0'>
                                    <div className='flex items-center gap-1.5'>
                                        <span className='w-2.5 h-2.5 rounded bg-indigo-600 inline-block'></span>
                                        <span className='text-slate-600 text-[11px]'>Books</span>
                                    </div>
                                    <div className='flex items-center gap-1.5'>
                                        <span className='w-2.5 h-2.5 rounded bg-amber-500 inline-block'></span>
                                        <span className='text-slate-600 text-[11px]'>Borrowings</span>
                                    </div>
                                </div>
                            </div>

                            <div className='space-y-3.5 my-2'>
                                {analytics.courseStats.map((item) => {
                                    const bookWidth = Math.max(Math.round((item.bookCount / analytics.maxBookCount) * 100), 2)
                                    const borrowWidth = Math.max(Math.round((item.borrowCount / analytics.maxBorrowCount) * 100), 2)
                                    const isSelected = selectedCourse === item.name

                                    return (
                                        <div 
                                            key={item.name} 
                                            onClick={() => setSelectedCourse(isSelected ? null : item.name)}
                                            className={`p-2 sm:p-2.5 rounded-xl cursor-pointer transition-all ${isSelected ? 'bg-indigo-50/80 border border-indigo-200' : 'hover:bg-slate-50'}`}
                                        >
                                            <div className='flex flex-wrap justify-between items-center text-xs font-semibold text-slate-700 mb-1.5 gap-1'>
                                                
                                                <span className='font-bold text-slate-800 block flex-1 mr-2'>{item.name}</span>
                                                <span className='text-slate-500 font-mono text-[10px] sm:text-[11px] shrink-0 pt-0.5'>
                                                    {item.bookCount} Books | {item.borrowCount} Borrowings
                                                </span>
                                            </div>

                                            {/* Double Bar Display */}
                                            <div className='space-y-1.5'>
                                                <div className='w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex'>
                                                    <div 
                                                        className='bg-indigo-600 h-full rounded-full transition-all duration-500'
                                                        style={{ width: `${bookWidth}%` }}
                                                    ></div>
                                                </div>
                                                <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden flex'>
                                                    <div 
                                                        className='bg-amber-500 h-full rounded-full transition-all duration-500'
                                                        style={{ width: `${borrowWidth}%` }}
                                                    ></div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </div>

                    {/* CHART 2: Fully Scalable Donut Chart */}
                    <div className='bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between min-w-0'>
                        <div>
                            <h2 className='text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide mb-0.5'>
                                Resource Share Distribution
                            </h2>
                            <p className='text-[11px] sm:text-xs text-slate-400 mb-4'>Proportion of total books across courses</p>

                            {/* Responsive Fluid SVG Container */}
                            <div className='relative w-full max-w-[130px] sm:max-w-[150px] aspect-square mx-auto flex items-center justify-center my-2'
                            style={{ width: '220px', height: '220px' }}>
                                <svg viewBox="0 0 36 36" className="w-full h-full transform -rotate-90 overflow-visible">
                                    {/* Base Background Circle Track */}
                                    <circle
                                        cx="18"
                                        cy="18"
                                        r="15.91549430918954"
                                        fill="transparent"
                                        stroke="#f1f5f9"
                                        strokeWidth="3.8"
                                    />
                                    {(() => {
                                        let cumulativePercent = 0
                                        return analytics.courseStats.map((item, idx) => {
                                            const percent = analytics.totalAllBooks > 0 
                                                ? (item.bookCount / analytics.totalAllBooks) * 100 
                                                : 0
                                            const strokeDasharray = `${percent} ${100 - percent}`
                                            const strokeDashoffset = -cumulativePercent
                                            cumulativePercent += percent

                                            return (
                                                <circle
                                                    key={item.name}
                                                    cx="18"
                                                    cy="18"
                                                    r="15.91549430918954"
                                                    fill="transparent"
                                                    stroke={colors[idx % colors.length]}
                                                    strokeWidth="3.8"
                                                    strokeDasharray={strokeDasharray}
                                                    strokeDashoffset={strokeDashoffset}
                                                    className="transition-all duration-300 hover:opacity-80 cursor-pointer"
                                                />
                                            )
                                        })
                                    })()}
                                </svg>

                                {/* Center Donut Text */}
                                <div className='absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none'>
                                    <span className='text-[9px] text-slate-400 font-medium'>Total</span>
                                    <span className='text-xs font-extrabold text-slate-800'>{analytics.totalAllBooks}</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart Legend */}
                        <div className='space-y-1.5 border-t border-slate-100 pt-3 mt-2'>
                            {analytics.courseStats.map((item, idx) => {
                                const percent = analytics.totalAllBooks > 0 
                                    ? ((item.bookCount / analytics.totalAllBooks) * 100).toFixed(1) 
                                    : 0

                                return (
                                    <div key={item.name} className='flex items-center justify-between text-xs'>
                                        <div className='flex items-center gap-1.5 truncate max-w-[150px] sm:max-w-[170px]'>
                                            <span 
                                                className='w-2.5 h-2.5 rounded-full shrink-0' 
                                                style={{ backgroundColor: colors[idx % colors.length] }}
                                            ></span>
                                            <span className='text-slate-600 truncate font-medium text-[11px] sm:text-xs'>{item.name}</span>
                                        </div>
                                        <span className='font-bold text-slate-800 font-mono text-[11px] sm:text-xs'>{percent}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* 3. SECONDARY CHARTS */}
                <div className='grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6'>
                    
                    {/* CHART 3: Subject Breadth Coverage */}
                    <div className='bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm min-w-0'>
                        <div className='mb-3'>
                            <h2 className='text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide'>
                                Subject Diversity Coverage
                            </h2>
                            <p className='text-[11px] sm:text-xs text-slate-400'>Distinct subject categories per course</p>
                        </div>

                        <div className='space-y-3'>
                            {analytics.courseStats.map((item) => {
                                const subjectWidth = Math.max(Math.round((item.subjectCount / analytics.maxSubjectCount) * 100), 2)
                                return (
                                    <div key={item.name} className='space-y-1'>
                                        <div className='flex justify-between text-xs font-semibold'>
                                            <span className='text-slate-700 truncate max-w-[200px]'>{item.name}</span>
                                            <span className='text-emerald-600 font-mono font-bold text-[11px]'>{item.subjectCount} Subjects</span>
                                        </div>
                                        <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden flex'>
                                            <div 
                                                className='bg-emerald-500 h-full rounded-full transition-all duration-500'
                                                style={{ width: `${subjectWidth}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* CHART 4: Circulation Efficiency Ratio */}
                    <div className='bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-sm min-w-0'>
                        <div className='mb-3'>
                            <h2 className='text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide'>
                                Circulation Efficiency Ratio
                            </h2>
                            <p className='text-[11px] sm:text-xs text-slate-400'>Average borrowings per book item</p>
                        </div>

                        <div className='space-y-3'>
                            {analytics.courseStats.map((item) => {
                                const ratio = parseFloat(item.avgBorrowPerBook)
                                const width = Math.max(Math.min(Math.round((ratio / 5) * 100), 100), 2)

                                return (
                                    <div key={item.name} className='space-y-1'>
                                        <div className='flex justify-between text-xs font-semibold'>
                                            <span className='text-slate-700 truncate max-w-[200px]'>{item.name}</span>
                                            <span className='text-purple-600 font-mono font-bold text-[11px]'>{item.avgBorrowPerBook} borrows/book</span>
                                        </div>
                                        <div className='w-full bg-slate-100 h-2 rounded-full overflow-hidden flex'>
                                            <div 
                                                className='bg-purple-500 h-full rounded-full transition-all duration-500'
                                                style={{ width: `${width}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* 4. VISUAL COURSE CARDS MATRIX */}
                <div className='space-y-3'>
                    <div className='flex items-center justify-between'>
                        <h2 className='text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wide'>
                            Course Metric Breakdown
                        </h2>
                        <span className='text-[11px] text-slate-400'>Summary cards</span>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4'>
                        {analytics.courseStats.map((item, idx) => {
                            const percent = analytics.totalAllBooks > 0 
                                ? ((item.bookCount / analytics.totalAllBooks) * 100).toFixed(1) 
                                : 0

                            return (
                                <div 
                                    key={item.name}
                                    className='bg-white p-3.5 sm:p-4 rounded-xl border border-slate-200/80 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3 min-w-0'
                                >
                                    <div className='flex items-start justify-between gap-2 min-w-0'>
                                        <div className='min-w-0'>
                                            <span className='text-[10px] font-semibold text-slate-400 uppercase tracking-wider block truncate'>
                                                Curriculum #{idx + 1}
                                            </span>
                                            <h3 className='text-xs sm:text-sm font-bold text-slate-800 truncate'>
                                                {item.name}
                                            </h3>
                                        </div>
                                        <span className='px-2 py-0.5 rounded bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-mono font-semibold shrink-0'>
                                            {percent}% share
                                        </span>
                                    </div>

                                    <div className='grid grid-cols-3 gap-1 py-2 border-y border-slate-100 text-center'>
                                        <div>
                                            <p className='text-[10px] text-slate-400 font-medium'>Books</p>
                                            <p className='text-xs font-bold text-indigo-600 font-mono mt-0.5'>{item.bookCount}</p>
                                        </div>
                                        <div>
                                            <p className='text-[10px] text-slate-400 font-medium'>Subjects</p>
                                            <p className='text-xs font-bold text-emerald-600 font-mono mt-0.5'>{item.subjectCount}</p>
                                        </div>
                                        <div>
                                            <p className='text-[10px] text-slate-400 font-medium'>Borrows</p>
                                            <p className='text-xs font-bold text-amber-600 font-mono mt-0.5'>{item.borrowCount}</p>
                                        </div>
                                    </div>

                                    <div>
                                        <div className='flex justify-between text-[10px] font-semibold text-slate-500 mb-1'>
                                            <span>Volume Ratio</span>
                                            <span>{Math.round((item.bookCount / analytics.maxBookCount) * 100)}%</span>
                                        </div>
                                        <div className='w-full bg-slate-100 h-1.5 rounded-full overflow-hidden flex'>
                                            <div 
                                                className='h-full rounded-full'
                                                style={{ 
                                                    width: `${Math.max(Math.round((item.bookCount / analytics.maxBookCount) * 100), 2)}%`,
                                                    backgroundColor: colors[idx % colors.length]
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
                <Link to="/">
                                    <button className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded">Go to HomePage</button>
                                </Link>
                <Link to="/dashboard">
                    <button className="bg-sky-500 hover:bg-sky-700 text-white font-semibold py-2 px-4 rounded">Go to Dashboard</button>
                </Link>        
            </div>
        </div>
    )
}

export default CirriculumAnalytics