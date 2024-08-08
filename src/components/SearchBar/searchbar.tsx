///Users/malmobarak001/All_Vscode/myprojectforbooks/frontend/src/components/SearchBar/searchbar.tsx

import React, { useState, ChangeEvent, FC } from 'react';
import styles from '../../App.module.css';

const SearchIcon: FC = () => {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_1_1859" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="2" y="2" width="20" height="20">
        <path fillRule="evenodd" clipRule="evenodd" d="M2 2H21.4768V21.477H2V2Z" fill="white"/>
      </mask>
      <g mask="url(#mask0_1_1859)">
        <path fillRule="evenodd" clipRule="evenodd" d="M11.7388 3.5C7.19576 3.5 3.49976 7.195 3.49976 11.738C3.49976 16.281 7.19576 19.977 11.7388 19.977C16.2808 19.977 19.9768 16.281 19.9768 11.738C19.9768 7.195 16.2808 3.5 11.7388 3.5ZM11.7388 21.477C6.36876 21.477 1.99976 17.108 1.99976 11.738C1.99976 6.368 6.36876 2 11.7388 2C17.1088 2 21.4768 6.368 21.4768 11.738C21.4768 17.108 17.1088 21.477 11.7388 21.477Z" fill="white"/>
      </g>
      <mask id="mask1_1_1859" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="17" y="17" width="6" height="6">
        <path fillRule="evenodd" clipRule="evenodd" d="M17.24 17.7069H22.264V22.7217H17.24V17.7069Z" fill="white"/>
      </mask>
      <g mask="url(#mask1_1_1859)">
        <path fillRule="evenodd" clipRule="evenodd" d="M21.5142 22.7217C21.3232 22.7217 21.1312 22.6487 20.9842 22.5027L17.4602 18.9887C17.1672 18.6957 17.1662 18.2207 17.4592 17.9277C17.7512 17.6327 18.2262 17.6347 18.5202 17.9257L22.0442 21.4407C22.3372 21.7337 22.3382 22.2077 22.0452 22.5007C21.8992 22.6487 21.7062 22.7217 21.5142 22.7217Z" fill="white"/>
      </g>
    </svg>
  );
};

const FilterIcon: FC = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M10.0801 18.5928H3.77905C3.36505 18.5928 3.02905 18.2568 3.02905 17.8428C3.02905 17.4288 3.36505 17.0928 3.77905 17.0928H10.0801C10.4941 17.0928 10.8301 17.4288 10.8301 17.8428C10.8301 18.2568 10.4941 18.5928 10.0801 18.5928Z" fill="#F7F5FF"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M19.1909 8.90039H12.8909C12.4769 8.90039 12.1409 8.56439 12.1409 8.15039C12.1409 7.73639 12.4769 7.40039 12.8909 7.40039H19.1909C19.6049 7.40039 19.9409 7.73639 19.9409 8.15039C19.9409 8.56439 19.6049 8.90039 19.1909 8.90039Z" fill="#F7F5FF"/>
    <mask id="mask0_85_11642" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="3" y="5" width="7" height="7">
      <path fillRule="evenodd" clipRule="evenodd" d="M3 5.0004H9.2258V11.192H3V5.0004Z" fill="white"/>
    </mask>
    <g mask="url(#mask0_85_11642)">
      <path fillRule="evenodd" clipRule="evenodd" d="M6.11276 6.5C5.22376 6.5 4.49976 7.216 4.49976 8.097C4.49976 8.977 5.22376 9.692 6.11276 9.692C7.00276 9.692 7.72576 8.977 7.72576 8.097C7.72576 7.216 7.00276 6.5 6.11276 6.5ZM6.11276 11.192C4.39676 11.192 2.99976 9.804 2.99976 8.097C2.99976 6.39 4.39676 5 6.11276 5C7.82976 5 9.22576 6.39 9.22576 8.097C9.22576 9.804 7.82976 11.192 6.11276 11.192Z" fill="#F7F5FF"/>
    </g>
    <path fillRule="evenodd" clipRule="evenodd" d="M17.3877 16.208C16.4977 16.208 15.7737 16.924 15.7737 17.804C15.7737 18.685 16.4977 19.4 17.3877 19.4C18.2767 19.4 18.9997 18.685 18.9997 17.804C18.9997 16.924 18.2767 16.208 17.3877 16.208ZM17.3877 20.9C15.6707 20.9 14.2737 19.511 14.2737 17.804C14.2737 16.097 15.6707 14.708 17.3877 14.708C19.1037 14.708 20.4997 16.097 20.4997 17.804C20.4997 19.511 19.1037 20.9 17.3877 20.9Z" fill="#F7F5FF"/>
    <circle cx="6" cy="8" r="2" fill="#F7F5FF"/>
  </svg>
);

interface SearchBarProps {
  onSearch: (query: string) => void;
  onFilter: (filter: string) => void;
}

const SearchBar: FC<SearchBarProps> = ({ onSearch, onFilter }) => {
  const [query, setQuery] = useState<string>('');
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchClick = () => {
    onSearch(query);
  };

  const handleFilterClick = () => {
    setShowFilters(!showFilters);
  };

  const handleFilterSelect = (filter: string) => {
    onFilter(filter);
    setShowFilters(false);
  };

  return (
    <div className={styles['search-bar']}>
      <button onClick={handleSearchClick}>
        <SearchIcon />
      </button>
      <input
        type="text"
        placeholder="Type book title, genre (genre:), or author (author:)"
        value={query}
        onChange={handleInputChange}
      />
      <button onClick={handleFilterClick}>
        <FilterIcon />
      </button>
      {showFilters && (
        <div className={styles['filter-dropdown']}>
          <button onClick={() => handleFilterSelect('recent')}>Most recent publish year</button>
          <button onClick={() => handleFilterSelect('earliest')}>Earliest publish year</button>
          <button onClick={() => handleFilterSelect('top-rated')}>Top rated</button>
          <button onClick={() => handleFilterSelect('least-rated')}>Least rated</button>
          <button onClick={() => handleFilterSelect('recently-added')}>Recently Added</button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
