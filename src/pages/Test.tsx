import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, CheckCircle2, RotateCcw, Download, Share2, Sparkles, Lightbulb, Target } from 'lucide-react';
import { Link } from 'react-router-dom';
import { questions } from '../data/testQuestions';
import { crafts } from '../data/crafts';
import { useTranslation } from 'react-i18next';
import { useThemeSettings } from '../contexts/ThemeContext';
import { generateAptitudeAnalysis } from '../services/geminiService';
import confetti from 'canvas-confetti';

const ParticleBackground = () => (
  <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none opacity-30">
    {[...Array(20)].map((_, i) => (
      <motion.div
        key={i}
        className="absolute w-1 h-1 bg-[var(--color-primary)] rounded-full"
        initial={{
          x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
          y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1000),
          opacity: Math.random() * 0.5 + 0.1,
        }}
        animate={{
          y: [null, Math.random() * -100],
          opacity: [null, Math.random() * 0.8, 0],
        }}
        transition={{
          duration: Math.random() * 10 + 10,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
    ))}
  </div>
);

export default function TestPlatform() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [topCrafts, setTopCrafts] = useState<any[]>([]);

  const { t, i18n } = useTranslation();
  const { isDarkMode } = useThemeSettings();
  const isRTL = i18n.language === 'ar';

  const steps = [1, 2, 3, 4, 5];
  const maxSteps = steps.length;
  const progress = (currentStep / maxSteps) * 100;

  const currentQuestions = questions.filter(q => q.step === currentStep);

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answer }));
  };

  // Check if all questions in current step are answered
  const isCurrentStepComplete = currentQuestions.every(q => !!answers[q.id]);

  const handleNext = async () => {
    if (currentStep < maxSteps) {
      setCurrentStep(s => s + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      await processResults();
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(s => s - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const processResults = async () => {
    setIsAnalyzing(true);
    setShowResults(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Calculate score
    const scores: Record<string, number> = {};
    questions.forEach(q => {
      const userAns = answers[q.id];
      if (!userAns) return;
      const option = q.options.find((o: any) => o.value === userAns);
      if (option && option.weights) {
        Object.entries(option.weights).forEach(([craftId, weight]) => {
          scores[craftId] = (scores[craftId] || 0) + (weight as number);
        });
      }
    });

    const sortedIds = Object.keys(scores).sort((a, b) => scores[b] - scores[a]);
    const top = sortedIds.slice(0, 3).map(id => {
       const craft = crafts.find(c => c.id === id);
       // Calculate percentage roughly. Maximum theoretical score is 150.
       const percentage = Math.min(100, Math.round((scores[id] / 150) * 100));
       return { craft, score: scores[id], percentage };
    });
    setTopCrafts(top);

    // Save progress
    try {
      const saved = localStorage.getItem('hirfati_progress');
      const currentProgress = saved ? JSON.parse(saved) : {};
      currentProgress.test_result = {
        top_crafts: top.map(t => t.craft?.id),
        date: new Date().toISOString()
      };
      localStorage.setItem('hirfati_progress', JSON.stringify(currentProgress));
    } catch(e) {}

    // Prepare prompt payload for Gemini
    const answersText = questions.map(q => {
      const optionLabel = q.options.find((o: any) => o.value === answers[q.id])?.label || '';
      return `- السؤال: ${q.text}\n  الإجابة: ${optionLabel}`;
    }).join('\n');
    
    const topCraftsText = top.map((t, i) => `${i + 1}. ${t.craft?.nameAR} (${t.percentage}%)`).join('\n');

    try {
      const aiResponseStr = await generateAptitudeAnalysis(answersText, topCraftsText);
      const aiResponse = JSON.parse(aiResponseStr);
      setAnalysisData(aiResponse);
      triggerConfetti();
    } catch (e) {
      console.error(e);
      // Fallback
      setAnalysisData({
        personalAnalysisAR: "أنت شخص يتمتع بقدرات مميزة وتوازن بين الجانب العملي والتنظيمي. إجاباتك تدل على استعدادك لتعلم مهارات جديدة وبناء مسار مهني ناجح.",
        personalAnalysisEN: "You are a person with distinct abilities and a balance between practical and organizational sides. Your answers show your readiness to learn new skills.",
        tipsAR: ["ننصحك بالتسجيل في التكوين المهني قريباً.", "حاول التواصل مع محترفين في مجالك.", "الاستمرارية هي مفتاح النجاح."],
        tipsEN: ["We recommend enrolling in vocational training soon.", "Try to connect with professionals in your field.", "Consistency is the key to success."],
        motivationalPhrasesAR: [
          "الحرفة اللي تحبها تتحول إلى متعة كل يوم. اكتشف شغفك وابدأ دوك!",
          "ما تخافش من البداية. الخطوة الأولى هي أصعب خطوة.",
          "الشباب الجزائري قادر يصنع المعجزات بإيديه."
        ],
        motivationalPhrasesEN: [
          "Crafts are safe and lawful gain. Your hand creates and provides.",
          "Every master started from zero. You can be better than them!",
          "Don't fear the beginning. The first step is the hardest."
        ]
      });
      triggerConfetti();
    } finally {
      setIsAnalyzing(false);
    }
  };

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    (function frame() {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#C67B4B', '#3A7B85', '#6B705C']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#C67B4B', '#3A7B85', '#6B705C']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  };

  if (showResults) {
    return (
      <div className="py-16 px-4 max-w-6xl mx-auto relative min-h-screen">
        {isDarkMode && <ParticleBackground />}

        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
             <div className="relative">
               <div className="w-24 h-24 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"></div>
               <Sparkles className="w-8 h-8 text-[#6BB5C1] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
             </div>
             <div>
               <h1 className="text-3xl font-heading font-bold text-[var(--color-dark)] mb-4 animate-pulse">
                 {isRTL ? 'جاري تحليل إجاباتك...' : 'Analyzing your answers...'}
               </h1>
               <p className="text-[var(--color-secondary)] text-lg max-w-md mx-auto">
                 {isRTL ? 'نحن نقوم الآن بربط إجاباتك مع أفضل المسارات المهنية باستخدام الذكاء الاصطناعي لتخطيط مستقبلك.' : 'We are mapping your answers to the best career paths using AI to plan your future.'}
               </p>
             </div>
          </div>
        ) : (
          <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
            <div className="text-center mb-16 relative z-10">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-2xl mb-8 transform rotate-3">
                 <Target className="w-10 h-10" />
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-bold text-[var(--color-dark)] mb-6">{isRTL ? 'نتيجتك المهنية' : 'Your Career Result'}</h1>
              <p className="text-xl text-[var(--color-secondary)] max-w-2xl mx-auto leading-relaxed">
                {isRTL ? 'لقد قمنا بتحليل ميولك واهتماماتك بدقة. هذا هو المسار الذي ستبدع فيه.' : 'We have carefully analyzed your inclinations. This is where you will shine.'}
              </p>
            </div>

            {/* Top 3 Crafts */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 mb-16">
              {topCrafts.map((result, idx) => {
                if (!result.craft) return null;
                const isTop = idx === 0;
                return (
                  <motion.div 
                    key={result.craft.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.2 }}
                    className={`bg-[var(--color-card)] rounded-[2rem] overflow-hidden flex flex-col ${isTop ? 'shadow-2xl shadow-[var(--color-primary)]/20 border-2 border-[var(--color-primary)] md:-translate-y-4' : 'shadow-lg border border-[var(--color-border)]'}`}
                  >
                    {isTop && (
                       <div className="bg-[var(--color-primary)] text-white text-center py-2.5 font-bold text-sm">
                         {isRTL ? '✨ التوافق المثالي ✨' : '✨ Perfect Match ✨'}
                       </div>
                    )}
                    <div className="h-56 relative bg-[var(--color-input-bg)]">
                       <img src={result.craft.image} loading="lazy" alt={(!isRTL && result.craft.nameEN) ? result.craft.nameEN : result.craft.nameAR} className="w-full h-full object-cover mix-blend-multiply" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                       <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                         <h3 className="text-2xl font-bold font-heading text-white">{(!isRTL && result.craft.nameEN) ? result.craft.nameEN : result.craft.nameAR}</h3>
                       </div>
                    </div>
                    <div className="p-8 flex-grow flex flex-col">
                      <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-bold text-[var(--color-secondary)]">{isRTL ? 'نسبة التوافق' : 'Match Rate'}</span>
                          <span className="text-xl font-bold text-[var(--color-primary)]">{result.percentage}%</span>
                        </div>
                        <div className="h-2.5 w-full bg-[var(--color-border)] rounded-full overflow-hidden">
                          <motion.div 
                            className="h-full bg-[var(--color-primary)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${result.percentage}%` }}
                            transition={{ duration: 1, delay: 0.5 + (idx * 0.2) }}
                          />
                        </div>
                      </div>

                      <p className="text-[var(--color-dark)] text-sm mb-8 leading-relaxed opacity-90 hidden md:block flex-grow">
                        {isRTL ? 'هذه الحرفة تناسبك لأنك أظهرت تفضيلاً لأسلوب العمل والميزات المطابقة لها.' : 'This craft suits you because you showed a preference for its working style and requirements.'}
                      </p>

                      <div className="mt-auto space-y-3">
                        <Link to={`/craft/${result.craft.id}`} className={`block text-center w-full py-4 rounded-xl font-bold transition-all ${isTop ? 'bg-[var(--color-primary)] text-white shadow-lg hover:shadow-xl hover:-translate-y-1' : 'bg-[var(--color-input-bg)] text-[var(--color-primary)] border border-[var(--color-primary)]/30 hover:bg-[var(--color-primary)] hover:text-white'}`}>
                          {isRTL ? 'ابدأ التعلم الآن' : 'Start Learning Now'}
                        </Link>
                        <Link to={`/craft/${result.craft.id}`} className="block text-center w-full py-2 text-sm text-[var(--color-secondary)] hover:text-[var(--color-dark)] transition-colors">
                          {isRTL ? 'تفاصيل الحرفة' : 'Craft Details'}
                        </Link>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {analysisData && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10 mb-16">
                 {/* Personal Analysis */}
                 <div className="lg:col-span-2 bg-[var(--color-card)] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[var(--color-border)] relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-primary)]/5 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2"></div>
                   <h3 className="text-2xl font-bold font-heading text-[var(--color-dark)] mb-6 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[var(--color-primary)]/10 flex items-center justify-center text-[var(--color-primary)]">
                       <CheckCircle2 className="w-6 h-6" />
                     </div>
                     {isRTL ? 'تحليلك الشخصي' : 'Personal Analysis'}
                   </h3>
                   <p className="text-[var(--color-dark)] leading-relaxed text-lg opacity-90">
                     {isRTL ? analysisData.personalAnalysisAR : analysisData.personalAnalysisEN}
                   </p>
                 </div>

                 {/* Career Tips */}
                 <div className="bg-[var(--color-card)] p-8 md:p-10 rounded-[2rem] shadow-sm border border-[var(--color-border)]">
                   <h3 className="text-xl font-bold font-heading text-[var(--color-dark)] mb-6 flex items-center gap-3">
                     <div className="w-10 h-10 rounded-xl bg-[#6BB5C1]/10 flex items-center justify-center text-[#6BB5C1]">
                       <Lightbulb className="w-6 h-6" />
                     </div>
                     {isRTL ? 'نصائح لنجاحك' : 'Tips for Success'}
                   </h3>
                   <ul className="space-y-4">
                     {(isRTL ? analysisData.tipsAR : analysisData.tipsEN)?.map((tip: string, idx: number) => (
                       <li key={idx} className="flex gap-3 text-[var(--color-dark)] text-sm leading-relaxed">
                         <div className="w-2 h-2 rounded-full bg-[#6BB5C1] mt-2 flex-shrink-0"></div>
                         <span>{tip}</span>
                       </li>
                     ))}
                   </ul>
                 </div>
              </div>
            )}

            {/* Motivational Quotes */}
            {analysisData && (
              <div className="bg-[var(--color-primary)] text-white p-8 md:p-12 rounded-[2rem] shadow-xl relative overflow-hidden text-center mb-16">
                 <div className="absolute inset-0 opacity-10 background-pattern"></div>
                 <h3 className="text-2xl md:text-3xl font-heading font-bold mb-8 relative z-10">
                   {isRTL ? 'كلمة من القلب 🇩🇿' : 'Word from the Heart'}
                 </h3>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                   {(isRTL ? analysisData.motivationalPhrasesAR : analysisData.motivationalPhrasesEN)?.map((phrase: string, idx: number) => (
                     <div key={idx} className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                       <p className="font-bold leading-relaxed">{phrase}</p>
                     </div>
                   ))}
                 </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 relative z-10">
               <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-card)] border-2 border-[var(--color-border)] text-[var(--color-dark)] rounded-xl font-bold hover:bg-[var(--color-bg-sand)] transition-all">
                 <Share2 className="w-5 h-5" />
                 {isRTL ? 'شارك نتيجتك' : 'Share Result'}
               </button>
               <button className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-[var(--color-card)] border-2 border-[var(--color-border)] text-[var(--color-dark)] rounded-xl font-bold hover:bg-[var(--color-bg-sand)] transition-all">
                 <Download className="w-5 h-5" />
                 {isRTL ? 'حمل التقرير' : 'Download Report'}
               </button>
               <button onClick={() => { setShowResults(false); setCurrentStep(1); setAnswers({}); setAnalysisData(null); }} className="w-full md:w-auto flex items-center justify-center gap-2 px-8 py-4 text-[var(--color-secondary)] hover:text-[var(--color-primary)] font-bold transition-all">
                 <RotateCcw className="w-5 h-5" />
                 {isRTL ? 'إعادة الاختبار' : 'Retake Test'}
               </button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Question Form rendering
  return (
    <div className="min-h-[80vh] bg-[var(--color-bg-sand)] flex flex-col pt-12 pb-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {isDarkMode && <ParticleBackground />}
      <div className="max-w-3xl mx-auto w-full relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        <div className="text-center mb-10">
          <h1 className="text-3xl font-heading font-bold text-[var(--color-dark)]">{isRTL ? 'اختبار الميول المهنية' : 'Career Aptitude Test'}</h1>
          <p className="text-[var(--color-secondary)] mt-2">{isRTL ? 'أجب بصدق لنوجهك نحو المسار الصحيح' : 'Answer honestly to be guided to the right path'}</p>
        </div>

        {/* Progress bar */}
        <div className="mb-10 bg-[var(--color-card)] p-6 rounded-[2rem] shadow-sm border border-[var(--color-border)]">
           <div className="flex justify-between text-sm text-[var(--color-secondary)] mb-3 font-bold px-2">
             <span>{isRTL ? 'المرحلة' : 'Step'} {currentStep} {isRTL ? 'من' : 'of'} {maxSteps}</span>
             <span className="text-[var(--color-primary)]">{Math.round(progress)}%</span>
           </div>
           <div className="h-3 w-full bg-[var(--color-input-bg)] rounded-full overflow-hidden border border-[var(--color-border)]">
             <motion.div 
               className="h-full bg-[var(--color-primary)]"
               initial={{ width: 0 }}
               animate={{ width: `${progress}%` }}
               transition={{ duration: 0.5, ease: "easeOut" }}
             />
           </div>
        </div>

        {/* Step Questions */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              className="space-y-8"
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: isRTL ? 20 : -20 }}
              transition={{ duration: 0.3 }}
            >
               {currentQuestions.map((q, idx) => {
                 let categoryName = '';
                 if (q.category === 'nature') categoryName = isRTL ? 'طبيعة العمل المفضلة' : 'Preferred Work Nature';
                 else if (q.category === 'abilities') categoryName = isRTL ? 'القدرات والمهارات' : 'Skills & Abilities';
                 else if (q.category === 'environment') categoryName = isRTL ? 'بيئة العمل والظروف' : 'Work Environment';
                 else if (q.category === 'interests') categoryName = isRTL ? 'الاهتمامات والتجارب' : 'Interests & Experiences';
                 else if (q.category === 'qualifications') categoryName = isRTL ? 'المؤهلات والطموحات' : 'Qualifications & Ambitions';

                 return (
                   <div key={q.id} className="bg-[var(--color-card)] rounded-[2.5rem] p-8 md:p-10 shadow-sm border border-[var(--color-border)] relative overflow-hidden">
                     {idx === 0 && (
                       <div className="inline-block px-5 py-2 bg-[var(--color-primary)]/10 text-[var(--color-primary)] rounded-full text-sm font-bold mb-8 tracking-wide">
                         {categoryName}
                       </div>
                     )}
                     <h2 className="text-xl md:text-2xl font-heading font-bold text-[var(--color-dark)] mb-8 leading-relaxed relative z-10">
                       {q.text}
                     </h2>

                     <div className="space-y-3 relative z-10">
                       {q.options?.map((opt: any) => {
                         const isSelected = answers[q.id] === opt.value;
                         return (
                           <button
                             key={opt.value}
                             onClick={() => handleAnswer(q.id, opt.value)}
                             className={`w-full ${isRTL ? 'text-right outline-none' : 'text-left outline-none'} p-5 rounded-2xl border-2 transition-all flex items-center gap-4 group ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 shadow-md shadow-[var(--color-primary)]/10' : 'border-[var(--color-border)] bg-[var(--color-input-bg)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-bg-sand)]'}`}
                           >
                             <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-colors flex-shrink-0 ${isSelected ? 'border-[var(--color-primary)] bg-[var(--color-primary)]' : 'border-[var(--color-border)] group-hover:border-[var(--color-primary)]/50'}`}>
                               {isSelected && <div className="w-2 h-2 bg-white flex-shrink-0 rounded-full animate-in zoom-in duration-200"></div>}
                             </div>
                             <span className={`text-lg transition-colors ${isSelected ? 'text-[var(--color-primary)] font-bold' : 'text-[var(--color-dark)] font-medium group-hover:text-[var(--color-primary)]'}`}>{opt.label}</span>
                           </button>
                         )
                       })}
                     </div>
                   </div>
                 )
               })}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Controls */}
        <div className="flex justify-between items-center mt-10">
          <button
             onClick={handlePrev}
             disabled={currentStep === 1}
             className={`flex items-center gap-2 font-bold px-8 py-4 rounded-2xl transition-all ${currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-secondary)] hover:bg-[var(--color-input-bg)] hover:text-[var(--color-dark)] hover:shadow-md'}`}
          >
            {isRTL ? <ArrowRight className="w-5 h-5" /> : <ArrowLeft className="w-5 h-5" />}
            {isRTL ? 'السابق' : 'Previous'}
          </button>
          <button
             onClick={handleNext}
             disabled={!isCurrentStepComplete}
             className={`flex items-center gap-3 px-10 py-4 rounded-2xl font-bold transition-all group ${isCurrentStepComplete ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white shadow-xl shadow-[var(--color-primary)]/20 hover:-translate-y-1' : 'bg-[var(--color-card)] border border-[var(--color-border)] text-[var(--color-secondary)] cursor-not-allowed opacity-50'}`}
          >
            {currentStep === maxSteps ? (isRTL ? 'إظهار نتيجتي' : 'Show Result') : (isRTL ? 'التالي' : 'Next')}
            {isRTL ? <ArrowLeft className={`w-5 h-5 ${isCurrentStepComplete ? 'group-hover:-translate-x-1' : ''} transition-transform`} /> : <ArrowRight className={`w-5 h-5 ${isCurrentStepComplete ? 'group-hover:translate-x-1' : ''} transition-transform`} />}
          </button>
        </div>
      </div>
    </div>
  );
}
