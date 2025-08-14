'use client';

import { useState, useRef, useEffect } from 'react';

interface SearchableDropdownProps {
  availableOptions: string[];
  selectedOptions: string[];
  onChange: (selectedOptions: string[]) => void;
  label: string;
  placeholder?: string;
  searchPlaceholder?: string;
}

export default function SearchableDropdown({
    availableOptions,
    selectedOptions,
    onChange,
    label,
    placeholder = "Select categories...",
    searchPlaceholder = "Search categories..."
}: SearchableDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Filter options based on search term
    const filteredOptions = availableOptions.filter(option =>
        option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setSearchTerm('');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const toggleOption = (option: string) => {
        if (selectedOptions.includes(option)) {
            onChange(selectedOptions.filter(item => item !== option));
        } else {
            onChange([...selectedOptions, option]);
        }
    };

    const clearAll = () => {
        onChange([]);
        setIsOpen(false);
        setSearchTerm('');
    };

    const selectAll = () => {
        onChange([...availableOptions]);
        setIsOpen(false);
        setSearchTerm('');
    };

    if (availableOptions.length === 0) {
        return null;
    }

    return (
        <div className="relative" ref={dropdownRef}>
            {selectedOptions.length > 0 && (
                <div className="flex items-center justify-end mb-2">
                    <div className="flex items-center gap-2">
                        <button
                            type="button"
                            onClick={selectAll}
                            className="text-sm text-green-600 hover:text-green-800 font-medium hover:underline transition-colors duration-200"
                        >
                            Select all
                        </button>
                        <button
                            type="button"
                            onClick={clearAll}
                            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
                        >
                            Clear all ({selectedOptions.length})
                        </button>
                    </div>
                </div>
            )}

            {/* Dropdown Trigger */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-full flex items-center justify-between px-3 py-2 text-left bg-gray-50 border border-gray-200 rounded-xl 
                    transition-all duration-200 shadow-sm hover:shadow-md focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20
                    ${isOpen ? 'bg-white border-blue-500 ring-2 ring-blue-500/20' : ''}
                `}
            >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                    {selectedOptions.length === 0 ? (
                        <span className="text-gray-500 font-medium">{placeholder}</span>
                    ) : (
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-black font-medium">
                                {selectedOptions.length} selected
                            </span>
                            {selectedOptions.length <= 3 && (
                                <div className="flex gap-1">
                                    {selectedOptions.map(option => (
                                        <span
                                            key={option}
                                            className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-black border border-blue-200"
                                        >
                                            {option}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                <svg
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                    {/* Search Input */}
                    <div className="p-2 border-b border-gray-100">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder={searchPlaceholder}
                                className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 text-black"
                                autoFocus
                            />
                        </div>
                    </div>

                    {/* Options List */}
                    <div className="max-h-32 overflow-y-auto">
                        {filteredOptions.length === 0 ? (
                            <div className="px-4 py-2 text-sm text-black text-center">
                                No categories found
                            </div>
                        ) : (
                            filteredOptions.map(option => (
                                <button
                                    key={option}
                                    type="button"
                                    onClick={() => toggleOption(option)}
                                    className={`
                                        w-full flex items-center px-4 py-2 text-left text-sm transition-colors duration-150
                                        hover:bg-gray-50 focus:outline-none focus:bg-gray-50
                                        ${selectedOptions.includes(option) ? 'bg-blue-50 text-black' : 'text-black'}
                                    `}
                                >
                                    <div className="flex items-center gap-3 w-full">
                                        <div className={`
                                            w-4 h-4 border-2 rounded flex items-center justify-center transition-colors duration-150
                                            ${selectedOptions.includes(option) 
                                                ? 'bg-blue-500 border-blue-500' 
                                                : 'border-gray-300 hover:border-gray-400'
                                            }
                                        `}>
                                            {selectedOptions.includes(option) && (
                                                <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                                </svg>
                                            )}
                                        </div>
                                        <span className="font-medium text-black">{option}</span>
                                    </div>
                                </button>
                            ))
                        )}
                    </div>

                    {/* Footer with actions */}
                    {selectedOptions.length > 0 && (
                        <div className="border-t border-gray-100 p-2 bg-gray-50">
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-black">
                                    {selectedOptions.length} of {availableOptions.length} selected
                                </span>
                                <div className="flex gap-2">
                                    <button
                                        type="button"
                                        onClick={selectAll}
                                        className="text-green-600 hover:text-green-800 font-medium hover:underline"
                                    >
                                        Select all
                                    </button>
                                    <button
                                        type="button"
                                        onClick={clearAll}
                                        className="text-red-600 hover:text-red-800 font-medium hover:underline"
                                    >
                                        Clear all
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
