import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import favouritesReducer from './reducers/favouritesReducer'
import useFetchPhotos from './hooks/useFetchPhotos'

function initFavourites() {
  try {
    const stored = localStorage.getItem('celebrare-favourites')
    const parsed = JSON.parse(stored)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function App() {
  const { photos, loading, error } = useFetchPhotos()
  const [search, setSearch] = useState('')
  const [favourites, dispatch] = useReducer(favouritesReducer, undefined, initFavourites)

  useEffect(() => {
    try {
      localStorage.setItem('celebrare-favourites', JSON.stringify(favourites))
    } catch {}
  }, [favourites])

  const handleSearch = useCallback((e) => {
    setSearch(e.target.value)
  }, [])

  const handleToggleFavourite = useCallback((id) => {
    const isFavourite = favourites.includes(id)
    dispatch({ type: isFavourite ? 'REMOVE_FAVOURITE' : 'ADD_FAVOURITE', id })
  }, [favourites])

  const filteredPhotos = useMemo(() => {
    const trimmed = search.trim().toLowerCase()
    if (!trimmed) return photos
    return photos.filter((photo) =>
      photo.author.toLowerCase().includes(trimmed)
    )
  }, [photos, search])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">Photo Gallery</h1>
          <p className="text-gray-500 text-base">
            Explore a curated collection of photos and mark your favourites.
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search by author..."
            value={search}
            onChange={handleSearch}
            className="w-full max-w-md px-4 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-800 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {error && (
          <div className="flex justify-center items-center py-20">
            <p className="text-red-500 text-lg font-medium">{error}</p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length === 0 && (
          <div className="flex justify-center items-center py-20">
            <p className="text-gray-400 text-lg">
              {search.trim() ? 'No photos match your search.' : 'No photos found.'}
            </p>
          </div>
        )}

        {!loading && !error && filteredPhotos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredPhotos.map((photo) => {
              const isFavourite = favourites.includes(photo.id)
              return (
                <div
                  key={photo.id}
                  className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="relative">
                    <img
                      src={`https://picsum.photos/id/${photo.id}/600/400`}
                      alt={`Photo by ${photo.author}`}
                      className="w-full h-48 object-cover"
                      loading="lazy"
                    />
                    <button
                      onClick={() => handleToggleFavourite(photo.id)}
                      aria-label={isFavourite ? 'Remove from favourites' : 'Add to favourites'}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-white/80 hover:bg-white transition-colors duration-150 cursor-pointer"
                    >
                      {isFavourite ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-400 hover:text-red-400 transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3z" />
                        </svg>
                      )}
                    </button>
                  </div>
                  <div className="px-4 py-3">
                    <p className="text-sm font-medium text-gray-700 truncate">{photo.author}</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}

      </div>
    </div>
  )
}

export default App
