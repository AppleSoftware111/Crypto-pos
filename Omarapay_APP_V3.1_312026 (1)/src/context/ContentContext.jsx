import React, { createContext, useState, useEffect, useContext } from 'react';
import { initialContent } from '@/data/contentData';

const ContentContext = createContext();

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    try {
      const savedContent = localStorage.getItem('omaraContent');
      if (savedContent) {
        return JSON.parse(savedContent);
      }
    } catch (error) {
      console.error("Failed to parse content from localStorage", error);
    }
    return initialContent;
  });

  useEffect(() => {
    try {
      localStorage.setItem('omaraContent', JSON.stringify(content));
    } catch (error) {
      console.error("Failed to save content to localStorage", error);
    }
  }, [content]);

  const updateContent = (page, section, newValues) => {
    setContent(prevContent => {
      const updatedPage = {
        ...prevContent[page],
        [section]: {
          ...prevContent[page][section],
          ...newValues,
        },
      };
      return {
        ...prevContent,
        [page]: updatedPage,
      };
    });
  };
  
  const resetContent = () => {
    localStorage.removeItem('omaraContent');
    setContent(initialContent);
  }

  const value = { content, updateContent, resetContent };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};