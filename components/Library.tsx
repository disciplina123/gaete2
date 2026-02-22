import React, { useState } from 'react';
import { Library as LibraryIcon, Search, Loader2, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';
import { Book } from '../types';
import { soundService } from '../services/soundService';

interface LibraryProps {
  myBooks: Book[];
  onAddBook: (book: Book) => void;
  onRemoveBook: (id: string) => void;
  onToggleStatus?: (id: string) => void;
}

const Library: React.FC<LibraryProps> = ({ myBooks, onAddBook, onRemoveBook, onToggleStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<Book | null>(null);
  const [error, setError] = useState('');

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError('');
    setSearchResult(null);

    try {
      const response = await fetch(`https://openlibrary.org/search.json?q=${encodeURIComponent(searchTerm)}&limit=1&fields=key,title,author_name,cover_i`);
      
      if (!response.ok) {
         throw new Error('Serviço indisponível no momento');
      }

      const data = await response.json();

      if (data.docs && data.docs.length > 0) {
        const bookData = data.docs[0];
        
        let thumbnail = 'https://placehold.co/128x192/222/fff?text=Sem+Capa';
        if (bookData.cover_i) {
            thumbnail = `https://covers.openlibrary.org/b/id/${bookData.cover_i}-M.jpg`;
        }

        const foundBook: Book = {
          id: bookData.key, 
          title: bookData.title || 'Sem título',
          authors: bookData.author_name || ['Autor Desconhecido'],
          thumbnail: thumbnail,
          addedAt: new Date().toISOString(),
          completed: false
        };
        
        setSearchResult(foundBook);
      } else {
        setError('Nenhum livro encontrado com este termo.');
      }
    } catch (err) {
      console.error("Library Search Error:", err);
      setError('Erro ao buscar. Tente novamente em instantes.');
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const addToLibrary = () => {
    if (searchResult) {
      if (myBooks.some(b => b.id === searchResult.id)) {
        alert('Este livro já está na sua biblioteca!');
        return;
      }
      onAddBook(searchResult);
      setSearchResult(null);
      setSearchTerm('');
    }
  };

  return (
    <div className="library-container">
      <div className="library-card">
        <div className="stats-header">
          <LibraryIcon size={22} />
          <h2>Biblioteca</h2>
        </div>
        
        <div className="library-search-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Digite o nome do livro, autor..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
                onClick={() => { soundService.playClick(); handleSearch(); }} 
                className="btn-primary" 
                disabled={loading}
                type="button" 
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
              Buscar
            </button>
          </div>

          {error && <div style={{ color: '#ef4444', marginBottom: '1rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>{error}</div>}

          {searchResult && (
            <div className="book-result">
              <img src={searchResult.thumbnail} alt={searchResult.title} onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://placehold.co/128x192/222/fff?text=Sem+Capa';
              }}/>
              <div className="book-result-info">
                <h3>{searchResult.title}</h3>
                <p>Autor: {searchResult.authors.join(', ')}</p>
                <button onClick={() => { soundService.playAdd(); addToLibrary(); }} className="btn-secondary">
                  <Plus size={16} /> Adicionar à Biblioteca
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="library-card" style={{ marginTop: '0.75rem' }}>
        <div className="stats-header" style={{ border: 'none', paddingBottom: 0, marginBottom: '1rem' }}>
           <h3>Minha Estante ({myBooks.length})</h3>
        </div>
        
        {myBooks.length === 0 ? (
           <div className="empty-state">
             Sua estante está vazia. Pesquise e adicione livros acima!
           </div>
        ) : (
          <div className="library-grid">
            {myBooks.map(book => (
              <div key={book.id} className={`book-card ${book.completed ? 'completed' : ''}`}>
                 {onToggleStatus && (
                    <button 
                      className={`book-status-btn ${book.completed ? 'completed' : ''}`}
                      onClick={() => { soundService.playToggle(); onToggleStatus(book.id); }}
                      title={book.completed ? "Marcar como não lido" : "Marcar como lido"}
                      type="button"
                    >
                      {book.completed ? <CheckCircle2 size={16} /> : <Circle size={16} />}
                    </button>
                 )}
                 
                 <button 
                   className="book-remove-btn" 
                   onClick={() => { soundService.playDelete(); onRemoveBook(book.id); }}
                   title="Remover da biblioteca"
                   type="button"
                 >
                   <Trash2 size={14} />
                 </button>
                 <img src={book.thumbnail} alt={book.title} className="book-cover" />
                 <div className="book-title" title={book.title}>{book.title}</div>
                 <div className="book-author" title={book.authors.join(', ')}>{book.authors[0]}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Library;
