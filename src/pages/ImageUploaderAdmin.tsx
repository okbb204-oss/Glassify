import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { crafts } from '../data/crafts';
import { useCraftImages } from '../contexts/CraftImagesContext';

export default function ImageUploaderAdmin() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { images, refreshImages } = useCraftImages();

  const [selectedCraftId, setSelectedCraftId] = useState<string>(crafts[0].id);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      if (!f.type.startsWith('image/')) {
        setError(isRTL ? 'الرجاء اختيار ملف صورة' : 'Please select an image file');
        return;
      }
      setFile(f);
      setPreview(URL.createObjectURL(f));
      setError(null);
      setSuccess(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setIsLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const response = await fetch(`/api/admin/craft-image/${selectedCraftId}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      if (data.success) {
        setSuccess(true);
        setFile(null);
        setPreview(null);
        await refreshImages();
      }
    } catch (err: any) {
      setError(isRTL ? 'فشل تحميل الصورة' : 'Failed to upload image');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-[var(--color-card)] p-8 rounded-3xl shadow-sm border border-[var(--color-border)]">
      <h2 className="text-xl font-bold font-heading mb-6 flex items-center gap-2 text-[var(--color-dark)]">
        <ImageIcon className="w-5 h-5 text-[var(--color-primary)]" />
        {isRTL ? 'إدارة صور الحرف (الواقعية)' : 'Management of Craft Images (Realistic)'}
      </h2>

      {error && (
        <div className="bg-red-50 text-[var(--color-danger)] p-4 rounded-xl flex items-start gap-3 border border-red-100 mb-6">
          <AlertCircle className="w-5 h-5 mt-0.5" />
          <p className="font-medium text-sm">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-green-50 text-[var(--color-success)] p-4 rounded-xl flex items-start gap-3 border border-green-100 mb-6">
          <CheckCircle2 className="w-5 h-5 mt-0.5" />
          <p className="font-medium text-sm">{isRTL ? 'تم رفع الصورة بنجاح!' : 'Image uploaded successfully!'}</p>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="block text-sm font-bold text-[var(--color-secondary)] mb-2">{isRTL ? 'اختر الحرفة' : 'Select Craft'}</label>
          <select 
            value={selectedCraftId} 
            onChange={(e) => setSelectedCraftId(e.target.value)}
            className={`w-full border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl px-4 py-3 focus:outline-none transition-colors bg-[var(--color-input-bg)] text-[var(--color-dark)] ${isRTL ? 'text-right' : 'text-left'}`}
          >
            {crafts.map((craft) => (
              <option key={craft.id} value={craft.id}>
                {isRTL ? craft.nameAR : craft.nameEN || craft.nameFR}
              </option>
            ))}
          </select>
        </div>

        <div>
           <label className="block text-sm font-bold text-[var(--color-secondary)] mb-2">{isRTL ? 'الصورة الجديدة' : 'New Image'}</label>
           <input 
             type="file" 
             accept="image/*"
             onChange={handleFileChange}
             className="hidden"
             id="craft-image-upload"
           />
           <label 
             htmlFor="craft-image-upload"
             className="w-full flex-col flex items-center justify-center p-8 border-2 border-dashed border-[var(--color-border)] hover:border-[var(--color-primary)] rounded-xl cursor-pointer transition-colors bg-[var(--color-bg-sand)]/50"
           >
             <Upload className="w-8 h-8 text-[var(--color-secondary)] mb-2" />
             <span className="text-sm text-[var(--color-secondary)] font-medium">
               {isRTL ? 'انقر لاختيار صوره' : 'Click to select image'}
             </span>
           </label>
        </div>

        {preview && (
          <div className="relative rounded-xl overflow-hidden aspect-video border border-[var(--color-border)]">
             <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>
        )}

        <button 
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full bg-[var(--color-dark)] text-[var(--color-bg-sand)] font-bold py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-black transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              {isRTL ? 'جاري الرفع...' : 'Uploading...'}
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-[var(--color-primary)]" />
              {isRTL ? 'رفع الصورة' : 'Upload Image'}
            </>
          )}
        </button>

        {images[selectedCraftId] && (
          <div className="pt-6 mt-6 border-t border-[var(--color-border)]">
            <h3 className="text-sm font-bold text-[var(--color-secondary)] mb-4">{isRTL ? 'الصورة الحالية' : 'Current Image'}</h3>
             <img src={images[selectedCraftId]} alt="Current" className="w-full rounded-xl border border-[var(--color-border)] aspect-video object-cover" />
          </div>
        )}
      </div>
    </div>
  );
}
