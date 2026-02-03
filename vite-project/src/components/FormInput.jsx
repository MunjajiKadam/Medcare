import { useState } from 'react';

export default function FormInput({
  label,
  type = 'text',
  name,
  value,
  onChange,
  onBlur,
  placeholder = '',
  required = false,
  disabled = false,
  error = '',
  helpText = '',
  icon = null,
  validate = null,
  className = '',
  autoComplete = 'off',
  ...props
}) {
  const [touched, setTouched] = useState(false);
  const [internalError, setInternalError] = useState('');

  const handleBlur = (e) => {
    setTouched(true);
    
    // Run validation if provided
    if (validate && value) {
      const validationError = validate(value);
      setInternalError(validationError || '');
    }
    
    if (onBlur) {
      onBlur(e);
    }
  };

  const handleChange = (e) => {
    // Clear error when user starts typing
    if (touched && internalError) {
      setInternalError('');
    }
    
    onChange(e);
  };

  const displayError = error || (touched && internalError);
  const inputId = `input-${name}`;
  const errorId = `error-${name}`;
  const helpId = `help-${name}`;

  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="block text-sm font-semibold text-dark mb-2"
        >
          {label}
          {required && <span className="text-red-500 ml-1" aria-label="required">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          autoComplete={autoComplete}
          aria-invalid={!!displayError}
          aria-describedby={`${displayError ? errorId : ''} ${helpText ? helpId : ''}`.trim()}
          className={`w-full px-4 ${icon ? 'pl-10' : ''} py-2.5 border rounded-lg transition focus:outline-none focus:ring-2 disabled:bg-gray-100 disabled:cursor-not-allowed ${
            displayError 
              ? 'border-red-500 focus:ring-red-200 focus:border-red-500' 
              : 'border-gray-300 focus:ring-accent focus:border-accent'
          }`}
          {...props}
        />
        
        {displayError && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
        )}
      </div>
      
      {displayError && (
        <p id={errorId} className="mt-1.5 text-sm text-red-600 flex items-center gap-1" role="alert">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          {displayError}
        </p>
      )}
      
      {helpText && !displayError && (
        <p id={helpId} className="mt-1.5 text-sm text-gray-500">
          {helpText}
        </p>
      )}
    </div>
  );
}
