// FJ Senior Level 1 — 30 Days Program Data
// Source: Notion "✅ COMPLETE — 30 Days Senior Level 1: เริ่มขยับ ฟิตร่างผู้สูงอายุ"

const PROGRAM = {
  nameEN: '30 Days Senior Level 1 Challenge',
  nameTH: 'เริ่มขยับ ฟิตร่างผู้สูงอายุ 30 วัน',
  description: 'โปรแกรม 30 วันสำหรับผู้สูงอายุที่อยากเริ่มขยับร่างกายอย่างปลอดภัย เน้นความแข็งแรงพื้นฐาน ทรงตัวได้ดีขึ้น และลดความเสี่ยงล้ม ทำที่บ้านได้ ใช้เวลาวันละ 10–15 นาที',
  duration: '10–15 นาที/วัน',
  equipment: 'เก้าอี้ + ยางยืด',
  rpeRange: '1–4/10',
  weeks: [
    { num: 1, themeTH: 'ปลุกกล้ามเนื้อ', themeEN: 'Wake Up', focus: 'ท่าง่ายที่สุด สร้างนิสัยการขยับ' },
    { num: 2, themeTH: 'สร้างพื้นฐาน', themeEN: 'Build Foundation', focus: 'เพิ่มความแข็งแรงขาและสะโพก เริ่ม balance' },
    { num: 3, themeTH: 'ฝึกทรงตัว', themeEN: 'Balance Training', focus: 'เน้น fall prevention — ยืนขาเดียว เดินแบบต่างๆ' },
    { num: 4, themeTH: 'รวมร่าง', themeEN: 'Bring It Together', focus: 'รวมทุกทักษะ ทดสอบความก้าวหน้า' }
  ]
};

const CONSENT_ITEMS = [
  'โปรแกรมนี้ใช้เวลา 30 วัน นับจากวันที่กด Activate',
  'หลัง Activate แล้ว สามารถ Pause ได้ 1 ครั้ง — ระยะเวลาใช้งาน 1 ปีจากวันที่เริ่ม',
  'เปลี่ยนโปรแกรมได้ภายใน 3 วันหลังซื้อ (เฉพาะ Days-Challenge ราคาเท่ากัน)',
  'ข้อมูลในโปรแกรมนี้ไม่ใช่คำแนะนำทางการแพทย์ — ไม่สามารถทดแทนคำแนะนำจากแพทย์ได้',
  'ควรปรึกษาแพทย์ก่อนเริ่ม โดยเฉพาะถ้ามีโรคประจำตัว ผ่าตัดมาไม่เกิน 6 เดือน หรือมีความดันสูง',
  'ข้าพเจ้ายินยอมให้เก็บข้อมูลการออกกำลังกายเพื่อการติดตามผล (PDPA)'
];

const SAFETY = {
  rpeScale: [
    { rpe: 1, level: 'นั่งพัก', signal: 'ไม่มีความเหนื่อยเลย', ok: true },
    { rpe: 2, level: 'เบามาก', signal: 'รู้สึกได้นิดหน่อย หายใจสบาย', ok: true },
    { rpe: 3, level: 'เบา', signal: 'หายใจแรงขึ้นเล็กน้อย ยังคุยได้ปกติ', ok: true, target: true },
    { rpe: 4, level: 'ปานกลาง', signal: 'หายใจแรงขึ้น แต่ยังฮัมเพลงได้', ok: true, max: true },
    { rpe: '5–6', level: 'หนักขึ้น', signal: 'พูดได้แค่ประโยคสั้นๆ', ok: false, warning: true },
    { rpe: '7+', level: 'หนักมาก', signal: 'พูดได้แค่คำเดียว หัวใจเต้นแรง', ok: false, stop: true }
  ],
  redFlags: [
    'เวียนศีรษะหรือหน้ามืด',
    'เจ็บแปลบที่ข้อต่อ (ไม่ใช่แค่ปวดกล้ามเนื้อ)',
    'แน่นหน้าอกหรือหายใจไม่ออก',
    'ปวดศีรษะรุนแรงกะทันหัน',
    'หัวใจเต้นผิดปกติ'
  ],
  dailyCheck: [
    { condition: 'ปวดกล้ามเนื้อมาก', action: 'ทำเฉพาะท่ายืดเหยียดวันนั้น' },
    { condition: 'เพลียหรือนอนไม่หลับ', action: 'ลดจำนวนเซตเหลือ 1 เซต' },
    { condition: 'ปวดข้อ', action: 'ข้ามท่าที่ต้องลงน้ำหนักในข้อนั้น' },
    { condition: 'วัดความดันได้สูงกว่าปกติ', action: 'ทำแค่ท่ายืดเหยียดและหายใจ' },
    { condition: 'รู้สึกดีและพร้อม', action: 'เริ่มเลย! 💪' }
  ]
};

const DAYS = [
  // ============ WEEK 1: ปลุกกล้ามเนื้อ ============
  {
    day: 1, week: 1,
    category: 'strength', color: '#EF4444',
    titleTH: 'ยืนให้แข็งแรง',
    subtitle: 'เริ่มขยับขา — Chair Stand + Toe Raises + Ankle Circles',
    whyImportant: 'การลุก-นั่งจากเก้าอี้คือท่าที่ใช้บ่อยที่สุดในชีวิตประจำวัน เริ่มจากท่านี้ก่อนเลย — ง่าย ปลอดภัย และได้ผลทันที',
    educationTopic: 'ทำไมกล้ามเนื้อขาถึงสำคัญที่สุดสำหรับผู้สูงอายุ',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Chair Stand', nameTH: 'ลุก-นั่งจากเก้าอี้', reps: '8 ครั้ง', sets: '1 เซต', rest: '45 วินาที', benefit: 'สอนการลุก-นั่งที่ปลอดภัย กระตุ้นต้นขาและสะโพก' },
      { nameEN: 'Toe Raises', nameTH: 'ยกปลายเท้า — ยืนพิง', reps: '10 ครั้ง', sets: '1 เซต', rest: '30 วินาที', benefit: 'เสริมกล้ามหน้าแข้ง ป้องกันการสะดุด' },
      { nameEN: 'Ankle Circles', nameTH: 'หมุนข้อเท้า', reps: '8 รอบ แต่ละทิศทาง', sets: '1 เซต', rest: '', benefit: 'หล่อลื่นข้อเท้า เพิ่มการไหลเวียนเลือด' }
    ],
    rpeTarget: '2–3',
    reflection: 'วันนี้รู้สึกยังไงบ้างหลังทำ?',
    isCheckin: false, checkinFields: []
  },
  {
    day: 2, week: 1,
    category: 'balance', color: '#EAB308',
    titleTH: 'หาจุดทรงตัว',
    subtitle: 'ยืนขาเดียวครั้งแรก — One-Leg Stand + Heel-to-Toe Walk + Calf Raises',
    whyImportant: '75% ของการล้มในผู้สูงอายุเกิดจากการทรงตัวไม่ดี ไม่ใช่ความอ่อนแอ — วันนี้เราเริ่มฝึกระบบทรงตัว',
    educationTopic: 'ทรงตัวไม่ดีไม่ใช่ความผิดของคุณ',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'One-Leg Stand', nameTH: 'ยืนขาเดียว — มีพยุง', reps: '5–8 วินาที แต่ละขา', sets: '2 เซต', rest: '30 วินาที', benefit: 'สร้างความมั่นคงข้อเท้าและสะโพก' },
      { nameEN: 'Heel-to-Toe Walk', nameTH: 'เดินต่อเท้า ด้วยท่า Heel-to-Toe Walk', reps: '6 ก้าว', sets: '2 เซต', rest: '30 วินาที', benefit: 'ฝึกระบบประสาท ควบคุมทรงตัวบนพื้นฐานแคบ' },
      { nameEN: 'Calf Raises', nameTH: 'ยกส้นเท้า', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: 'เสริมน่อง เพิ่มแรงดันเวลาเดิน' }
    ],
    rpeTarget: '2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 3, week: 1,
    category: 'mobility', color: '#22C55E',
    titleTH: 'รีเซ็ตท่าทาง',
    subtitle: 'ปรับท่าทาง — Scapular Activation + Shoulder Rolls + Chin Tuck',
    whyImportant: 'ท่าทางโก่งคือเหตุที่ทำให้ปวดคอ ปวดหลัง และหายใจตื้น — 3 ท่านี้แก้ได้ใน 10 นาที',
    educationTopic: 'ท่าทางดีช่วยให้หายใจดีขึ้น 30%',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Scapular Activation', nameTH: 'กระตุ้นสะบัก ด้วยท่า Scapular Activation', reps: '10 ครั้ง', sets: '1 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Shoulder Rolls', nameTH: 'หมุนไหล่', reps: '8 ครั้ง', sets: '2 เซต', rest: '20 วินาที', benefit: '' },
      { nameEN: 'Chin Tuck', nameTH: 'ดึงคาง', reps: '8 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 4, week: 1,
    category: 'strength', color: '#EF4444',
    titleTH: 'เดินดีขึ้นวันนี้',
    subtitle: 'ควบคุมเท้า + เข่า — Knee Extension + Heel Walking + Calf Stretch',
    whyImportant: 'เข่าอ่อนและหน้าแข้งอ่อนเป็นต้นเหตุของการสะดุดและเดินไม่มั่น — วันนี้เราแก้ตรงนั้น',
    educationTopic: 'ทำไมหน้าแข้งสำคัญกว่าที่คิด',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Knee Extension', nameTH: 'เหยียดเข่า — ยืดยาง ด้วยท่า Knee Extension', reps: '10 ครั้ง แต่ละขา', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Heel Walking', nameTH: 'เดินส้นเท้า', reps: '6–8 ก้าว', sets: '2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Calf Stretch', nameTH: 'ยืดน่อง — กำแพง', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2–3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 5, week: 1,
    category: 'strength', color: '#EF4444',
    titleTH: 'วันสะโพกแฮปปี้',
    subtitle: 'เปิดสะโพก — Hip Abduction + Hip Extension + T-Spine Rotation',
    whyImportant: 'สะโพกอ่อนแอคือเหตุหลักของการล้มด้านข้าง — วันนี้ปลุกกล้ามที่ทำหน้าที่นี้โดยเฉพาะ',
    educationTopic: 'สะโพกแข็งแรง = ไม่ล้ม',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Hip Abduction', nameTH: 'ยกขาด้านข้าง', reps: '8–10 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Hip Extension', nameTH: 'เหยียดสะโพก', reps: '10 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'T-Spine Rotation', nameTH: 'หมุนหลังส่วนบน ด้วยท่า T-Spine Rotation', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 6, week: 1,
    category: 'balance', color: '#EAB308',
    titleTH: 'คอร์สำหรับชีวิตประจำวัน',
    subtitle: 'คอร์ง่ายๆ — Trunk Stability Roll + Seated March + Cat-Camel',
    whyImportant: 'คอร์ที่แข็งแรงช่วยปกป้องหลังส่วนล่างและเพิ่มทรงตัวในทุกกิจกรรมประจำวัน',
    educationTopic: 'คอร์ไม่ใช่แค่ซิกแพก — ทำไมผู้สูงอายุต้องฝึก',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Trunk Stability Roll', nameTH: 'ฝึกแกนกลางลำตัว ด้วยท่า Trunk Stability Roll', reps: '8 ครั้ง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Seated March', nameTH: 'ย่ำเท้า — นั่ง', reps: '20 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Cat-Camel', nameTH: 'ยืดหลัง ด้วยท่า Cat-Camel', reps: '6 รอบช้าๆ', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 7, week: 1,
    category: 'checkin', color: '#3B82F6',
    titleTH: 'Check-in สัปดาห์ที่ 1 + ยืดผ่อนคลาย',
    subtitle: 'วัดผลและยืดเหยียด — สัปดาห์ที่ 1 เสร็จแล้ว!',
    whyImportant: '1 สัปดาห์ผ่านไปแล้ว! วันนี้วัดและบันทึกความก้าวหน้า แล้วให้รางวัลร่างกายด้วยการยืดเหยียด',
    educationTopic: 'สิ่งที่เปลี่ยนไปในร่างกายหลัง 7 วันแรก',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Hamstring Stretch', nameTH: 'ยืดหลังขา — นั่ง', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' },
      { nameEN: 'Chest Opener', nameTH: 'เปิดหน้าอก — กำแพง', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' },
      { nameEN: 'Ankle Circles', nameTH: 'หมุนข้อเท้า', reps: '8 รอบ แต่ละทิศทาง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: 'สิ่งที่ยากที่สุดสัปดาห์นี้คืออะไร?',
    isCheckin: true,
    checkinFields: [
      { label: 'ลุก-นั่ง (30 วินาที)', unit: 'ครั้ง', key: 'chairStand' },
      { label: 'ยืนขาเดียว (ขาขวา)', unit: 'วินาที', key: 'oneLegR' },
      { label: 'ยืนขาเดียว (ขาซ้าย)', unit: 'วินาที', key: 'oneLegL' },
      { label: 'ความรู้สึกโดยรวม', unit: '/10', key: 'feeling' }
    ]
  },

  // ============ WEEK 2: สร้างพื้นฐาน ============
  {
    day: 8, week: 2,
    category: 'strength', color: '#EF4444',
    titleTH: 'ก้าวแข็งแรง',
    subtitle: 'ขาส่วนล่าง + ด้านข้าง — Knee Flexion + Lateral Step + Heel-to-Toe Walk',
    whyImportant: 'หลังขาและสะโพกด้านข้างคือกล้ามที่ช่วยให้ขึ้นบันไดและก้าวข้ามสิ่งกีดขวางได้ปลอดภัย',
    educationTopic: 'ทำไมต้องเดินด้านข้างด้วย?',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Knee Flexion', nameTH: 'งอเข่า — ยืน', reps: '10 ครั้ง แต่ละขา', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Lateral Step', nameTH: 'ก้าวด้านข้าง — ยาง', reps: '6 ก้าว แต่ละทิศทาง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Heel-to-Toe Walk', nameTH: 'เดินต่อเท้า ด้วยท่า Heel-to-Toe Walk', reps: '8 ก้าว', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 9, week: 2,
    category: 'mobility', color: '#22C55E',
    titleTH: 'อิสรภาพคอและไหล่',
    subtitle: 'คลายคอ-ไหล่ — Neck Rotation + Shoulder Rotation + Scapular Activation',
    whyImportant: 'คอและไหล่ตึงทำให้หันตัวยาก — ซึ่งจำเป็นมากสำหรับการขับรถ เดิน และป้องกันการล้ม',
    educationTopic: 'คอตึง ไหล่ตึง มาจากไหน และแก้ยังไง',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Neck Rotation', nameTH: 'หมุนคอ', reps: '6 รอบช้าๆ แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Shoulder Rotation', nameTH: 'หมุนไหล่', reps: '8 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Scapular Activation', nameTH: 'กระตุ้นสะบัก ด้วยท่า Scapular Activation', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 10, week: 2,
    category: 'strength', color: '#EF4444',
    titleTH: 'เปิดสวิตช์สะโพก',
    subtitle: 'สะโพก x3 — Standing Fire Hydrant + Hip Extension + Calf Raises',
    whyImportant: 'Gluteus medius (กล้ามสะโพกด้านข้าง) คือกล้ามที่ป้องกันไม่ให้เข่ายุบเวลาเดิน — วันนี้ปลุกตรงนั้นโดยเฉพาะ',
    educationTopic: 'กล้ามสะโพก 1 มัดที่ป้องกันการล้มได้ดีที่สุด',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Standing Fire Hydrant', nameTH: 'ยกขางอสะโพก ด้วยท่า Fire Hydrant', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Hip Extension', nameTH: 'เหยียดสะโพก', reps: '10 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Calf Raises', nameTH: 'ยกส้นเท้า', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 11, week: 2,
    category: 'balance', color: '#EAB308',
    titleTH: 'ท้าทายการทรงตัวเบาๆ',
    subtitle: 'ทรงตัวดีขึ้น — One-Leg Stand + Knee Bends + Wall Ankle Mobilization',
    whyImportant: 'ข้อเท้าที่แข็งยืดหยุ่นน้อยทำให้ทรงตัวยาก — วันนี้เพิ่มความยืดหยุ่นข้อเท้าและทดสอบทรงตัวนานขึ้น',
    educationTopic: 'ข้อเท้ากับการทรงตัว: เชื่อมโยงกันอย่างไร',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'One-Leg Stand', nameTH: 'ยืนขาเดียว — มีพยุง', reps: '8–10 วินาที แต่ละขา', sets: '2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Knee Bends', nameTH: 'งอเข่า — ยืน', reps: '8–10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Wall Ankle Mobilization', nameTH: 'ยืดข้อเท้า ด้วยท่า Wall Ankle Mobilization', reps: '6 ครั้ง แต่ละขา', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2–3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 12, week: 2,
    category: 'strength', color: '#EF4444',
    titleTH: 'ยืนตรงอีกครั้ง',
    subtitle: 'ขา + เท้า + การเดิน — Chair Stand + Posterior Tibialis + Monster Walk',
    whyImportant: 'โค้งฝ่าเท้าและกล้ามข้อเท้าด้านในช่วยจัดแนวเข่าและสะโพก — ถ้าอ่อนแอจะส่งแรงกดขึ้นไปเรื่อยๆ',
    educationTopic: 'เท้าคือรากฐาน — ทำไมต้องดูแลโค้งฝ่าเท้า',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Chair Stand', nameTH: 'ลุก-นั่งจากเก้าอี้', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Posterior Tibialis Activation', nameTH: 'กระตุ้นกล้ามเนื้อหลังแข้ง ด้วยท่า Posterior Tibialis', reps: '6 ครั้ง แต่ละเท้า', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Monster Walk', nameTH: 'เดินกว้างยืดยาง ด้วยท่า Monster Walk', reps: '4 ก้าวหน้า + 4 ก้าวหลัง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 13, week: 2,
    category: 'balance', color: '#EAB308',
    titleTH: 'ความยืดหยุ่นสะโพก + ทรงตัว',
    subtitle: 'หมุนตัว + ก้าวข้าง — T-Spine Rotation + Lateral Step + Toe Raises',
    whyImportant: 'ความสามารถหมุนลำตัวและก้าวข้างคือสิ่งที่ทำให้หลบสิ่งกีดขวางได้ — จำเป็นมากในชีวิตประจำวัน',
    educationTopic: 'ทำไมต้องฝึกหมุนลำตัว — ไม่ใช่แค่เรื่องความยืดหยุ่น',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'T-Spine Rotation', nameTH: 'หมุนหลังส่วนบน ด้วยท่า T-Spine Rotation', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Lateral Step', nameTH: 'ก้าวด้านข้าง', reps: '6 ก้าว แต่ละทิศทาง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Toe Raises', nameTH: 'ยกปลายเท้า', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2–3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 14, week: 2,
    category: 'checkin', color: '#3B82F6',
    titleTH: 'Check-in สัปดาห์ที่ 2 + คอร์ + หายใจ',
    subtitle: 'วัดผลสัปดาห์ 2 — ครึ่งทางแล้ว!',
    whyImportant: '2 สัปดาห์ผ่านไป! ร่างกายเริ่มจำท่าได้แล้ว วันนี้วัดผลเปรียบเทียบและให้ความสำคัญกับการหายใจ',
    educationTopic: 'สิ่งที่เปลี่ยนไปหลัง 14 วัน — วิทยาศาสตร์เบื้องหลัง',
    educationDuration: '4 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Seated March', nameTH: 'ย่ำเท้า — นั่ง', reps: '20 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Cat-Camel', nameTH: 'ยืดหลัง ด้วยท่า Cat-Camel', reps: '6 รอบ', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Chest Opener', nameTH: 'เปิดหน้าอก', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: 'เปรียบกับสัปดาห์ที่ 1 รู้สึกยังไง?',
    isCheckin: true,
    checkinFields: [
      { label: 'ลุก-นั่ง (30 วินาที)', unit: 'ครั้ง', key: 'chairStand' },
      { label: 'ยืนขาเดียว (ขาขวา)', unit: 'วินาที', key: 'oneLegR' },
      { label: 'ยืนขาเดียว (ขาซ้าย)', unit: 'วินาที', key: 'oneLegL' },
      { label: 'ความรู้สึกโดยรวม', unit: '/10', key: 'feeling' }
    ]
  },

  // ============ WEEK 3: ฝึกทรงตัว ============
  {
    day: 15, week: 3,
    category: 'strength', color: '#EF4444',
    titleTH: 'เดินดีขึ้น ภาค 2',
    subtitle: 'เดินปลอดภัยขึ้น — Heel Walking + Knee Extension + Calf Stretch',
    whyImportant: 'เข้าสัปดาห์ 3 แล้ว — เวลาเพิ่มความท้าทายเบาๆ ขาส่วนล่างต้องแข็งแรงขึ้นเพื่อรองรับการเดินระยะไกลขึ้น',
    educationTopic: 'เดินให้ดีขึ้น — 3 กล้ามที่ต้องแข็งแรง',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Heel Walking', nameTH: 'เดินส้นเท้า', reps: '8–10 ก้าว', sets: '2 เซต', rest: '', benefit: '' },
      { nameEN: 'Knee Extension', nameTH: 'เหยียดเข่า — ยืดยาง ด้วยท่า Knee Extension', reps: '12 ครั้ง แต่ละขา', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Calf Stretch', nameTH: 'ยืดน่อง', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 16, week: 3,
    category: 'strength', color: '#EF4444',
    titleTH: 'สร้างความแข็งแรงขา',
    subtitle: 'ขาแข็งแรง — Chair Stand + Hip Abduction + Knee Bends',
    whyImportant: 'เพิ่มจำนวนซ้ำขึ้นเล็กน้อย — ร่างกายพร้อมแล้ว กล้ามเนื้อจะแข็งแรงขึ้นอย่างเห็นได้ชัด',
    educationTopic: 'Overload principle — ทำไมต้องเพิ่มซ้ำ',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Chair Stand', nameTH: 'ลุก-นั่งจากเก้าอี้', reps: '10–12 ครั้ง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Hip Abduction', nameTH: 'ยกขาด้านข้าง', reps: '10 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Knee Bends', nameTH: 'งอเข่า — ยืน', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3–4',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 17, week: 3,
    category: 'mobility', color: '#22C55E',
    titleTH: 'ยืดง่ายๆ ผ่อนคลาย',
    subtitle: 'พักและฟื้นฟู — Hamstring Stretch + Neck Rotation + Ankle Circles',
    whyImportant: 'การฟื้นตัวสำคัญพอๆ กับการออกกำลังกาย — วันยืดเหยียดช่วยให้กล้ามเนื้อซ่อมแซมและพร้อมสำหรับวันพรุ่งนี้',
    educationTopic: 'Recovery day ไม่ใช่วันขี้เกียจ',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Hamstring Stretch', nameTH: 'ยืดหลังขา — นั่ง', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' },
      { nameEN: 'Neck Rotation', nameTH: 'หมุนคอ', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Ankle Circles', nameTH: 'หมุนข้อเท้า', reps: '8 รอบ แต่ละทิศทาง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 18, week: 3,
    category: 'balance', color: '#EAB308',
    titleTH: 'หาความมั่นคง',
    subtitle: 'ทรงตัวนานขึ้น — One-Leg Stand + Heel-to-Toe Walk + Posterior Tibialis',
    whyImportant: 'ทรงตัว 10 วินาทีบนขาเดียวได้ = ลดความเสี่ยงล้มได้ 50% ตามการวิจัย — วันนี้เราเข้าใกล้ตรงนั้นแล้ว',
    educationTopic: '10 วินาทีที่เปลี่ยนชีวิต',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'One-Leg Stand', nameTH: 'ยืนขาเดียว — มีพยุง', reps: '10 วินาที แต่ละข้าง', sets: '2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Heel-to-Toe Walk', nameTH: 'เดินต่อเท้า ด้วยท่า Heel-to-Toe Walk', reps: '8–10 ก้าว', sets: '2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Posterior Tibialis Activation', nameTH: 'กระตุ้นกล้ามเนื้อหลังแข้ง ด้วยท่า Posterior Tibialis', reps: '6 ครั้ง แต่ละเท้า', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2–3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 19, week: 3,
    category: 'strength', color: '#EF4444',
    titleTH: 'ความแข็งแรงและควบคุมสะโพก',
    subtitle: 'สะโพกรอบทิศ — Standing Fire Hydrant + Hip Extension + Lateral Step',
    whyImportant: 'สะโพกต้องแข็งแรงในทุกทิศทาง ไม่ใช่แค่หน้า-หลัง — ด้านข้างช่วยหลบสิ่งกีดขวางและเดินบนพื้นขรุขระ',
    educationTopic: 'ทำไมสะโพกต้องแข็งแรง 3 ทิศทาง',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Standing Fire Hydrant', nameTH: 'ยกขางอสะโพก ด้วยท่า Fire Hydrant', reps: '8 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Hip Extension', nameTH: 'เหยียดสะโพก', reps: '12 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Lateral Step', nameTH: 'ก้าวด้านข้าง — ยาง', reps: '6 ก้าว แต่ละทิศทาง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3–4',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 20, week: 3,
    category: 'mobility', color: '#22C55E',
    titleTH: 'รีบูตท่าทาง',
    subtitle: 'ท่าทางดีสุดใน 20 วัน — Scapular Activation + Chin Tuck + Chest Opener',
    whyImportant: 'สัปดาห์ที่ 3 ท่าทางดีขึ้นอย่างเห็นได้ชัด — วันนี้เน้นท่าทางเพื่อล็อคการเปลี่ยนแปลงไว้',
    educationTopic: 'ท่าทางที่ดีทำให้อายุยืน — มีหลักฐานจริง',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Scapular Activation', nameTH: 'กระตุ้นสะบัก ด้วยท่า Scapular Activation', reps: '12 ครั้ง', sets: '1 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Chin Tuck', nameTH: 'ดึงคาง', reps: '8 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Chest Opener', nameTH: 'เปิดหน้าอก — กำแพง', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 21, week: 3,
    category: 'checkin', color: '#3B82F6',
    titleTH: 'Check-in สัปดาห์ที่ 3 + เคลื่อนไหวลื่นไหล',
    subtitle: 'วัดผลสัปดาห์ 3 — เกือบถึงแล้ว!',
    whyImportant: '3 สัปดาห์แล้ว — นี่คือจุดที่คนส่วนใหญ่เริ่มเห็นความแตกต่างจริงๆ ในชีวิตประจำวัน',
    educationTopic: '21 วัน เปลี่ยนนิสัยได้จริงไหม?',
    educationDuration: '4 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Cat-Camel', nameTH: 'ยืดหลัง ด้วยท่า Cat-Camel', reps: '6 รอบควบคุม', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'T-Spine Rotation', nameTH: 'หมุนหลังส่วนบน ด้วยท่า T-Spine Rotation', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Toe Raises', nameTH: 'ยกปลายเท้า', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: 'กิจวัตรประจำวันอะไรที่ง่ายขึ้น?',
    isCheckin: true,
    checkinFields: [
      { label: 'ลุก-นั่ง (30 วินาที)', unit: 'ครั้ง', key: 'chairStand' },
      { label: 'ยืนขาเดียว (ขาขวา)', unit: 'วินาที', key: 'oneLegR' },
      { label: 'ยืนขาเดียว (ขาซ้าย)', unit: 'วินาที', key: 'oneLegL' },
      { label: 'ความรู้สึกโดยรวม', unit: '/10', key: 'feeling' }
    ]
  },

  // ============ WEEK 4: รวมร่าง ============
  {
    day: 22, week: 4,
    category: 'strength', color: '#EF4444',
    titleTH: 'รีเฟรชความแข็งแรงขา',
    subtitle: 'ขาแข็งแรงสุดใน 22 วัน — Knee Flexion + Chair Stand + Calf Raises',
    whyImportant: 'สัปดาห์สุดท้าย! เพิ่มความเข้มข้นเล็กน้อย — ร่างกายพร้อมแล้วและแข็งแรงกว่าเมื่อ 3 สัปดาห์ก่อนมาก',
    educationTopic: 'ทำไมสัปดาห์สุดท้ายสำคัญที่สุด',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Knee Flexion', nameTH: 'งอเข่า', reps: '10 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Chair Stand', nameTH: 'ลุก-นั่งจากเก้าอี้', reps: '10 ครั้ง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Calf Raises', nameTH: 'ยกส้นเท้า', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3–4',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 23, week: 4,
    category: 'balance', color: '#EAB308',
    titleTH: 'รีบูตการทรงตัว',
    subtitle: 'ทรงตัวนานที่สุด — One-Leg Stand + Knee Bends + Heel-to-Toe Walk',
    whyImportant: 'วันนี้ลองยืนขาเดียวนานที่สุดเท่าที่ทำได้ — เป็นการทดสอบไม่เป็นทางการก่อนวันที่ 30',
    educationTopic: 'Balance test ทำที่บ้าน — รู้จักตัวเองมากขึ้น',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'One-Leg Stand', nameTH: 'ยืนขาเดียว', reps: '10–12 วินาที แต่ละขา', sets: '2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Knee Bends', nameTH: 'งอเข่า — ยืน', reps: '10 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Heel-to-Toe Walk', nameTH: 'เดินต่อเท้า ด้วยท่า Heel-to-Toe Walk', reps: '10 ก้าว', sets: '1–2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2–3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 24, week: 4,
    category: 'mobility', color: '#22C55E',
    titleTH: 'ความยืดหยุ่นสะโพก',
    subtitle: 'คืนความยืดหยุ่น — T-Spine Rotation + Wall Ankle Mobilization + Hamstring Stretch',
    whyImportant: 'ความยืดหยุ่นข้อเท้าและสะโพกคือสิ่งที่ป้องกันการบาดเจ็บในระยะยาว — วันนี้ลงทุนในอนาคต',
    educationTopic: 'ความยืดหยุ่น vs ความแข็งแรง — อะไรสำคัญกว่าสำหรับผู้สูงอายุ?',
    educationDuration: '4 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'T-Spine Rotation', nameTH: 'หมุนหลังส่วนบน ด้วยท่า T-Spine Rotation', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Wall Ankle Mobilization', nameTH: 'ยืดข้อเท้า ด้วยท่า Wall Ankle Mobilization', reps: '6 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Hamstring Stretch', nameTH: 'ยืดหลังขา', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 25, week: 4,
    category: 'strength', color: '#EF4444',
    titleTH: 'กระตุ้นสะโพก',
    subtitle: 'สะโพกแข็งแรงที่สุด — Hip Abduction + Hip Extension + Standing Fire Hydrant',
    whyImportant: 'วันสะโพก 100% — ทั้ง 3 ท่าเน้นกล้ามที่ป้องกันการล้มด้านข้างและดูแลกระดูกสันหลัง',
    educationTopic: 'สะโพกแข็งแรง = หลังไม่ปวด',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Hip Abduction', nameTH: 'ยกขาด้านข้าง', reps: '12 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Hip Extension', nameTH: 'เหยียดสะโพก', reps: '12 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Standing Fire Hydrant', nameTH: 'ยกขางอสะโพก ด้วยท่า Fire Hydrant', reps: '8 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3–4',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 26, week: 4,
    category: 'strength', color: '#EF4444',
    titleTH: 'ก้าวแข็งแรงขึ้น',
    subtitle: 'ก้าวเดินมั่นคง — Heel Walking + Knee Extension + Posterior Tibialis',
    whyImportant: '4 วันสุดท้าย! ยิ่งทำมากขึ้นเท่าไหร่ ยิ่งเดินปลอดภัยขึ้นเท่านั้น',
    educationTopic: 'เดินปลอดภัย — เช็ค 5 จุดก่อนออกนอกบ้าน',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Heel Walking', nameTH: 'เดินส้นเท้า', reps: '10 ก้าว', sets: '1–2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Knee Extension', nameTH: 'เหยียดเข่า — ยืดยาง ด้วยท่า Knee Extension', reps: '12 ครั้ง แต่ละขา', sets: '1 เซต', rest: '45 วินาที', benefit: '' },
      { nameEN: 'Posterior Tibialis Activation', nameTH: 'กระตุ้นกล้ามเนื้อหลังแข้ง ด้วยท่า Posterior Tibialis', reps: '6 ครั้ง แต่ละเท้า', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '3',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 27, week: 4,
    category: 'mobility', color: '#22C55E',
    titleTH: 'ปรับแต่งส่วนบน',
    subtitle: 'ไหล่-หลัง-ท่าทาง — Scapular Activation + Shoulder Rotation + Chest Opener',
    whyImportant: '27 วัน — ท่าทางดีขึ้นอย่างมาก วันนี้ล็อคความดีนั้นไว้ด้วยการปรับส่วนบนให้สมบูรณ์',
    educationTopic: 'ท่าทางที่ดีช่วยให้หายใจได้ลึกขึ้น 30%',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Scapular Activation', nameTH: 'กระตุ้นสะบัก ด้วยท่า Scapular Activation', reps: '12 ครั้ง', sets: '1 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Shoulder Rotation', nameTH: 'หมุนไหล่', reps: '8 รอบช้าๆ', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Chest Opener', nameTH: 'เปิดหน้าอก', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1–2',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 28, week: 4,
    category: 'checkin', color: '#3B82F6',
    titleTH: 'Check-in สัปดาห์ที่ 4 + คอร์ + ทรงตัว',
    subtitle: 'วัดผลสัปดาห์ 4 — เกือบถึงเส้นชัย!',
    whyImportant: 'อีก 2 วันเดียว! วันนี้วัดผลครั้งสุดท้ายก่อน Grand Finale วันที่ 30',
    educationTopic: 'ร่างกายคุณเปลี่ยนไปอะไรบ้างใน 4 สัปดาห์',
    educationDuration: '4 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Seated March', nameTH: 'ย่ำเท้า — นั่ง', reps: '20–24 ครั้ง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'One-Leg Stand', nameTH: 'ยืนขาเดียว', reps: '12 วินาที แต่ละขา', sets: '2 เซต', rest: '30 วินาที', benefit: '' },
      { nameEN: 'Calf Raises', nameTH: 'ยกส้นเท้า', reps: '12 ครั้ง', sets: '1 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '2–3',
    reflection: 'สิ่งที่เปลี่ยนไปมากที่สุดในชีวิตประจำวันคืออะไร?',
    isCheckin: true,
    checkinFields: [
      { label: 'ลุก-นั่ง (30 วินาที)', unit: 'ครั้ง', key: 'chairStand' },
      { label: 'ยืนขาเดียว (ขาขวา)', unit: 'วินาที', key: 'oneLegR' },
      { label: 'ยืนขาเดียว (ขาซ้าย)', unit: 'วินาที', key: 'oneLegL' },
      { label: 'ความรู้สึกโดยรวม', unit: '/10', key: 'feeling' }
    ]
  },
  {
    day: 29, week: 4,
    category: 'mobility', color: '#22C55E',
    titleTH: 'วันเคลื่อนไหวลื่นไหล',
    subtitle: 'เตรียมพร้อมสำหรับวันพรุ่งนี้ — Cat-Camel + T-Spine Rotation + Hamstring Stretch',
    whyImportant: 'วันสุดท้ายก่อนวันทดสอบ — เตรียมร่างกายให้ยืดหยุ่น ผ่อนคลาย และพร้อมสำหรับ Day 30',
    educationTopic: 'คืนก่อนวันสำคัญ — ทำยังไงให้ร่างกายพร้อม',
    educationDuration: '3 นาที',
    videoUrl: '',
    exercises: [
      { nameEN: 'Cat-Camel', nameTH: 'ยืดหลัง ด้วยท่า Cat-Camel', reps: '6 รอบ', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'T-Spine Rotation', nameTH: 'หมุนหลังส่วนบน ด้วยท่า T-Spine Rotation', reps: '8 ครั้ง แต่ละข้าง', sets: '1 เซต', rest: '', benefit: '' },
      { nameEN: 'Hamstring Stretch', nameTH: 'ยืดหลังขา', reps: '20 วินาที', sets: '2 เซต', rest: '', benefit: '' }
    ],
    rpeTarget: '1',
    reflection: '',
    isCheckin: false, checkinFields: []
  },
  {
    day: 30, week: 4,
    category: 'checkin', color: '#3B82F6',
    titleTH: 'วันแห่งชัยชนะ: ทดสอบความก้าวหน้า',
    subtitle: 'ทดสอบ 3 อย่าง เปรียบกับวันที่ 1',
    whyImportant: '30 วันผ่านไปแล้ว! วันนี้พิสูจน์ว่าคุณเปลี่ยนไปอย่างไร — ผ่านการทดสอบเดียวกับวันที่เริ่มต้น',
    educationTopic: 'ยินดีด้วย — และต่อไปทำอะไรดี?',
    educationDuration: '5 นาที',
    videoUrl: '',
    exercises: [],
    rpeTarget: '',
    reflection: '',
    isCheckin: true,
    isFinal: true,
    checkinFields: [
      { label: 'ลุก-นั่ง (30 วินาที)', unit: 'ครั้ง', key: 'chairStand' },
      { label: 'ยืนขาเดียว (ขาขวา)', unit: 'วินาที', key: 'oneLegR' },
      { label: 'ยืนขาเดียว (ขาซ้าย)', unit: 'วินาที', key: 'oneLegL' },
      { label: 'เดิน 2 นาที', unit: 'ก้าว', key: 'stepTest' },
      { label: 'ความรู้สึกโดยรวม', unit: '/10', key: 'feeling' }
    ]
  }
];
