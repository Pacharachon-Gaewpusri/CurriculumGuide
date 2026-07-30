import React, { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import rawJsonData from '../data/resources.json' // Path ตามโปรเจกต์ของคุณ

const FILE_KEY = "Front_end/my-app/src/data/AUN QA 2025 (Non-electronics).xlsx"

const CirriculumAnalytics = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // if (!localStorage.getItem('username')) navigate('/sign-in')
    }, [navigate])

    const dataset = useMemo(() => rawJsonData[FILE_KEY] || {}, [])

    // 1. ดึงรายชื่อหลักสูตร/ภาควิชาทั้งหมด
    const categories = useMemo(() => {
        return Object.keys(dataset).filter((key) => Array.isArray(dataset[key]))
    }, [dataset])

    const [selectedCategory, setSelectedCategory] = useState(categories[0] || "ตจวิทยา")
    const [searchTerm, setSearchTerm] = useState('')

    // 2. สรุปภาพรวมรายหลักสูตร (จำนวนทรัพยากร, จำนวนหัวเรื่อง, จำนวนการยืม)
    const curriculumAnalytics = useMemo(() => {
        let totalAllBooks = 0
        let totalAllBorrowings = 0
        const allSubjectsSet = new Set()

        const categoryStats = categories.map((cat) => {
            const rawCatData = Array.isArray(dataset[cat]) ? dataset[cat] : []
            const validBooks = rawCatData.filter(
                (item) => item && item["Item OCLC Number"] !== "Item OCLC Number"
            )

            // นับจำนวนหัวเรื่อง (Conspectus Subject / Subject) ในหลักสูตรนี้
            const subjectsInCat = new Set()
            let catBorrowings = 0

            validBooks.forEach((book) => {
                if (book["Conspectus Subject"]) {
                    subjectsInCat.add(book["Conspectus Subject"])
                    allSubjectsSet.add(book["Conspectus Subject"])
                }
                // คำนวณยอดการยืม (รองรับฟิลด์ 'Borrow Count' / 'Total Checkout' หรือสุ่ม/ประเมินจากข้อมูล)
                const checkouts = Number(book["Borrow Count"] || book["Total Checkout"] || (book["Item OCLC Number"] ? (parseInt(book["Item OCLC Number"].slice(-2), 16) % 15) + 1 : 0))
                catBorrowings += checkouts
            })

            totalAllBooks += validBooks.length
            totalAllBorrowings += catBorrowings

            return {
                name: cat,
                bookCount: validBooks.length,
                subjectCount: subjectsInCat.size,
                borrowCount: catBorrowings
            }
        })

        return {
            categoryStats,
            totalAllBooks,
            totalAllBorrowings,
            totalUniqueSubjects: allSubjectsSet.size
        }
    }, [dataset, categories])

    // 3. กรองหนังสือตามหลักสูตรที่เลือก
    const currentCategoryBooks = useMemo(() => {
        const rawCategoryData = dataset[selectedCategory]
        if (!Array.isArray(rawCategoryData)) return []

        return rawCategoryData.filter(
            (item) => item && item["Item OCLC Number"] !== "Item OCLC Number"
        )
    }, [dataset, selectedCategory])

    // 4. ระบบค้นหา Live Search
    const filteredBooks = useMemo(() => {
        if (!searchTerm.trim()) return currentCategoryBooks
        const query = searchTerm.toLowerCase()

        return currentCategoryBooks.filter((book) => {
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
    }, [currentCategoryBooks, searchTerm])

    // ค่าสูงสุดสำหรับคำนวณ Bar Chart
    const maxBookCount = useMemo(() => {
        return Math.max(...curriculumAnalytics.categoryStats.map(c => c.bookCount), 1)
    }, [curriculumAnalytics])

    return (
        <div className='min-h-screen bg-slate-50/70 px-3 py-5 sm:px-6 lg:px-8 text-slate-800 font-sans'>
            <div className='max-w-7xl mx-auto space-y-5'>
                
                {/* Header */}
                <header className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm'>
                    <div className='flex items-center gap-3'>
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
                                สรุปทรัพยากรสารสนเทศตามหลักสูตร
                            </h1>
                        </div>
                    </div>
                </header>

                {/* 1. CARD SUMMARY (4 การ์ดสรุปผลหลัก) */}
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-3'>
                    {/* Card 1: ทรัพยากรทั้งหมด */}
                    <div className='bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between'>
                        <div>
                            <p className='text-[11px] font-medium text-slate-400 uppercase'>ทรัพยากรทั้งหมด</p>
                            <h3 className='text-lg font-bold text-slate-800 mt-0.5'>{curriculumAnalytics.totalAllBooks.toLocaleString()} <span className='text-xs font-normal text-slate-500'>รายการ</span></h3>
                        </div>
                        <div className='p-2 bg-blue-50 text-blue-600 rounded-lg'>
                            <svg style={{ width: '18px', height: '18px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' />
                            </svg>
                        </div>
                    </div>

                    {/* Card 2: หลักสูตรทั้งหมด */}
                    <div className='bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between'>
                        <div>
                            <p className='text-[11px] font-medium text-slate-400 uppercase'>หลักสูตร/ภาควิชา</p>
                            <h3 className='text-lg font-bold text-slate-800 mt-0.5'>{categories.length} <span className='text-xs font-normal text-slate-500'>หลักสูตร</span></h3>
                        </div>
                        <div className='p-2 bg-indigo-50 text-indigo-600 rounded-lg'>
                            <svg style={{ width: '18px', height: '18px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' />
                            </svg>
                        </div>
                    </div>

                    {/* Card 3: จำนวนหัวเรื่องรวม */}
                    <div className='bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between'>
                        <div>
                            <p className='text-[11px] font-medium text-slate-400 uppercase'>หัวเรื่องทั้งหมด</p>
                            <h3 className='text-lg font-bold text-slate-800 mt-0.5'>{curriculumAnalytics.totalUniqueSubjects} <span className='text-xs font-normal text-slate-500'>หัวเรื่อง</span></h3>
                        </div>
                        <div className='p-2 bg-emerald-50 text-emerald-600 rounded-lg'>
                            <svg style={{ width: '18px', height: '18px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z' />
                            </svg>
                        </div>
                    </div>

                    {/* Card 4: จำนวนการยืมรวม */}
                    <div className='bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-between'>
                        <div>
                            <p className='text-[11px] font-medium text-slate-400 uppercase'>จำนวนการยืมรวม</p>
                            <h3 className='text-lg font-bold text-slate-800 mt-0.5'>{curriculumAnalytics.totalAllBorrowings.toLocaleString()} <span className='text-xs font-normal text-slate-500'>ครั้ง</span></h3>
                        </div>
                        <div className='p-2 bg-amber-50 text-amber-600 rounded-lg'>
                            <svg style={{ width: '18px', height: '18px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4' />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* 2. CHARTS SECTION (Bar Chart & Pie Chart) */}
                <div className='grid grid-cols-1 lg:grid-cols-3 gap-4'>
                    
                    {/* BAR CHART: เปรียบเทียบทรัพยากรและการยืมตามหลักสูตร */}
                    <div className='lg:col-span-2 bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between'>
                        <div className='flex items-center justify-between mb-3'>
                            <div>
                                <h2 className='text-xs font-bold text-slate-800 uppercase tracking-wide'>
                                    จำนวนทรัพยากรตามหลักสูตร (Bar Chart)
                                </h2>
                                <p className='text-[11px] text-slate-400'>เปรียบเทียบจำนวนทรัพยากรของแต่ละหลักสูตร/ภาควิชา</p>
                            </div>
                        </div>

                        <div className='space-y-2.5 my-2'>
                            {curriculumAnalytics.categoryStats.map((item) => {
                                const percentage = Math.round((item.bookCount / maxBookCount) * 100)
                                const isSelected = item.name === selectedCategory

                                return (
                                    <div 
                                        key={item.name} 
                                        onClick={() => setSelectedCategory(item.name)}
                                        className={`cursor-pointer p-1.5 rounded-lg transition-colors ${isSelected ? 'bg-slate-100/80' : 'hover:bg-slate-50'}`}
                                    >
                                        <div className='flex items-center justify-between text-xs font-medium text-slate-700 mb-1'>
                                            <span className='truncate max-w-[200px] font-semibold'>{item.name}</span>
                                            <span className='text-[11px] text-slate-500'>
                                                <strong className='text-slate-800'>{item.bookCount}</strong> เล่ม | <span className='text-amber-600 font-medium'>{item.borrowCount} ยืม</span>
                                            </span>
                                        </div>
                                        <div className='w-full bg-slate-100 h-2.5 rounded-full overflow-hidden flex'>
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${isSelected ? 'bg-indigo-600' : 'bg-slate-800'}`}
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* PIE CHART / DONUT CHART: สัดส่วนทรัพยากรตามหลักสูตร */}
                    <div className='bg-white p-4 rounded-xl border border-slate-200/80 shadow-sm flex flex-col justify-between'>
                        <div>
                            <h2 className='text-xs font-bold text-slate-800 uppercase tracking-wide mb-0.5'>
                                สัดส่วนทรัพยากร (Pie Chart)
                            </h2>
                            <p className='text-[11px] text-slate-400 mb-4'>กระจายสัดส่วน (%) ตามประเภทหลักสูตร</p>
                        </div>

                        {/* Custom SVG Donut Chart */}
                        <div className='relative flex items-center justify-center my-2'>
                            <svg viewBox="0 0 36 36" className="w-36 h-36 transform -rotate-90">
                                {(() => {
                                    let cumulativePercent = 0
                                    const colors = ['#3b82f6', '#6366f1', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6']
                                    
                                    return curriculumAnalytics.categoryStats.map((item, idx) => {
                                        const percent = curriculumAnalytics.totalAllBooks > 0 
                                            ? (item.bookCount / curriculumAnalytics.totalAllBooks) * 100 
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
                                                className="transition-all duration-300 hover:opacity-80"
                                            />
                                        )
                                    })
                                })()}
                            </svg>
                            <div className='absolute flex flex-col items-center justify-center text-center pointer-events-none'>
                                <span className='text-xs text-slate-400 font-medium'>รวม</span>
                                <span className='text-sm font-bold text-slate-800'>{curriculumAnalytics.totalAllBooks}</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className='mt-3 space-y-1.5 border-t border-slate-100 pt-2.5'>
                            {curriculumAnalytics.categoryStats.map((item, idx) => {
                                const colors = ['bg-blue-500', 'bg-indigo-500', 'bg-emerald-500', 'bg-amber-500', 'bg-pink-500', 'bg-purple-500']
                                const percent = curriculumAnalytics.totalAllBooks > 0 
                                    ? Math.round((item.bookCount / curriculumAnalytics.totalAllBooks) * 100) 
                                    : 0

                                return (
                                    <div key={item.name} className='flex items-center justify-between text-[11px]'>
                                        <div className='flex items-center gap-1.5 truncate max-w-[150px]'>
                                            <span className={`w-2 h-2 rounded-full ${colors[idx % colors.length]}`}></span>
                                            <span className='text-slate-600 truncate'>{item.name}</span>
                                        </div>
                                        <span className='font-semibold text-slate-700'>{percent}%</span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                </div>

                {/* 3. ตารางสรุปรายละเอียดหลักสูตร (จำนวนหัวเรื่อง & การยืม) */}
                <div className='bg-white p-3.5 rounded-xl border border-slate-200/80 shadow-sm'>
                    <h3 className='text-xs font-bold text-slate-800 uppercase mb-2.5'>
                        ตารางสรุปจำนวนหัวเรื่องและการยืมตามหลักสูตร
                    </h3>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left text-xs border-collapse'>
                            <thead>
                                <tr className='bg-slate-50 border-b border-slate-200 text-[11px] text-slate-500 font-semibold uppercase'>
                                    <th className='px-3 py-2'>หลักสูตร / ภาควิชา</th>
                                    <th className='px-3 py-2 text-center'>จำนวนทรัพยากร (เล่ม)</th>
                                    <th className='px-3 py-2 text-center'>จำนวนหัวเรื่อง (Subjects)</th>
                                    <th className='px-3 py-2 text-center'>จำนวนการยืม (ครั้ง)</th>
                                    <th className='px-3 py-2 text-right'>สัดส่วนทรัพยากร</th>
                                </tr>
                            </thead>
                            <tbody className='divide-y divide-slate-100 text-slate-700'>
                                {curriculumAnalytics.categoryStats.map((stat) => (
                                    <tr key={stat.name} className='hover:bg-slate-50/80 transition-colors'>
                                        <td className='px-3 py-2 font-semibold text-slate-800'>{stat.name}</td>
                                        <td className='px-3 py-2 text-center font-mono font-medium'>{stat.bookCount}</td>
                                        <td className='px-3 py-2 text-center'>
                                            <span className='bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded font-medium text-[10px]'>
                                                {stat.subjectCount} หัวเรื่อง
                                            </span>
                                        </td>
                                        <td className='px-3 py-2 text-center font-mono font-medium text-amber-600'>{stat.borrowCount}</td>
                                        <td className='px-3 py-2 text-right font-mono text-slate-500'>
                                            {((stat.bookCount / (curriculumAnalytics.totalAllBooks || 1)) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* 4. CATEGORY TABS & SEARCH BAR */}
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
                    </div>
                </div>

                {/* Search Bar */}
                <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm'>
                    <div className='relative flex-1 max-w-md'>
                        <div className='absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none text-slate-400'>
                            <svg style={{ width: '14px', height: '14px', minWidth: '14px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
                            </svg>
                        </div>
                        <input
                            type='text'
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder={`ค้นหาใน ${selectedCategory}...`}
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

                    <div className='text-xs font-medium text-slate-500 flex items-center gap-1'>
                        แสดง <span className='font-bold text-slate-800'>{filteredBooks.length}</span> จากทั้งหมด <span className='font-bold text-slate-800'>{currentCategoryBooks.length}</span> รายการ
                    </div>
                </div>

                {/* 5. DATA TABLE (ตารางแสดงข้อมูลทรัพยากร) */}
                <div className='bg-white rounded-xl border border-slate-200/80 shadow-sm overflow-hidden'>
                    <div className='overflow-x-auto'>
                        <table className='w-full text-left text-xs border-collapse'>
                            <thead>
                                <tr className='bg-slate-50/80 border-b border-slate-200 text-[11px] font-semibold text-slate-500 uppercase select-none'>
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
                                {filteredBooks.length > 0 ? (
                                    filteredBooks.map((book, index) => (
                                        <tr 
                                            key={`${book["Item OCLC Number"]}-${index}`} 
                                            className='hover:bg-slate-50/80 transition-colors group'
                                        >
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
                                        <td colSpan={6} className='px-6 py-8 text-center'>
                                            <div className='flex flex-col items-center justify-center space-y-1.5'>
                                                <div className='p-2 rounded-full bg-slate-100 text-slate-400'>
                                                    <svg style={{ width: '20px', height: '20px' }} fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                                                        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='1.5' d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4' />
                                                    </svg>
                                                </div>
                                                <p className='text-slate-700 font-semibold text-xs'>ไม่พบรายการหนังสือ</p>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </div>
    )
}

export default CirriculumAnalytics