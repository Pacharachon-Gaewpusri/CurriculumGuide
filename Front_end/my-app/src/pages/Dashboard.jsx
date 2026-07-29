import React, { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
// import resources from './data/resources.json'

const Dashboard = () => {
    const navigate = useNavigate()

    useEffect(() => {
        // if (!localStorage.getItem('username')) navigate('/sign-in')
    }, [navigate])

    return (
        <div className='min-h-screen bg-slate-50 px-4 py-6 text-slate-900'>
            <div className='border-b border-slate-200 px-4 py-3 font-medium text-slate-600'>big brown fox</div>
            <div className='border-b border-slate-200 px-4 py-3 font-medium text-slate-600'>jumps over dive lazy dog</div>
        </div>
    )
}

export default Dashboard