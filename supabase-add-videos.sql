-- Insert profile for יונתן רוט
INSERT INTO profiles (id, username, full_name, avatar_url, bio, verified)
VALUES (
  '112dc047-cad1-4795-9c6b-500aec61641f',
  'yonatan_rot',
  'יונתן רוט',
  '👨',
  'מומחה לטיולים והרפתקאות',
  true
);

-- Insert profile for אמיתי חצאל
INSERT INTO profiles (id, username, full_name, avatar_url, bio, verified)
VALUES (
  '8db1ab7f-ff56-435a-8490-9b20f5464e4f',
  'amitai_hatsal',
  'אמיתי חצאל',
  '👨',
  'מומחה למלונות יוקרה ונופש',
  true
);

-- חופשה מדהימה ביוון
INSERT INTO videos (
  user_id,
  title,
  description,
  video_url,
  category,
  location,
  price,
  days,
  itinerary,
  tags,
  likes_count,
  comments_count,
  shares_count,
  views_count
) VALUES (
  '112dc047-cad1-4795-9c6b-500aec61641f',
  'חופשה מדהימה ביוון 🇬🇷',
  'טיול מושלם לסנטוריני עם נופים מדהימים',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4',
  'Trips',
  'Santorini, Greece',
  '₪3,500',
  7,
  '[
    {"day": 1, "activities": [{"time": "11:00", "activity": "טיסה לסנטוריני"}, {"time": "14:00", "activity": "צ''ק-אין במלון"}, {"time": "17:00", "activity": "סיור בעיר פירה"}]},
    {"day": 2, "activities": [{"time": "09:00", "activity": "שייט לוולקן"}, {"time": "13:00", "activity": "מעיינות חמים"}, {"time": "19:00", "activity": "שקיעה באויה"}]},
    {"day": 3, "activities": [{"time": "10:00", "activity": "חוף קמארי"}, {"time": "15:00", "activity": "טעימות יין"}, {"time": "20:00", "activity": "ארוחת ערב רומנטית"}]},
    {"day": 4, "isFree": true, "activities": [{"time": "", "activity": "יום חופשי"}]},
    {"day": 5, "activities": [{"time": "09:00", "activity": "סיור באקרוטירי"}, {"time": "14:00", "activity": "חוף אדום"}, {"time": "18:00", "activity": "קניות"}]},
    {"day": 6, "activities": [{"time": "08:00", "activity": "שייט לאיים הסמוכים"}, {"time": "13:00", "activity": "צלילה"}]},
    {"day": 7, "activities": [{"time": "10:00", "activity": "ארוחת בוקר אחרונה"}, {"time": "15:00", "activity": "טיסה חזרה"}]}
  ]'::jsonb,
  ARRAY['יוון', 'זוגות', 'חופשת קיץ', 'ים', 'מלון בוטיק'],
  12500,
  340,
  89,
  45000
);

-- טיול בהרי האלפים
INSERT INTO videos (
  user_id,
  title,
  description,
  video_url,
  category,
  location,
  price,
  days,
  itinerary,
  tags,
  likes_count,
  comments_count,
  shares_count,
  views_count
) VALUES (
  '112dc047-cad1-4795-9c6b-500aec61641f',
  'טיול בהרי האלפים 🏔️',
  'הרפתקה מרהיבה בהרי האלפים השוויצריים',
  'https://res.cloudinary.com/dmxzi7dvx/video/upload/v1755583223/zwbbwckjrgjcrih4iuxj.mp4',
  'Trips',
  'Swiss Alps',
  '₪5,600',
  10,
  '[
    {"day": 1, "activities": [{"time": "10:00", "activity": "טיסה לציריך"}, {"time": "14:00", "activity": "נסיעה לאינטרלקן"}, {"time": "17:00", "activity": "צ''ק-אין"}]},
    {"day": 2, "activities": [{"time": "08:00", "activity": "רכבל ליונגפראו"}, {"time": "11:00", "activity": "ארמון הקרח"}, {"time": "15:00", "activity": "נוף פנורמי"}]},
    {"day": 3, "activities": [{"time": "09:00", "activity": "טיול רגלי באגם בריינץ"}, {"time": "14:00", "activity": "שייט באגם"}]},
    {"day": 4, "isFree": true, "activities": [{"time": "", "activity": "יום חופשי"}]},
    {"day": 5, "activities": [{"time": "08:00", "activity": "סקי בגרינדלוולד"}, {"time": "13:00", "activity": "שיעור סקי"}]},
    {"day": 6, "activities": [{"time": "10:00", "activity": "ביקור בלוצרן"}, {"time": "13:00", "activity": "גשר הקפלה"}, {"time": "16:00", "activity": "אריה לוצרן"}]},
    {"day": 7, "isFree": true, "activities": [{"time": "", "activity": "יום חופשי"}]},
    {"day": 8, "activities": [{"time": "07:00", "activity": "רכבל למאטרהורן"}, {"time": "12:00", "activity": "צילומים"}]},
    {"day": 9, "activities": [{"time": "14:00", "activity": "קניות שוקולד שוויצרי"}, {"time": "19:00", "activity": "ארוחת פונדו"}]},
    {"day": 10, "activities": [{"time": "10:00", "activity": "ארוחת בוקר"}, {"time": "13:00", "activity": "נסיעה לציריך"}, {"time": "16:00", "activity": "טיסה חזרה"}]}
  ]'::jsonb,
  ARRAY['טראק', 'זוגות', 'חורף', 'נוף', 'מלון בוטיק'],
  18700,
  423,
  167,
  62000
);

-- מלון יוקרה בדובאי
INSERT INTO videos (
  user_id,
  title,
  description,
  video_url,
  category,
  location,
  price,
  days,
  itinerary,
  tags,
  likes_count,
  comments_count,
  shares_count,
  views_count
) VALUES (
  '8db1ab7f-ff56-435a-8490-9b20f5464e4f',
  'מלון יוקרה בדובאי ✨',
  'חוויית יוקרה במלון בורג'' אל ערב',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
  'Lodging',
  'Dubai, UAE',
  '₪8,900',
  5,
  '[
    {"day": 1, "activities": [{"time": "10:00", "activity": "טיסה לדובאי"}, {"time": "14:00", "activity": "צ''ק-אין במלון בורג'' אל ערב"}, {"time": "20:00", "activity": "ארוחת ערב במסעדת אל מונתהא"}]},
    {"day": 2, "activities": [{"time": "09:00", "activity": "ביקור בבורג'' חליפה"}, {"time": "14:00", "activity": "קניות בדובאי מול"}, {"time": "19:00", "activity": "מזרקות דובאי"}]},
    {"day": 3, "activities": [{"time": "15:00", "activity": "ספארי במדבר"}, {"time": "17:00", "activity": "רכיבה על גמלים"}, {"time": "20:00", "activity": "ארוחת ערב בדואית"}]},
    {"day": 4, "activities": [{"time": "10:00", "activity": "יום ספא במלון"}, {"time": "14:00", "activity": "חוף פרטי"}, {"time": "18:00", "activity": "שייט ביאכטה"}]},
    {"day": 5, "activities": [{"time": "11:00", "activity": "ארוחת בוקר מאוחרת"}, {"time": "13:00", "activity": "קניות אחרונות"}, {"time": "16:00", "activity": "טיסה חזרה"}]}
  ]'::jsonb,
  ARRAY['דובאי', 'זוגות', 'חופשת קיץ', 'ים', 'מלון יוקרה'],
  23400,
  567,
  234,
  78000
);
