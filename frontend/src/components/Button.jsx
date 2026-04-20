import React from 'react';

const Button = ({ children, onClick, className = '', variant = 'primary', size = 'md', ...props }) => {
  const baseStyles = "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-300 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variants = {
    primary: "bg-gradient-to-r from-secondary to-secondary-dark text-white shadow-lg shadow-secondary/30 hover:shadow-xl hover:-translate-y-0.5 border border-transparent",
    secondary: "bg-white text-secondary-dark border border-slate-200 hover:bg-slate-50 hover:border-secondary/30 shadow-sm hover:shadow-md",
    outline: "bg-transparent text-white border border-white/30 hover:bg-white/10",
    "outline-primary": "bg-transparent text-primary border border-primary hover:bg-primary hover:text-white shadow-sm hover:shadow-md",
    ghost: "bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg",
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
