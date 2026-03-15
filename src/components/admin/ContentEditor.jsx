import React, { useState } from 'react';
import { useContent } from '@/context/ContentContext.js';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';

const ContentEditor = () => {
  const { content, updateContent, resetContent } = useContent();
  const [editableContent, setEditableContent] = useState(JSON.parse(JSON.stringify(content)));
  const { toast } = useToast();

  const handleInputChange = (path, value) => {
    setEditableContent(prev => {
      const newContent = JSON.parse(JSON.stringify(prev));
      let current = newContent;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      return newContent;
    });
  };
  
  const handleSave = () => {
    Object.keys(editableContent).forEach(page => {
        Object.keys(editableContent[page]).forEach(section => {
            updateContent(page, section, editableContent[page][section]);
        });
    });
    toast({
      title: "Content Saved!",
      description: "Your changes have been successfully saved.",
    });
  };

  const handleReset = () => {
    resetContent();
    setEditableContent(JSON.parse(JSON.stringify(content)));
     toast({
      title: "Content Reset!",
      description: "Website content has been reset to default.",
      variant: "destructive",
    });
  }

  const renderFields = (data, path = []) => {
    return Object.entries(data).map(([key, value]) => {
      const currentPath = [...path, key];
      if (typeof value === 'string') {
        return (
          <div key={currentPath.join('-')} className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 capitalize mb-1">
              {key.replace(/([A-Z])/g, ' $1')}
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleInputChange(currentPath, e.target.value)}
              className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600"
            />
          </div>
        );
      } else if (Array.isArray(value)) {
        return (
          <div key={currentPath.join('-')} className="mb-4 p-4 border rounded-md border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold capitalize mb-2">{key}</h4>
            {value.map((item, index) => (
              <div key={index} className="mb-3 p-3 border-t border-gray-200 dark:border-gray-700 first:border-t-0">
                <p className="font-medium text-gray-500 dark:text-gray-400 mb-2">Item {index + 1}</p>
                {renderFields(item, [...currentPath, index])}
              </div>
            ))}
          </div>
        );
      }
      return null;
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Content Management</h1>
          <p className="text-gray-500">Edit the text content for your website pages.</p>
        </div>
        <div className="flex space-x-2">
           <Button onClick={handleReset} variant="destructive">Reset to Default</Button>
           <Button onClick={handleSave}>Save Changes</Button>
        </div>
      </div>
      
      <div className="space-y-8">
        {Object.keys(editableContent).map(page => (
          <div key={page} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
            <h2 className="text-2xl font-semibold mb-4 capitalize">{page} Page</h2>
            <div className="space-y-6">
              {Object.keys(editableContent[page]).map(section => (
                <div key={`${page}-${section}`}>
                  <h3 className="text-xl font-semibold mb-3 capitalize border-b pb-2">{section} Section</h3>
                  {renderFields(editableContent[page][section], [page, section])}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentEditor;