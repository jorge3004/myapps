import React, { useState, useEffect, useRef } from 'react';
import { InputBase, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';


const SearchBar = ({ onSearch, placeholder = 'Buscar...', sx }) => {
    const [value, setValue] = useState('');
    const debounceRef = useRef();

    // Debounce onSearch
    useEffect(() => {
        if (!onSearch) return;
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            onSearch(value);
        }, 300);
        return () => clearTimeout(debounceRef.current);
    }, [value, onSearch]);

    const handleChange = (e) => setValue(e.target.value);
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSearch) onSearch(value);
    };

    return (
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{ display: 'flex', alignItems: 'center', boxShadow: 0, ...sx }}
        >
            <InputBase
                sx={{ ml: 1, flex: 1, minWidth: 120 }}
                placeholder={placeholder}
                value={value}
                onChange={handleChange}
                inputProps={{ 'aria-label': placeholder }}
            />
            <IconButton type="submit" sx={{ p: '6px' }} aria-label="buscar">
                <SearchIcon />
            </IconButton>
        </Paper>
    );
};

export default SearchBar;
