export interface Question {
  id: string;
  category: 'nature' | 'abilities' | 'environment' | 'interests' | 'qualifications';
  step: number; 
  text: string;
  options: { value: string; label: string; weights: Record<string, number> }[];
}

export const questions: Question[] = [
  // المحور الأول: طبيعة العمل المفضلة
  {
    id: 'q1', category: 'nature', step: 1, text: 'أي نوع من العمل تستمتع به أكثر؟',
    options: [
      { value: 'a', label: 'العمل بيدي في ورشة أو موقع بناء', weights: {"data_entry":0,"alu_pvc_joinery":10,"hair_styling":6,"mens_barbering":8,"sanitary_plumbing":10,"security_agent":3,"ms_access":0,"storekeeper":2,"accounting":0,"autoelectrician":9,"welding":10,"it_technician":5,"construction":10,"collective_cooking":6} },
      { value: 'b', label: 'العمل على الحاسوب وتنظيم البيانات', weights: {"data_entry":10,"alu_pvc_joinery":2,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":2,"security_agent":5,"ms_access":10,"storekeeper":10,"accounting":10,"autoelectrician":3,"welding":1,"it_technician":8,"construction":2,"collective_cooking":3} },
      { value: 'c', label: 'التواصل مع الناس وتقديم الخدمات', weights: {"data_entry":5,"alu_pvc_joinery":4,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":5,"security_agent":10,"ms_access":3,"storekeeper":5,"accounting":5,"autoelectrician":5,"welding":2,"it_technician":5,"construction":3,"collective_cooking":10} },
      { value: 'd', label: 'حل المشكلات التقنية والتفكير المنطقي', weights: {"data_entry":6,"alu_pvc_joinery":6,"hair_styling":4,"mens_barbering":3,"sanitary_plumbing":7,"security_agent":6,"ms_access":8,"storekeeper":6,"accounting":7,"autoelectrician":10,"welding":8,"it_technician":9,"construction":6,"collective_cooking":4} }
    ]
  },
  {
    id: 'q2', category: 'nature', step: 1, text: 'أين تفضل أن تقضي يوم عملك؟',
    options: [
      { value: 'a', label: 'في الهواء الطلق أو موقع بناء', weights: {"data_entry":0,"alu_pvc_joinery":7,"hair_styling":1,"mens_barbering":1,"sanitary_plumbing":9,"security_agent":8,"ms_access":0,"storekeeper":3,"accounting":0,"autoelectrician":5,"welding":8,"it_technician":2,"construction":10,"collective_cooking":0} },
      { value: 'b', label: 'في مكتب أو إدارة', weights: {"data_entry":10,"alu_pvc_joinery":1,"hair_styling":1,"mens_barbering":1,"sanitary_plumbing":1,"security_agent":6,"ms_access":10,"storekeeper":8,"accounting":10,"autoelectrician":1,"welding":1,"it_technician":7,"construction":1,"collective_cooking":1} },
      { value: 'c', label: 'في محل أو صالون أو مطبخ', weights: {"data_entry":2,"alu_pvc_joinery":3,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":2,"security_agent":4,"ms_access":2,"storekeeper":7,"accounting":1,"autoelectrician":2,"welding":1,"it_technician":1,"construction":1,"collective_cooking":10} },
      { value: 'd', label: 'في ورشة أو مرآب', weights: {"data_entry":1,"alu_pvc_joinery":10,"hair_styling":4,"mens_barbering":4,"sanitary_plumbing":8,"security_agent":2,"ms_access":1,"storekeeper":6,"accounting":1,"autoelectrician":10,"welding":10,"it_technician":6,"construction":6,"collective_cooking":4} }
    ]
  },
  {
    id: 'q3', category: 'nature', step: 1, text: 'ما الذي يحفزك أكثر في العمل؟',
    options: [
      { value: 'a', label: 'رؤية نتيجة ملموسة أمامي (بناء، منتج، طبق)', weights: {"data_entry":2,"alu_pvc_joinery":10,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":9,"security_agent":2,"ms_access":2,"storekeeper":3,"accounting":2,"autoelectrician":7,"welding":10,"it_technician":3,"construction":10,"collective_cooking":10} },
      { value: 'b', label: 'تنظيم الأشياء وجعلها تعمل بكفاءة', weights: {"data_entry":10,"alu_pvc_joinery":5,"hair_styling":3,"mens_barbering":4,"sanitary_plumbing":6,"security_agent":6,"ms_access":10,"storekeeper":10,"accounting":10,"autoelectrician":6,"welding":5,"it_technician":8,"construction":5,"collective_cooking":6} },
      { value: 'c', label: 'مساعدة الآخرين وجعلهم يشعرون بتحسن', weights: {"data_entry":4,"alu_pvc_joinery":2,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":6,"security_agent":10,"ms_access":3,"storekeeper":5,"accounting":4,"autoelectrician":4,"welding":2,"it_technician":4,"construction":3,"collective_cooking":9} },
      { value: 'd', label: 'اكتشاف المشكلات التقنية وإصلاحها', weights: {"data_entry":6,"alu_pvc_joinery":6,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":8,"security_agent":3,"ms_access":8,"storekeeper":3,"accounting":5,"autoelectrician":10,"welding":7,"it_technician":10,"construction":4,"collective_cooking":2} }
    ]
  },
  // المحور الثاني: القدرات والمهارات
  {
    id: 'q4', category: 'abilities', step: 2, text: 'كيف تقيم قدرتك على العمل الدقيق المتكرر؟',
    options: [
      { value: 'a', label: 'ممتازة – الصبر والدقة من صفاتي', weights: {"data_entry":10,"alu_pvc_joinery":8,"hair_styling":7,"mens_barbering":8,"sanitary_plumbing":6,"security_agent":3,"ms_access":10,"storekeeper":8,"accounting":10,"autoelectrician":7,"welding":9,"it_technician":9,"construction":6,"collective_cooking":6} },
      { value: 'b', label: 'جيدة – أستطيع التركيز لكني أفضل التنويع', weights: {"data_entry":6,"alu_pvc_joinery":7,"hair_styling":9,"mens_barbering":9,"sanitary_plumbing":8,"security_agent":6,"ms_access":7,"storekeeper":7,"accounting":7,"autoelectrician":8,"welding":7,"it_technician":8,"construction":8,"collective_cooking":8} },
      { value: 'c', label: 'متوسطة – أفضل المهام التي تتطلب حركة وتفاعلاً', weights: {"data_entry":2,"alu_pvc_joinery":6,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":9,"security_agent":10,"ms_access":3,"storekeeper":6,"accounting":3,"autoelectrician":8,"welding":6,"it_technician":5,"construction":9,"collective_cooking":9} },
      { value: 'd', label: 'أحتاج إلى عمل متغير باستمرار', weights: {"data_entry":1,"alu_pvc_joinery":4,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":8,"security_agent":8,"ms_access":2,"storekeeper":5,"accounting":2,"autoelectrician":9,"welding":4,"it_technician":6,"construction":8,"collective_cooking":7} }
    ]
  },
  {
    id: 'q5', category: 'abilities', step: 2, text: 'كيف تتعامل مع الأدوات والآلات؟',
    options: [
      { value: 'a', label: 'لدي شغف بفهمها وإصلاحها واستخدامها', weights: {"data_entry":1,"alu_pvc_joinery":9,"hair_styling":4,"mens_barbering":6,"sanitary_plumbing":9,"security_agent":2,"ms_access":1,"storekeeper":4,"accounting":1,"autoelectrician":10,"welding":10,"it_technician":9,"construction":8,"collective_cooking":6} },
      { value: 'b', label: 'أستخدم الحاسوب والبرامج بمهارة عالية', weights: {"data_entry":10,"alu_pvc_joinery":2,"hair_styling":1,"mens_barbering":1,"sanitary_plumbing":2,"security_agent":3,"ms_access":10,"storekeeper":9,"accounting":10,"autoelectrician":3,"welding":1,"it_technician":10,"construction":1,"collective_cooking":1} },
      { value: 'c', label: 'أفضل الأدوات اليدوية البسيطة', weights: {"data_entry":5,"alu_pvc_joinery":7,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":7,"security_agent":6,"ms_access":4,"storekeeper":6,"accounting":5,"autoelectrician":4,"welding":6,"it_technician":3,"construction":7,"collective_cooking":10} },
      { value: 'd', label: 'لست مرتاحاً مع الآلات المعقدة', weights: {"data_entry":8,"alu_pvc_joinery":3,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":3,"security_agent":9,"ms_access":8,"storekeeper":8,"accounting":8,"autoelectrician":1,"welding":2,"it_technician":4,"construction":3,"collective_cooking":8} }
    ]
  },
  {
    id: 'q6', category: 'abilities', step: 2, text: 'ما هو مستواك في حل المشكلات تحت الضغط؟',
    options: [
      { value: 'a', label: 'أزدهر تحت الضغط وأجد حلولاً سريعة', weights: {"data_entry":4,"alu_pvc_joinery":7,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":9,"security_agent":10,"ms_access":5,"storekeeper":8,"accounting":5,"autoelectrician":9,"welding":8,"it_technician":9,"construction":9,"collective_cooking":10} },
      { value: 'b', label: 'أتعامل بهدوء وتخطيط مسبق', weights: {"data_entry":10,"alu_pvc_joinery":8,"hair_styling":7,"mens_barbering":7,"sanitary_plumbing":8,"security_agent":8,"ms_access":10,"storekeeper":10,"accounting":10,"autoelectrician":9,"welding":9,"it_technician":10,"construction":8,"collective_cooking":7} },
      { value: 'c', label: 'أفضل العمل في بيئة هادئة بدون ضغوط', weights: {"data_entry":8,"alu_pvc_joinery":6,"hair_styling":5,"mens_barbering":5,"sanitary_plumbing":4,"security_agent":2,"ms_access":7,"storekeeper":5,"accounting":8,"autoelectrician":4,"welding":5,"it_technician":5,"construction":4,"collective_cooking":4} },
      { value: 'd', label: 'أحتاج إلى توجيه من خبير عند المواقف الصعبة', weights: {"data_entry":7,"alu_pvc_joinery":6,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":6,"security_agent":4,"ms_access":6,"storekeeper":6,"accounting":6,"autoelectrician":5,"welding":6,"it_technician":6,"construction":7,"collective_cooking":6} }
    ]
  },
  // المحور الثالث: بيئة العمل والظروف الشخصية
  {
    id: 'q7', category: 'environment', step: 3, text: 'ما هي وضعية العمل التي تناسبك جسدياً؟',
    options: [
      { value: 'a', label: 'العمل واقفاً أو متنقلاً معظم الوقت', weights: {"data_entry":0,"alu_pvc_joinery":8,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":10,"security_agent":10,"ms_access":0,"storekeeper":8,"accounting":0,"autoelectrician":8,"welding":9,"it_technician":2,"construction":10,"collective_cooking":10} },
      { value: 'b', label: 'العمل جالساً على مكتب', weights: {"data_entry":10,"alu_pvc_joinery":1,"hair_styling":1,"mens_barbering":1,"sanitary_plumbing":1,"security_agent":3,"ms_access":10,"storekeeper":4,"accounting":10,"autoelectrician":1,"welding":1,"it_technician":9,"construction":1,"collective_cooking":1} },
      { value: 'c', label: 'مزيج بين الوقوف والجلوس', weights: {"data_entry":6,"alu_pvc_joinery":9,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":7,"security_agent":8,"ms_access":6,"storekeeper":9,"accounting":6,"autoelectrician":9,"welding":7,"it_technician":8,"construction":7,"collective_cooking":6} },
      { value: 'd', label: 'لا أفضل العمل في وضعية ثابتة', weights: {"data_entry":2,"alu_pvc_joinery":8,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":10,"security_agent":10,"ms_access":2,"storekeeper":6,"accounting":2,"autoelectrician":9,"welding":8,"it_technician":4,"construction":10,"collective_cooking":9} }
    ]
  },
  {
    id: 'q8', category: 'environment', step: 3, text: 'هل أنت مستعد للعمل في عطل نهاية الأسبوع أو في المساء؟',
    options: [
      { value: 'a', label: 'نعم، لا مشكلة لدي', weights: {"data_entry":3,"alu_pvc_joinery":8,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":9,"security_agent":10,"ms_access":4,"storekeeper":7,"accounting":4,"autoelectrician":9,"welding":8,"it_technician":8,"construction":9,"collective_cooking":10} },
      { value: 'b', label: 'نعم، لكن بشكل محدود', weights: {"data_entry":7,"alu_pvc_joinery":7,"hair_styling":7,"mens_barbering":7,"sanitary_plumbing":7,"security_agent":7,"ms_access":7,"storekeeper":8,"accounting":7,"autoelectrician":7,"welding":7,"it_technician":7,"construction":7,"collective_cooking":8} },
      { value: 'c', label: 'أفضل أوقات العمل العادية', weights: {"data_entry":10,"alu_pvc_joinery":8,"hair_styling":4,"mens_barbering":4,"sanitary_plumbing":6,"security_agent":3,"ms_access":10,"storekeeper":9,"accounting":10,"autoelectrician":6,"welding":8,"it_technician":8,"construction":7,"collective_cooking":4} },
      { value: 'd', label: 'غير مستعد تماماً', weights: {"data_entry":9,"alu_pvc_joinery":5,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":4,"security_agent":1,"ms_access":9,"storekeeper":7,"accounting":9,"autoelectrician":4,"welding":5,"it_technician":6,"construction":4,"collective_cooking":2} }
    ]
  },
  {
    id: 'q9', category: 'environment', step: 3, text: 'هل لديك مساحة في منزلك يمكن تحويلها إلى ورشة صغيرة؟',
    options: [
      { value: 'a', label: 'نعم، لدي مساحة كافية', weights: {"data_entry":6,"alu_pvc_joinery":8,"hair_styling":8,"mens_barbering":7,"sanitary_plumbing":6,"security_agent":1,"ms_access":5,"storekeeper":4,"accounting":4,"autoelectrician":6,"welding":8,"it_technician":8,"construction":3,"collective_cooking":8} },
      { value: 'b', label: 'يمكنني ترتيب مساحة صغيرة', weights: {"data_entry":8,"alu_pvc_joinery":5,"hair_styling":8,"mens_barbering":7,"sanitary_plumbing":4,"security_agent":2,"ms_access":7,"storekeeper":4,"accounting":6,"autoelectrician":4,"welding":4,"it_technician":9,"construction":2,"collective_cooking":6} },
      { value: 'c', label: 'لا، لكن يمكنني العمل خارج المنزل', weights: {"data_entry":3,"alu_pvc_joinery":10,"hair_styling":7,"mens_barbering":8,"sanitary_plumbing":10,"security_agent":10,"ms_access":3,"storekeeper":9,"accounting":3,"autoelectrician":10,"welding":10,"it_technician":4,"construction":10,"collective_cooking":9} },
      { value: 'd', label: 'لا أملك أي مساحة', weights: {"data_entry":10,"alu_pvc_joinery":4,"hair_styling":6,"mens_barbering":7,"sanitary_plumbing":7,"security_agent":8,"ms_access":10,"storekeeper":8,"accounting":10,"autoelectrician":7,"welding":6,"it_technician":6,"construction":8,"collective_cooking":7} }
    ]
  },
  // المحور الرابع: الاهتمامات والتجارب السابقة
  {
    id: 'q10', category: 'interests', step: 4, text: 'أي من هذه الأنشطة مارستها أو تستمتع بها؟',
    options: [
      { value: 'a', label: 'إصلاح أشياء في المنزل، تفكيك وتركيب الأدوات', weights: {"data_entry":1,"alu_pvc_joinery":9,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":9,"security_agent":2,"ms_access":2,"storekeeper":4,"accounting":1,"autoelectrician":10,"welding":9,"it_technician":8,"construction":8,"collective_cooking":2} },
      { value: 'b', label: 'تنظيم الملفات، العمل على Excel، التصميم', weights: {"data_entry":10,"alu_pvc_joinery":2,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":1,"security_agent":4,"ms_access":10,"storekeeper":10,"accounting":10,"autoelectrician":2,"welding":1,"it_technician":10,"construction":1,"collective_cooking":1} },
      { value: 'c', label: 'الطبخ، التزيين، العناية بالمظهر', weights: {"data_entry":2,"alu_pvc_joinery":2,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":2,"security_agent":2,"ms_access":2,"storekeeper":3,"accounting":2,"autoelectrician":1,"welding":2,"it_technician":2,"construction":1,"collective_cooking":10} },
      { value: 'd', label: 'مساعدة الآخرين في حل مشكلاتهم', weights: {"data_entry":4,"alu_pvc_joinery":2,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":6,"security_agent":10,"ms_access":4,"storekeeper":5,"accounting":5,"autoelectrician":5,"welding":3,"it_technician":6,"construction":4,"collective_cooking":7} }
    ]
  },
  {
    id: 'q11', category: 'interests', step: 4, text: 'أي نوع من المشاريع الصغيرة تحلم بإطلاقه؟',
    options: [
      { value: 'a', label: 'ورشة بناء أو تصليح أو تركيب', weights: {"data_entry":1,"alu_pvc_joinery":10,"hair_styling":3,"mens_barbering":3,"sanitary_plumbing":10,"security_agent":2,"ms_access":1,"storekeeper":4,"accounting":1,"autoelectrician":10,"welding":10,"it_technician":4,"construction":10,"collective_cooking":2} },
      { value: 'b', label: 'مكتب خدمات إدارية أو رقمية', weights: {"data_entry":10,"alu_pvc_joinery":2,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":2,"security_agent":3,"ms_access":10,"storekeeper":7,"accounting":10,"autoelectrician":2,"welding":2,"it_technician":10,"construction":2,"collective_cooking":2} },
      { value: 'c', label: 'صالون تجميل أو مطعم أو مخبزة', weights: {"data_entry":2,"alu_pvc_joinery":2,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":2,"security_agent":2,"ms_access":2,"storekeeper":3,"accounting":2,"autoelectrician":1,"welding":2,"it_technician":2,"construction":2,"collective_cooking":10} },
      { value: 'd', label: 'متجر إلكتروني أو شركة خدمات', weights: {"data_entry":7,"alu_pvc_joinery":6,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":5,"security_agent":8,"ms_access":8,"storekeeper":10,"accounting":8,"autoelectrician":4,"welding":5,"it_technician":8,"construction":6,"collective_cooking":6} }
    ]
  },
  {
    id: 'q12', category: 'interests', step: 4, text: 'عندما تشاهد محتوى على يوتيوب أو فيسبوك، ما الذي يجذبك أكثر؟',
    options: [
      { value: 'a', label: 'فيديوهات بناء، تصليح، اختراعات يدوية', weights: {"data_entry":1,"alu_pvc_joinery":10,"hair_styling":2,"mens_barbering":2,"sanitary_plumbing":10,"security_agent":2,"ms_access":1,"storekeeper":3,"accounting":1,"autoelectrician":10,"welding":10,"it_technician":4,"construction":10,"collective_cooking":2} },
      { value: 'b', label: 'شروحات تقنية، برامج، تحليل بيانات', weights: {"data_entry":10,"alu_pvc_joinery":2,"hair_styling":1,"mens_barbering":1,"sanitary_plumbing":2,"security_agent":2,"ms_access":10,"storekeeper":8,"accounting":10,"autoelectrician":3,"welding":2,"it_technician":10,"construction":2,"collective_cooking":1} },
      { value: 'c', label: 'فنون الطهي، التجميل، الحرف التقليدية', weights: {"data_entry":2,"alu_pvc_joinery":2,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":1,"security_agent":1,"ms_access":1,"storekeeper":2,"accounting":1,"autoelectrician":1,"welding":1,"it_technician":1,"construction":1,"collective_cooking":10} },
      { value: 'd', label: 'قصص نجاح رواد أعمال ومشاريع', weights: {"data_entry":6,"alu_pvc_joinery":6,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":6,"security_agent":7,"ms_access":7,"storekeeper":9,"accounting":8,"autoelectrician":6,"welding":6,"it_technician":6,"construction":6,"collective_cooking":7} }
    ]
  },
  // المحور الخامس: المؤهلات والطموحات
  {
    id: 'q13', category: 'qualifications', step: 5, text: 'ما هو أعلى مستوى دراسي أكملته؟',
    options: [
      { value: 'a', label: 'أقل من المتوسط', weights: {"data_entry":3,"alu_pvc_joinery":10,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":10,"security_agent":8,"ms_access":1,"storekeeper":7,"accounting":1,"autoelectrician":8,"welding":10,"it_technician":2,"construction":10,"collective_cooking":10} },
      { value: 'b', label: 'شهادة التعليم المتوسط (BEM)', weights: {"data_entry":6,"alu_pvc_joinery":8,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":8,"security_agent":9,"ms_access":5,"storekeeper":8,"accounting":4,"autoelectrician":9,"welding":8,"it_technician":6,"construction":8,"collective_cooking":8} },
      { value: 'c', label: 'شهادة البكالوريا', weights: {"data_entry":9,"alu_pvc_joinery":6,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":6,"security_agent":8,"ms_access":9,"storekeeper":8,"accounting":8,"autoelectrician":8,"welding":6,"it_technician":9,"construction":6,"collective_cooking":7} },
      { value: 'd', label: 'شهادة جامعية', weights: {"data_entry":10,"alu_pvc_joinery":4,"hair_styling":4,"mens_barbering":4,"sanitary_plumbing":4,"security_agent":6,"ms_access":10,"storekeeper":8,"accounting":10,"autoelectrician":6,"welding":4,"it_technician":10,"construction":4,"collective_cooking":5} }
    ]
  },
  {
    id: 'q14', category: 'qualifications', step: 5, text: 'ما هو طموحك المهني خلال 5 سنوات؟',
    options: [
      { value: 'a', label: 'أن أصبح حرفياً ماهراً وأفتح ورشتي الخاصة', weights: {"data_entry":1,"alu_pvc_joinery":10,"hair_styling":10,"mens_barbering":10,"sanitary_plumbing":10,"security_agent":2,"ms_access":1,"storekeeper":4,"accounting":2,"autoelectrician":10,"welding":10,"it_technician":3,"construction":10,"collective_cooking":10} },
      { value: 'b', label: 'أن أصبح خبيراً تقنياً أو إدارياً معتمداً', weights: {"data_entry":10,"alu_pvc_joinery":3,"hair_styling":3,"mens_barbering":3,"sanitary_plumbing":4,"security_agent":8,"ms_access":10,"storekeeper":8,"accounting":10,"autoelectrician":6,"welding":4,"it_technician":10,"construction":4,"collective_cooking":4} },
      { value: 'c', label: 'أن أدير فريقاً أو مشروعاً خاصاً بي', weights: {"data_entry":8,"alu_pvc_joinery":8,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":8,"security_agent":8,"ms_access":8,"storekeeper":9,"accounting":9,"autoelectrician":7,"welding":8,"it_technician":8,"construction":9,"collective_cooking":8} },
      { value: 'd', label: 'لم أحدد بعد، أبحث عن التوجيه', weights: {"data_entry":5,"alu_pvc_joinery":5,"hair_styling":5,"mens_barbering":5,"sanitary_plumbing":5,"security_agent":6,"ms_access":5,"storekeeper":7,"accounting":5,"autoelectrician":5,"welding":5,"it_technician":5,"construction":5,"collective_cooking":5} }
    ]
  },
  {
    id: 'q15', category: 'qualifications', step: 5, text: 'كم المبلغ الذي ترغب في استثماره لتعلم حرفة جديدة؟',
    options: [
      { value: 'a', label: 'أبحث عن تكوين مجاني', weights: {"data_entry":8,"alu_pvc_joinery":6,"hair_styling":6,"mens_barbering":6,"sanitary_plumbing":6,"security_agent":8,"ms_access":8,"storekeeper":8,"accounting":8,"autoelectrician":6,"welding":6,"it_technician":8,"construction":6,"collective_cooking":6} },
      { value: 'b', label: 'مستعد لاستثمار مبلغ بسيط', weights: {"data_entry":7,"alu_pvc_joinery":7,"hair_styling":7,"mens_barbering":7,"sanitary_plumbing":7,"security_agent":7,"ms_access":7,"storekeeper":7,"accounting":7,"autoelectrician":7,"welding":7,"it_technician":7,"construction":7,"collective_cooking":7} },
      { value: 'c', label: 'مستعد لاستثمار مبلغ متوسط', weights: {"data_entry":5,"alu_pvc_joinery":8,"hair_styling":8,"mens_barbering":8,"sanitary_plumbing":8,"security_agent":5,"ms_access":5,"storekeeper":6,"accounting":5,"autoelectrician":8,"welding":8,"it_technician":6,"construction":8,"collective_cooking":8} },
      { value: 'd', label: 'مستعد لاستثمار مبلغ كبير إذا كانت الفرصة واعدة', weights: {"data_entry":4,"alu_pvc_joinery":9,"hair_styling":9,"mens_barbering":9,"sanitary_plumbing":9,"security_agent":3,"ms_access":7,"storekeeper":5,"accounting":8,"autoelectrician":9,"welding":9,"it_technician":7,"construction":9,"collective_cooking":9} }
    ]
  }
];
