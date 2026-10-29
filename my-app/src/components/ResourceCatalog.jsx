import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import resourcesData from '../data/resources.json';
import './ResourceCatalog.css';

const NON_ELECTRONIC_FILE = 'my-app/src/data/AUN QA 2025 (Non-electronics).xlsx';
const ELECTRONIC_FILE = 'my-app/src/data/AUN QA 2025-2026 (Electronics).xlsx';
const PAGE_SIZE = 25;

const getRecords = (source, category, materialType) => {
	const records = source?.[category];
	if (!Array.isArray(records)) return [];

	return records
		.filter((item) => {
			if (!item) return false;
			const identifier = item['Item OCLC Number'] ?? item['OCLC Number'];
			return identifier !== 'Item OCLC Number' && identifier !== 'OCLC Number';
		})
		.map((item) => ({ ...item, materialType }));
};

const ResourceCatalog = ({ category, title, major }) => {
	const [selectedType, setSelectedType] = useState('All');
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(0);

	const materials = useMemo(() => {
		const printResources = resourcesData?.[NON_ELECTRONIC_FILE];
		const electronicResources = printResources?.[ELECTRONIC_FILE];
		return [
			...getRecords(printResources, category, 'Non-electronics'),
			...getRecords(electronicResources, category, 'Electronics'),
		];
	}, [category]);

	const filteredMaterials = useMemo(() => {
		const query = search.trim().toLowerCase();
		return materials.filter((item) => {
			const matchesType = selectedType === 'All' || item.materialType === selectedType;
			const text = [
				item['Title'], item['Author Name'], item['Conspectus Subject'],
				item['Publisher Name'], item['Publication Date'], item['Material Subformat'],
			].filter(Boolean).join(' ').toLowerCase();
			return matchesType && text.includes(query);
		});
	}, [materials, search, selectedType]);

	const pageCount = Math.ceil(filteredMaterials.length / PAGE_SIZE);
	const pageItems = filteredMaterials.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);

	const changeType = (type) => {
		setSelectedType(type);
		setPage(0);
	};

	const changeSearch = (value) => {
		setSearch(value);
		setPage(0);
	};

	return (
		<main className="resource-page">
			<div className="resource-page__inner">
				<header className="resource-page__header">
					<div>
						<p className="resource-page__eyebrow">AUN QA Resource Catalog</p>
						<h1>{title}</h1>
						<p>Electronic and non-electronic learning materials for {major}.</p>
					</div>
					<Link className="resource-page__back" to="/curriculum-analytics">Back to Analytics</Link>
				</header>

				<section className="resource-panel" aria-label={`${major} resource catalog`}>
					<div className="resource-panel__toolbar">
						<label className="resource-search">
							<span className="resource-search__label">Search resources</span>
							<input
								type="search"
								placeholder="Title, author, subject..."
								value={search}
								onChange={(event) => changeSearch(event.target.value)}
							/>
						</label>
						<div className="resource-type-filter" role="group" aria-label="Filter by material type">
							{['All', 'Non-electronics', 'Electronics'].map((type) => (
								<button
									type="button"
									key={type}
									className={selectedType === type ? 'is-active' : ''}
									aria-pressed={selectedType === type}
									onClick={() => changeType(type)}
								>
									{type}
								</button>
							))}
						</div>
					</div>

					<div className="resource-panel__summary" aria-live="polite">
						<span>{filteredMaterials.length.toLocaleString()} resources</span>
						{pageCount > 0 && <span>Page {page + 1} of {pageCount}</span>}
					</div>

					<div className="resource-table-scroll">
						<table className="resource-table">
							<thead>
								<tr>
									<th scope="col">Type</th>
									<th scope="col">Title</th>
									<th scope="col">Subject</th>
									<th scope="col">Author</th>
									<th scope="col">Publisher</th>
									<th scope="col">Published</th>
									<th scope="col">Access</th>
								</tr>
							</thead>
							<tbody>
								{pageItems.map((item, index) => {
									const identifier = item['Item OCLC Number'] ?? item['OCLC Number'];
									const key = `${item.materialType}-${identifier || `${page}-${index}`}`;
									return (
										<tr key={key}>
											<td><span className={`resource-badge resource-badge--${item.materialType === 'Electronics' ? 'electronic' : 'print'}`}>{item.materialType}</span></td>
											<td className="resource-table__title">{item['Title'] || 'Untitled resource'}</td>
											<td>{item['Conspectus Subject'] || '—'}</td>
											<td>{item['Author Name'] || '—'}</td>
											<td>{item['Publisher Name'] || '—'}</td>
											<td>{item['Publication Date'] || '—'}</td>
											<td>{item['URL'] ? <a href={item['URL']} target="_blank" rel="noreferrer">Open resource</a> : '—'}</td>
										</tr>
									);
								})}
								{pageItems.length === 0 && (
									<tr>
									<td className="resource-table__empty" colSpan="7">No {major} resources match your search.</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>

					{pageCount > 1 && (
						<nav className="resource-pagination" aria-label="Resource table pages">
							<button type="button" disabled={page === 0} onClick={() => setPage(page - 1)}>Previous</button>
							<span>{page * PAGE_SIZE + 1}–{Math.min((page + 1) * PAGE_SIZE, filteredMaterials.length)} of {filteredMaterials.length.toLocaleString()}</span>
							<button type="button" disabled={page >= pageCount - 1} onClick={() => setPage(page + 1)}>Next</button>
						</nav>
					)}
				</section>

				<footer className="resource-page__footer">
					<Link to="/">Go to Homepage</Link>
					<Link to="/curriculum-analytics">Go to Analytics</Link>
				</footer>
			</div>
		</main>
	);
};

export default ResourceCatalog;