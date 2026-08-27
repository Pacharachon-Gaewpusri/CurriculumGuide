import React, { useMemo, useState } from 'react'
import { Link } from 'react-router-dom';
import resourcesData from '../data/resources.json';

const Dermatology = () => {
const nonElectronicFile = 'Front_end/my-app/src/data/AUN QA 2025 (Non-electronics).xlsx';
const electronicFile = 'Front_end/my-app/src/data/AUN QA 2025-2026 (Electronics).xlsx';
const dermatologyCategory = 'ตจวิทยา';

const getRecords = (source, materialType) => {
	const records = source?.[dermatologyCategory];
	if (!Array.isArray(records)) return [];

	return records
		.filter((item) => item && item['Item OCLC Number'] !== 'Item OCLC Number')
		.map((item) => ({ ...item, materialType }));
};

	const [selectedType, setSelectedType] = useState('All');
	const [search, setSearch] = useState('');

	const materials = useMemo(() => {
		const nonElectronic = resourcesData?.[nonElectronicFile];
		const electronic = nonElectronic?.[electronicFile];
		return [
			...getRecords(nonElectronic, 'Non-electronics'),
			...getRecords(electronic, 'Electronics'),
		];
	}, []);
	const filteredMaterials = materials.filter((item) => {
		const matchesType = selectedType === 'All' || item.materialType === selectedType;
		const text = [
			item['Title'], item['Author Name'], item['Conspectus Subject'],
			item['Publisher Name'], item['Publication Date'],
		].filter(Boolean).join(' ').toLowerCase();
		return matchesType && text.includes(search.toLowerCase());
	});

	return (
		<main className="dermatology-page">
			<header>
				<h1>Dermatology Learning Materials</h1>
				<p>All non-electronics and electronics resources for the Dermatology major.</p>
			</header>

			<div className="resource-filters">
				<input
					type="search"
					placeholder="Search materials..."
					value={search}
					onChange={(event) => setSearch(event.target.value)}
					aria-label="Search Dermatology learning materials"
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

			<section className="resource-grid" aria-label="Dermatology resources">
				{filteredMaterials.map((item, index) => {
					const title = item['Title'] || 'Untitled resource';
					const link = item['URL'];
					return (
						<article className="resource-card" key={`${item.materialType}-${item['Item OCLC Number'] || title || index}`}>
							<span className="resource-type">{item.materialType}</span>
							<h2>{title}</h2>
							{item['Conspectus Subject'] && <p><strong>Subject:</strong> {item['Conspectus Subject']}</p>}
							{item['Author Name'] && <p><strong>Author:</strong> {item['Author Name']}</p>}
							{item['Publication Date'] && <p><strong>Published:</strong> {item['Publication Date']}</p>}
							{link && <a href={link} target="_blank" rel="noreferrer">Open resource</a>}
						</article>
					);
				})}
			</section>

			{!filteredMaterials.length && <p>No Dermatology materials match your search.</p>}
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
export default Dermatology