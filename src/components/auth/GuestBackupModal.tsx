import React, { useState } from 'react';
import { Shield, Key, Phone, ArrowLeft, Copy, CheckCircle2, ChevronRight, Save } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function GuestBackupModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { user, guestBackupCode, guestLinkPhone } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState<'select' | 'code' | 'phone'>('select');
  const [code, setCode] = useState<string | null>(user?.backup_code || null);
  const [phone, setPhone] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateCode = async () => {
    try {
      setLoading(true);
      setError('');
      if (!code) {
        const newCode = await guestBackupCode();
        setCode(newCode);
      }
      setStep('code');
    } catch (err: any) {
      setError(err.message || 'Error generating code');
    } finally {
      setLoading(false);
    }
  };

  const handleLinkPhone = async () => {
    try {
      setLoading(true);
      setError('');
      await guestLinkPhone(phone);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Error linking phone');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
      <div className="bg-[var(--color-navbar-bg)] rounded-3xl shadow-xl w-full max-w-md overflow-hidden relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-6 pb-0 flex items-start justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
               <Shield className="w-5 h-5" />
             </div>
             <h2 className="text-xl font-bold font-heading text-[var(--color-dark)]">
               {isRTL ? 'احفظ تقدمك' : 'Save Your Progress'}
             </h2>
          </div>
          <button onClick={onClose} className="p-2 text-[var(--color-secondary)] hover:bg-[var(--color-bg-sand)] rounded-full transition-colors">
            ✕
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-[var(--color-danger)] text-sm rounded-lg">
              {error}
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-4">
              <p className="text-[var(--color-secondary)] mb-6 text-sm leading-relaxed">
                {isRTL 
                  ? 'تقدمك يُحفظ تلقائياً على هذا الجهاز. لاسترجاعه على أجهزة أخرى، قم بربطه بإحدى الطرق التالية:'
                  : 'Your progress is automatically saved on this device. To restore it on other devices, choose a backup method:'}
              </p>

              <button 
                onClick={handleGenerateCode}
                className="w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group bg-[var(--color-card)]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-sand)] flex items-center justify-center text-[var(--color-dark)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <Key className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-[var(--color-dark)] ${isRTL ? 'text-right' : ''}`}>
                    {isRTL ? 'رمز استرجاع سريع' : 'Quick Backup Code'}
                  </h3>
                  <p className={`text-xs text-[var(--color-secondary)] mt-1 ${isRTL ? 'text-right' : ''}`}>
                    {isRTL ? 'احتفظ برمز سري لاسترجاع حسابك' : 'Keep a secret code to restore your account'}
                  </p>
                </div>
                {isRTL ? <ChevronRight className="w-5 h-5 text-[var(--color-secondary)] rotate-180" /> : <ChevronRight className="w-5 h-5 text-[var(--color-secondary)]" />}
              </button>

              <button 
                onClick={() => setStep('phone')}
                className="w-full text-left flex items-center gap-4 p-4 rounded-xl border-2 border-[var(--color-border)] hover:border-[var(--color-primary)] transition-all group bg-[var(--color-card)]"
              >
                <div className="w-12 h-12 rounded-full bg-[var(--color-bg-sand)] flex items-center justify-center text-[var(--color-dark)] group-hover:bg-[var(--color-primary)] group-hover:text-white transition-colors">
                  <Phone className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-[var(--color-dark)] ${isRTL ? 'text-right' : ''}`}>
                    {isRTL ? 'برقم الهاتف' : 'With Phone Number'}
                  </h3>
                  <p className={`text-xs text-[var(--color-secondary)] mt-1 ${isRTL ? 'text-right' : ''}`}>
                    {isRTL ? 'استرجع حسابك برقم هاتفك بسهولة' : 'Restore with your phone number easily'}
                  </p>
                </div>
                {isRTL ? <ChevronRight className="w-5 h-5 text-[var(--color-secondary)] rotate-180" /> : <ChevronRight className="w-5 h-5 text-[var(--color-secondary)]" />}
              </button>

              <div className="mt-8 pt-4 border-t border-[var(--color-border)]">
                 <button 
                   onClick={() => { onClose(); navigate('/restore'); }}
                   className="w-full text-center text-sm font-bold text-[var(--color-primary)] hover:underline"
                 >
                   {isRTL ? 'هل لديك رمز استرجاع مُسبقاً؟ الاسترجاع من هنا.' : 'Already have a backup code? Restore here.'}
                 </button>
              </div>
            </div>
          )}

          {step === 'code' && (
            <div className="space-y-6">
              <button onClick={() => setStep('select')} className="flex items-center gap-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-dark)]">
                <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                {isRTL ? 'عودة' : 'Back'}
              </button>
              
              <div className="text-center p-6 bg-[var(--color-bg-sand)] rounded-2xl border border-[var(--color-border)] relative">
                 <p className="text-sm text-[var(--color-secondary)] mb-4 font-bold">
                   {isRTL ? 'انسخ هذا الرمز واحتفظ به في مكان آمن:' : 'Copy this code and keep it safe:'}
                 </p>
                 <div className="text-3xl font-mono font-bold text-[var(--color-primary)] tracking-wider">
                   {code}
                 </div>
                 <button 
                   onClick={copyToClipboard}
                   className="mt-6 mx-auto flex items-center justify-center gap-2 bg-[var(--color-card)] border border-[var(--color-border)] px-4 py-2 rounded-lg text-sm font-bold text-[var(--color-dark)] hover:bg-[var(--color-primary)] hover:text-white transition-colors"
                 >
                   {isCopied ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                   {isCopied ? (isRTL ? 'تم النسخ' : 'Copied') : (isRTL ? 'نسخ الرمز' : 'Copy Code')}
                 </button>
              </div>

              <button onClick={onClose} className="w-full py-3 bg-[var(--color-dark)] text-white font-bold rounded-xl hover:bg-black transition-colors">
                {isRTL ? 'فهمت، أغلق النافذة' : 'Got it, close window'}
              </button>
            </div>
          )}

          {step === 'phone' && (
             <div className="space-y-6">
               <button onClick={() => setStep('select')} className="flex items-center gap-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-dark)]">
                 <ArrowLeft className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                 {isRTL ? 'عودة' : 'Back'}
               </button>

               <div>
                 <label className="block text-sm font-bold text-[var(--color-secondary)] mb-2">
                   {isRTL ? 'رقم الهاتف' : 'Phone Number'}
                 </label>
                 <input 
                   type="tel" 
                   value={phone}
                   onChange={(e) => setPhone(e.target.value)}
                   placeholder="0550... / 0660... / 0770..."
                   className={`w-full border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl px-4 py-3 focus:outline-none transition-colors bg-[var(--color-input-bg)] text-[var(--color-dark)] ${isRTL ? 'text-right' : 'text-left'}`}
                 />
                 <p className="text-xs text-[var(--color-secondary)] mt-2">
                   {isRTL ? 'لن نرسل لك رسائل مزعجة، يُستخدم فقط لاسترجاع الحساب.' : 'We won\'t send spam, only used for account recovery.'}
                 </p>
               </div>

               <button 
                 onClick={handleLinkPhone}
                 disabled={loading || phone.length < 9}
                 className="w-full py-3 bg-[var(--color-dark)] text-white font-bold rounded-xl hover:bg-black transition-colors disabled:opacity-50"
               >
                 {loading ? (isRTL ? 'جاري الحفظ...' : 'Saving...') : (isRTL ? 'حفظ رقم الهاتف' : 'Save Phone Number')}
               </button>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
