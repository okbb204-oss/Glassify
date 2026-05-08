import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Shield, Key, Phone, ArrowLeft, AlertCircle } from 'lucide-react';

export default function Restore() {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';
  const { guestRestore } = useAuth();
  const navigate = useNavigate();

  const [method, setMethod] = useState<'code' | 'phone'>('code');
  const [code, setCode] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleRestore = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (method === 'code') {
        if (!code) throw new Error(isRTL ? 'يرجى إدخال رمز الاسترجاع' : 'Please enter backup code');
        await guestRestore(code, undefined);
      } else {
        if (!phone) throw new Error(isRTL ? 'يرجى إدخال رقم الهاتف' : 'Please enter phone number');
        // Simulated OTP step
        await guestRestore(undefined, phone);
      }
      navigate('/learn');
    } catch (err: any) {
      setError(err.message || 'Error restoring account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--color-bg-sand)]">
      <div className="max-w-md w-full">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[var(--color-secondary)] hover:text-[var(--color-dark)] mb-8 transition-colors"
        >
          <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
          <span className="font-bold">{isRTL ? 'عودة' : 'Back'}</span>
        </button>

        <div className="bg-[var(--color-navbar-bg)] rounded-3xl shadow-sm border border-[var(--color-border)] p-8">
           <div className="text-center mb-8">
             <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Shield className="w-8 h-8" />
             </div>
             <h2 className="text-3xl font-heading font-bold text-[var(--color-dark)] mb-2">
               {isRTL ? 'استرجاع تقدمك' : 'Restore Progress'}
             </h2>
             <p className="text-[var(--color-secondary)]">
               {isRTL ? 'أدخل معلومات حسابك لاستعادة ما تعلمته' : 'Enter your account details to restore what you learned'}
             </p>
           </div>

           <div className="flex bg-[var(--color-bg-sand)] p-1 rounded-xl mb-8">
             <button
               onClick={() => setMethod('code')}
               className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${method === 'code' ? 'bg-[var(--color-navbar-bg)] text-[var(--color-dark)] shadow-sm' : 'text-[var(--color-secondary)] hover:text-[var(--color-dark)]'}`}
             >
               <Key className="w-4 h-4" />
               {isRTL ? 'رمز الاسترجاع' : 'Backup Code'}
             </button>
             <button
               onClick={() => setMethod('phone')}
               className={`flex-1 py-2 text-sm font-bold rounded-lg flex items-center justify-center gap-2 transition-colors ${method === 'phone' ? 'bg-[var(--color-navbar-bg)] text-[var(--color-dark)] shadow-sm' : 'text-[var(--color-secondary)] hover:text-[var(--color-dark)]'}`}
             >
               <Phone className="w-4 h-4" />
               {isRTL ? 'رقم الهاتف' : 'Phone'}
             </button>
           </div>

           {error && (
             <div className="mb-6 p-4 bg-red-50 text-[var(--color-danger)] font-medium text-sm rounded-xl flex items-start gap-3 border border-red-100">
               <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
               <p>{error}</p>
             </div>
           )}

           <form onSubmit={handleRestore} className="space-y-6">
              {method === 'code' ? (
                <div>
                  <label className="block text-sm font-bold text-[var(--color-secondary)] mb-2">
                    {isRTL ? 'الرمز السري (مثال: HIRFA-ABCD)' : 'Secret Code (e.g. HIRFA-ABCD)'}
                  </label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="HIRFA-XXXX"
                    className={`w-full border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl px-4 py-3 focus:outline-none transition-colors bg-[var(--color-input-bg)] text-[var(--color-dark)] font-mono tracking-widest text-center uppercase`}
                    dir="ltr"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-bold text-[var(--color-secondary)] mb-2">
                    {isRTL ? 'رقم الهاتف المربوط' : 'Linked Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0550..."
                    className={`w-full border-2 border-[var(--color-border)] focus:border-[var(--color-primary)] rounded-xl px-4 py-3 focus:outline-none transition-colors bg-[var(--color-input-bg)] text-[var(--color-dark)] ${isRTL ? 'text-right' : 'text-left'}`}
                  />
                  <p className="text-xs text-[var(--color-secondary)] mt-2">
                    {isRTL ? 'سنقوم بإرسال رمز OTP للتأكد من هويتك (محاكاة).' : 'We will send an OTP to verify your identity (simulated).'}
                  </p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading || (method === 'code' ? !code : !phone)}
                className="w-full py-4 bg-[var(--color-primary)] text-white font-bold rounded-xl hover:bg-[#006666] transition-colors disabled:opacity-50"
              >
                {loading ? (isRTL ? 'جاري الاسترجاع...' : 'Restoring...') : (isRTL ? 'استرجاع التقدم' : 'Restore Progress')}
              </button>
           </form>
        </div>
      </div>
    </div>
  );
}
