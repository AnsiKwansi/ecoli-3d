import React, { useState, useEffect } from 'react';
import { SHEE_PUBLICATIONS, SHEE_TERMS_DICTIONARY } from '../data/shee_literature_data';

export default function LiteratureLookupPanel({ initialTerm }) {
  const [activeTab, setActiveTab] = useState('term_by_term'); // 'term_by_term' | 'full_literature'
  const [searchTerm, setSearchTerm] = useState(initialTerm || '');
  const [selectedTermObj, setSelectedTermObj] = useState(null);
  const [selectedTagFilter, setSelectedTagFilter] = useState('ALL');

  useEffect(() => {
    if (initialTerm) {
      setSearchTerm(initialTerm);
      setActiveTab('term_by_term');
      const match = SHEE_TERMS_DICTIONARY.find(t => 
        t.term.toLowerCase().includes(initialTerm.toLowerCase()) ||
        initialTerm.toLowerCase().includes(t.term.toLowerCase())
      );
      if (match) {
        setSelectedTermObj(match);
      }
    }
  }, [initialTerm]);

  // Extract all unique tags across literature publications
  const allTags = ['ALL', ...new Set(SHEE_PUBLICATIONS.flatMap(p => p.tags))];

  // Filter terms dictionary based on search query
  const filteredTerms = SHEE_TERMS_DICTIONARY.filter(t => 
    t.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter publications based on search query and tag filter
  const filteredPublications = SHEE_PUBLICATIONS.filter(pub => {
    const matchesTag = selectedTagFilter === 'ALL' || pub.tags.includes(selectedTagFilter);
    const matchesSearch = searchTerm === '' ||
      pub.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.abstract.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.authors.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pub.journal.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTag && matchesSearch;
  });

  return (
    <div className="literature-lookup-container">
      {/* Header */}
      <div className="lit-header">
        <div className="lit-header-text">
          <h2>📚 Dr. Chandan Shee Literature Reference & Dictionary</h2>
          <p className="subtitle">
            Interactive search across Dr. Shee's publications on Stress-Induced Mutagenesis, Double-Strand Breaks, and GamGFP
          </p>
        </div>

        {/* Mode Switcher Buttons */}
        <div className="lit-mode-switcher">
          <button
            className={`lit-mode-btn ${activeTab === 'term_by_term' ? 'active' : ''}`}
            onClick={() => setActiveTab('term_by_term')}
          >
            🔍 Term-by-Term Dictionary ({SHEE_TERMS_DICTIONARY.length} terms)
          </button>
          <button
            className={`lit-mode-btn ${activeTab === 'full_literature' ? 'active' : ''}`}
            onClick={() => setActiveTab('full_literature')}
          >
            📖 Full Literature Database ({SHEE_PUBLICATIONS.length} papers)
          </button>
        </div>
      </div>

      {/* Global Search Bar */}
      <div className="lit-search-bar-row">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            className="lit-search-input"
            placeholder={
              activeTab === 'term_by_term'
                ? "Search terms e.g. DinB, LexA, GamGFP, R-loops, Anti-evolutionary..."
                : "Search literature by title, keyword, author, or journal..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {searchTerm && (
            <button className="clear-search-btn" onClick={() => setSearchTerm('')}>
              ✕
            </button>
          )}
        </div>

        {activeTab === 'full_literature' && (
          <div className="tag-filter-pills">
            {allTags.map(tag => (
              <button
                key={tag}
                className={`tag-pill-btn ${selectedTagFilter === tag ? 'active' : ''}`}
                onClick={() => setSelectedTagFilter(tag)}
              >
                {tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Mode 1: Term-by-Term Lookup */}
      {activeTab === 'term_by_term' && (
        <div className="term-lookup-layout">
          {/* Term List Sidebar */}
          <div className="term-list-sidebar">
            <div className="term-list-count">
              Found {filteredTerms.length} scientific terms
            </div>
            {filteredTerms.map(item => (
              <div
                key={item.term}
                className={`term-item-card ${selectedTermObj?.term === item.term ? 'selected' : ''}`}
                onClick={() => setSelectedTermObj(item)}
              >
                <div className="term-item-title">{item.term}</div>
                <div className="term-item-category">{item.category}</div>
              </div>
            ))}

            {filteredTerms.length === 0 && (
              <div className="no-results-msg">
                No matching terms found. Try searching for "DinB", "LexA", "GamGFP", or "R-loops".
              </div>
            )}
          </div>

          {/* Term Detail View Panel */}
          <div className="term-detail-panel">
            {selectedTermObj ? (
              <div className="term-detail-content">
                <div className="term-title-row">
                  <h3>{selectedTermObj.term}</h3>
                  <span className="term-badge">{selectedTermObj.category}</span>
                </div>

                <div className="term-section">
                  <h4>💡 Definition & Molecular Function</h4>
                  <p className="term-definition">{selectedTermObj.definition}</p>
                </div>

                <div className="term-section citation-box">
                  <h4>📄 Dr. Chandan Shee Literature Citation</h4>
                  <div className="citation-text">
                    <span className="citation-icon">📌</span>
                    <span>{selectedTermObj.sheeCitation}</span>
                  </div>
                </div>

                <div className="term-section">
                  <h4>🔗 Related Scientific Terms</h4>
                  <div className="related-terms-flex">
                    {selectedTermObj.relatedTerms.map(rel => (
                      <button
                        key={rel}
                        className="related-term-chip"
                        onClick={() => {
                          setSearchTerm(rel);
                          const match = SHEE_TERMS_DICTIONARY.find(t => t.term === rel);
                          if (match) setSelectedTermObj(match);
                        }}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="term-placeholder">
                <div className="placeholder-icon">📚</div>
                <h3>Select a term from the list</h3>
                <p>Click any scientific term to inspect its detailed definition, molecular role in E. coli, and Dr. Shee publication citations.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Mode 2: Full Literature Database */}
      {activeTab === 'full_literature' && (
        <div className="full-literature-grid">
          {filteredPublications.map(pub => (
            <div key={pub.id} className="pub-card">
              <div className="pub-header">
                <span className="pub-year-badge">{pub.year}</span>
                <span className="pub-journal-badge">{pub.journal}</span>
              </div>

              <h3 className="pub-title">{pub.title}</h3>
              <div className="pub-authors">{pub.authors}</div>

              <div className="pub-tags-row">
                {pub.tags.map(t => (
                  <span key={t} className="pub-tag">{t}</span>
                ))}
              </div>

              <div className="pub-abstract">
                <strong>Abstract:</strong> {pub.abstract}
              </div>

              <div className="pub-takeaways">
                <h4>🎯 Key Laboratory Insights:</h4>
                <ul>
                  {pub.keyTakeaways.map((takeaway, idx) => (
                    <li key={idx}>{takeaway}</li>
                  ))}
                </ul>
              </div>

              <div className="pub-footer">
                <span className="pub-doi">DOI: {pub.doi}</span>
                <a
                  href={pub.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="pub-doi-link"
                >
                  🔗 View Full Paper
                </a>
              </div>
            </div>
          ))}

          {filteredPublications.length === 0 && (
            <div className="no-results-msg full-grid-msg">
              No publications matched your search criteria. Try clearing the search or tag filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
