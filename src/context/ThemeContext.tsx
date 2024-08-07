import React, { createContext, useState } from 'react';

export type Theme = 'light' | 'dark';

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const ThemeContext = createContext<ThemeContextProps>({
  theme: 'light',
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [theme, setTheme] = useState<Theme>('light');

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`main-wrapper ${theme}-theme`}>{children}</div>
    </ThemeContext.Provider>
  );
};
