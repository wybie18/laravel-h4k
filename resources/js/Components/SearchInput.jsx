import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';
import { IoIosSearch } from "react-icons/io";

const SearchInput = forwardRef(
    (
        {
            className = '',
            isFocused = false,
            placeholder = 'Search...',
            onSearch = () => { },
            buttonText = 'Search',
            ...props
        },
        ref
    ) => {
        const inputRef = useRef(null);

        useImperativeHandle(ref, () => ({
            focus: () => inputRef.current?.focus(),
        }));

        useEffect(() => {
            if (isFocused) {
                inputRef.current?.focus();
            }
        }, [isFocused]);

        return (
            <div className={`relative ${className}`}>
                <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                    <IoIosSearch />
                </div>
                <input
                    {...props}
                    ref={inputRef}
                    type="search"
                    className={`block w-full p-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 ${className}`}
                    placeholder={placeholder}
                />
                <button
                    type="button"
                    onClick={onSearch}
                    className="text-white absolute end-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
                >
                    {buttonText}
                </button>
            </div>
        );
    }
);

export default SearchInput;
