import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  label?: string;
  required?: boolean;
  id?: string;
  className?: string;
}

export function CustomSelect({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  label,
  required,
  id,
  className,
}: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const selectedOption = options.find(o => o.value === value);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (activeIndex >= 0 && listRef.current) {
      const el = listRef.current.children[activeIndex] as HTMLElement;
      if (el) el.scrollIntoView({ block: 'nearest' });
    }
  }, [activeIndex]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
        const idx = options.findIndex(o => o.value === value);
        setActiveIndex(idx >= 0 ? idx : 0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveIndex(prev => (prev < options.length - 1 ? prev + 1 : 0));
        break;
      case 'ArrowUp':
        e.preventDefault();
        setActiveIndex(prev => (prev > 0 ? prev - 1 : options.length - 1));
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (activeIndex >= 0 && activeIndex < options.length) {
          onChange(options[activeIndex].value);
          setIsOpen(false);
          setActiveIndex(-1);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setActiveIndex(-1);
        break;
    }
  };

  return (
    <div ref={containerRef} className={`relative ${className || ''}`}>
      {label && (
        <label htmlFor={id} className="block text-[#1d1d1f] mb-2">
          {label}
          {required && ' *'}
        </label>
      )}
      <button
        type="button"
        id={id}
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            const idx = options.findIndex(o => o.value === value);
            setActiveIndex(idx >= 0 ? idx : 0);
          }
        }}
        onKeyDown={handleKeyDown}
        className="w-full flex items-center justify-between px-4 py-2 bg-[#f5f5f7] rounded-xl focus:ring-2 focus:ring-[#4a7fb5]/20 focus:border-transparent outline-none text-left transition-colors"
      >
        <span className={selectedOption ? 'text-[#1d1d1f]' : 'text-[#86868b]'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown className={`w-4 h-4 text-[#86868b] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 bg-white rounded-xl shadow-lg max-h-64 overflow-y-auto"
          role="listbox"
        >
          {options.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === activeIndex;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onMouseDown={(e) => {
                  e.preventDefault();
                  onChange(option.value);
                  setIsOpen(false);
                  setActiveIndex(-1);
                }}
                onMouseEnter={() => setActiveIndex(index)}
                className={`flex items-center justify-between px-4 py-2.5 cursor-pointer transition-colors ${
                  isActive
                    ? 'bg-[#4a7fb5] text-white'
                    : isSelected
                    ? 'bg-[#f5f5f7] text-[#4a7fb5]'
                    : 'text-[#1d1d1f] hover:bg-[#f5f5f7]'
                }`}
              >
                <span className="text-sm">{option.label}</span>
                {isSelected && (
                  <Check className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#4a7fb5]'}`} />
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
