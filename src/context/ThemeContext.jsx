import React, { createContext, useContext, useState, useEffect } from 'react';

export const THEMES = {
  electric: {
    id: 'electric',
    name: '⚡ Electric Amber & Blue',
    primary: '#F59E0B', // Amber
    primaryHover: '#D97706',
    secondary: '#2563EB', // Electric Blue
    accent: '#10B981', // Emerald
    gradientBg: 'linear-gradient(135deg, #FFFBEB 0%, #EFF6FF 40%, #FEF3C7 70%, #F0FDF4 100%)',
    headerBg: 'bg-slate-900',
    cardBorder: 'border-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.4)',
    badgeBg: 'bg-amber-500 text-slate-950',
    btnGradient: 'from-amber-400 via-amber-500 to-yellow-400',
    taglineColor: 'text-amber-400'
  },
  sunset: {
    id: 'sunset',
    name: '🌅 Sunset Orange & Violet',
    primary: '#F97316', // Orange
    primaryHover: '#EA580C',
    secondary: '#8B5CF6', // Violet
    accent: '#EC4899', // Pink
    gradientBg: 'linear-gradient(135deg, #FFF7ED 0%, #F5F3FF 40%, #FDF2F8 70%, #FEF2F2 100%)',
    headerBg: 'bg-slate-950',
    cardBorder: 'border-orange-400',
    glowColor: 'rgba(249, 115, 22, 0.4)',
    badgeBg: 'bg-orange-500 text-white',
    btnGradient: 'from-orange-500 via-amber-500 to-rose-500',
    taglineColor: 'text-orange-400'
  },
  cyberEmerald: {
    id: 'cyberEmerald',
    name: '🌿 Cyber Emerald & Teal',
    primary: '#10B981', // Emerald
    primaryHover: '#059669',
    secondary: '#06B6D4', // Cyan
    accent: '#F59E0B', // Amber
    gradientBg: 'linear-gradient(135deg, #ECFDF5 0%, #F0FDFA 40%, #EFF6FF 70%, #FFFBEB 100%)',
    headerBg: 'bg-[#062419]',
    cardBorder: 'border-emerald-400',
    glowColor: 'rgba(16, 185, 129, 0.4)',
    badgeBg: 'bg-emerald-500 text-white',
    btnGradient: 'from-emerald-400 via-teal-500 to-cyan-500',
    taglineColor: 'text-emerald-400'
  },
  royalIndigo: {
    id: 'royalIndigo',
    name: '🔮 Royal Indigo & Sky',
    primary: '#6366F1', // Indigo
    primaryHover: '#4F46E5',
    secondary: '#0EA5E9', // Sky Blue
    accent: '#F59E0B', // Amber
    gradientBg: 'linear-gradient(135deg, #EEF2FF 0%, #F0F9FF 40%, #FAF5FF 70%, #FFFBEB 100%)',
    headerBg: 'bg-[#0B132B]',
    cardBorder: 'border-indigo-400',
    glowColor: 'rgba(99, 102, 241, 0.4)',
    badgeBg: 'bg-indigo-600 text-white',
    btnGradient: 'from-indigo-500 via-blue-500 to-sky-400',
    taglineColor: 'text-indigo-400'
  }
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState(() => {
    const saved = localStorage.getItem('siddharth_theme');
    return saved && THEMES[saved] ? saved : 'electric';
  });

  const theme = THEMES[currentTheme] || THEMES.electric;

  useEffect(() => {
    localStorage.setItem('siddharth_theme', currentTheme);
    document.documentElement.style.setProperty('--theme-primary', theme.primary);
    document.documentElement.style.setProperty('--theme-glow', theme.glowColor);
  }, [currentTheme, theme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setCurrentTheme, theme, allThemes: THEMES }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
