import React, { createContext, useContext, useEffect, useState } from 'react';

interface CraftImageStore {
  [craftId: string]: string;
}

interface CraftImagesContextType {
  images: CraftImageStore;
  refreshImages: () => Promise<void>;
}

const CraftImagesContext = createContext<CraftImagesContextType>({ images: {}, refreshImages: async () => {} });

export const useCraftImages = () => useContext(CraftImagesContext);

export const CraftImagesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [images, setImages] = useState<CraftImageStore>({});

  const refreshImages = async () => {
    try {
      const res = await fetch('/api/craft-images');
      if (res.ok) {
        const data = await res.json();
        const newImages: CraftImageStore = {};
        data.images.forEach((row: { craft_id: string; real_image_url: string }) => {
          newImages[row.craft_id] = row.real_image_url;
        });
        setImages(newImages);
      }
    } catch (e) {
      console.error('Failed to load craft images', e);
    }
  };

  useEffect(() => {
    refreshImages();
  }, []);

  return (
    <CraftImagesContext.Provider value={{ images, refreshImages }}>
      {children}
    </CraftImagesContext.Provider>
  );
};
