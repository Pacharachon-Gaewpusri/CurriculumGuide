import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import rawJsonData from '../data/resources.json' // Path preserved
import resourcesData from '../data/resources.json';
import { Link, Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

const asArray = (data) => {
	if (Array.isArray(data)) return data;
	return data?.resources || data?.materials || data?.data || [];
};

const valueOf = (item, keys) => keys.map((key) => item?.[key]).filter(Boolean).join(' ');

const isCOSCI = (item) =>
	/COSCI/i.test(valueOf(item, ['major', 'specialty', 'department', 'subject', 'course']));

const getMaterialType = (item) => {
	const type = valueOf(item, ['type', 'format', 'materialType', 'resourceType', 'category']);
	return /electronic|digital|online|video|software|website|e-book|ebook/i.test(type)
		? 'Electronics'
		: 'Non-electronics';
};

export default function COSCI() {
	const [selectedType, setSelectedType] = useState('All');
	const [search, setSearch] = useState('');

	const materials = useMemo(() => asArray(resourcesData).filter(isCOSCI), []);
	const filteredMaterials = materials.filter((item) => {
		const matchesType = selectedType === 'All' || getMaterialType(item) === selectedType;
		const text = valueOf(item, [
			'title', 'name', 'description', 'summary', 'author', 'type', 'format',
		]).toLowerCase();
		return matchesType && text.includes(search.toLowerCase());
	});

	return (
		<main className="COSCI-page">
			<header>
				<h1>COSCI Learning Materials</h1>
				<p>All non-electronics and electronics resources for the COSCI major.</p>
			</header>

			<div className="resource-filters">
				<input
					type="search"
					placeholder="Search materials..."
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					aria-label="Search COSCI learning materials"
				/>
				{['All', 'Non-electronics', 'Electronics'].map((type) => (
					<button
						type="button"
						key={type}
						className={selectedType === type ? 'active' : ''}
						onClick={() => setSelectedType(type)}
					>
						{type}
					</button>
				))}
			</div>

			<section className="resource-grid" aria-label="COSCI resources">
				{filteredMaterials.map((item, index) => {
					const title = item.title || item.name || 'Untitled resource';
					const link = item.url || item.link || item.href;
					return (
						<article className="resource-card" key={item.id || title || index}>
							<span className="resource-type">{getMaterialType(item)}</span>
							<h2>{title}</h2>
							{(item.description || item.summary) && <p>{item.description || item.summary}</p>}
							{item.author && <p><strong>Author:</strong> {item.author}</p>}
							{link && <a href={link} target="_blank" rel="noreferrer">Open resource</a>}
						</article>
					);
				})}
			</section>

			{!filteredMaterials.length && <p>No COSCI materials match your search.</p>}
            <div className='flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-sm'>
                    <Link to="/">
                        <button className="bg-sky-500 hover:bg-sky-700 text-black font-semibold py-2 px-4 rounded">Go to HomePage</button>
                    </Link>
                    <Link to="/curriculum-analytics">
                        <button className="bg-sky-500 hover:bg-sky-700 text-black font-semibold py-2 px-4 rounded">Go to Analytics</button>
                    </Link> 
            </div> 
        </main>
	);
}