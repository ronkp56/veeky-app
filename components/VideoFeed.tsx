import React, { useMemo } from 'react';
import { FlatList, useWindowDimensions } from 'react-native';
import VideoItem from './VideoItem';

type VideoFeedProps = {
  filter?: 'All' | 'Trips' | 'Lodging' | 'Entertainment';
};

export type VideoData = {
  id: string;
  uri: string;
  category: 'Trips' | 'Lodging' | 'Entertainment';
  influencer: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  location: string;
  price: string;
  days: number;
  itinerary: { day: number; activities: { time: string; activity: string }[]; isFree?: boolean }[];
  likes: number;
  comments: number;
  shares: number;
};

export const MOCK_DATA: VideoData[] = [
    {
      id: '1',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category: 'Trips',
      influencer: { id: 'yonatan', name: 'יונתן רוט', avatar: '👨', verified: true },
      title: 'חופשה מדהימה ביוון 🇬🇷',
      location: 'Santorini, Greece',
      price: '₪3,500',
      days: 7,
      itinerary: [
        { day: 1, activities: [{ time: '11:00', activity: 'טיסה לסנטוריני' }, { time: '14:00', activity: 'צ׳ק-אין במלון' }, { time: '17:00', activity: 'סיור בעיר פירה' }] },
        { day: 2, activities: [{ time: '09:00', activity: 'שייט לוולקן' }, { time: '13:00', activity: 'מעיינות חמים' }, { time: '19:00', activity: 'שקיעה באויה' }] },
        { day: 3, activities: [{ time: '10:00', activity: 'חוף קמארי' }, { time: '15:00', activity: 'טעימות יין' }, { time: '20:00', activity: 'ארוחת ערב רומנטית' }] },
        { day: 4, isFree: true, activities: [{ time: '', activity: 'יום חופשי' }] },
        { day: 5, activities: [{ time: '09:00', activity: 'סיור באקרוטירי' }, { time: '14:00', activity: 'חוף אדום' }, { time: '18:00', activity: 'קניות' }] },
        { day: 6, activities: [{ time: '08:00', activity: 'שייט לאיים הסמוכים' }, { time: '13:00', activity: 'צלילה' }] },
        { day: 7, activities: [{ time: '10:00', activity: 'ארוחת בוקר אחרונה' }, { time: '15:00', activity: 'טיסה חזרה' }] },
      ],
      likes: 12500,
      comments: 340,
      shares: 89,
    },
    {
      id: '2', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
      category: 'Lodging',
      influencer: { id: 'amitai', name: 'אמיתי חצאל', avatar: '👨', verified: true },
      title: 'מלון יוקרה בדובאי ✨',
      location: 'Dubai, UAE',
      price: '₪8,900',
      days: 5,
      itinerary: [
        { day: 1, activities: [{ time: '10:00', activity: 'טיסה לדובאי' }, { time: '14:00', activity: 'צ׳ק-אין במלון בורג׳ אל ערב' }, { time: '20:00', activity: 'ארוחת ערב במסעדת אל מונתהא' }] },
        { day: 2, activities: [{ time: '09:00', activity: 'ביקור בבורג׳ חליפה' }, { time: '14:00', activity: 'קניות בדובאי מול' }, { time: '19:00', activity: 'מזרקות דובאי' }] },
        { day: 3, activities: [{ time: '15:00', activity: 'ספארי במדבר' }, { time: '17:00', activity: 'רכיבה על גמלים' }, { time: '20:00', activity: 'ארוחת ערב בדואית' }] },
        { day: 4, activities: [{ time: '10:00', activity: 'יום ספא במלון' }, { time: '14:00', activity: 'חוף פרטי' }, { time: '18:00', activity: 'שייט ביאכטה' }] },
        { day: 5, activities: [{ time: '11:00', activity: 'ארוחת בוקר מאוחרת' }, { time: '13:00', activity: 'קניות אחרונות' }, { time: '16:00', activity: 'טיסה חזרה' }] },
      ],
      likes: 23400,
      comments: 567,
      shares: 234,
    },
    {
      id: '3', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
      category: 'Entertainment',
      influencer: { id: 'amir', name: 'אמיר אבניאל', avatar: '👩', verified: true },
      title: 'פארק שעשועים בברצלונה 🎢',
      location: 'Barcelona, Spain',
      price: '₪2,200',
      days: 4,
      itinerary: [
        { day: 1, activities: [{ time: '12:00', activity: 'טיסה לברצלונה' }, { time: '15:00', activity: 'צ׳ק-אין' }, { time: '18:00', activity: 'סיור ברמבלס' }] },
        { day: 2, activities: [{ time: '09:00', activity: 'פארק גואל' }, { time: '13:00', activity: 'סגרדה פמיליה' }, { time: '17:00', activity: 'חוף ברצלונטה' }] },
        { day: 3, activities: [{ time: '10:00', activity: 'פורט אוונטורה - פארק שעשועים' }, { time: '20:00', activity: 'מופעי ערב' }] },
        { day: 4, activities: [{ time: '10:00', activity: 'קניות' }, { time: '12:00', activity: 'ארוחת בוקר מאוחרת' }, { time: '15:00', activity: 'טיסה חזרה' }] },
      ],
      likes: 8900,
      comments: 156,
      shares: 45,
    },
    {
      id: '4', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 
      category: 'Trips',
      influencer: { id: 'yonatan', name: 'יונתן רוט', avatar: '👨', verified: true },
      title: 'טיול בהרי האלפים 🏔️',
      location: 'Swiss Alps',
      price: '₪5,600',
      days: 10,
      itinerary: [
        { day: 1, activities: [{ time: '10:00', activity: 'טיסה לציריך' }, { time: '14:00', activity: 'נסיעה לאינטרלקן' }, { time: '17:00', activity: 'צ׳ק-אין' }] },
        { day: 2, activities: [{ time: '08:00', activity: 'רכבל ליונגפראו' }, { time: '11:00', activity: 'ארמון הקרח' }, { time: '15:00', activity: 'נוף פנורמי' }] },
        { day: 3, activities: [{ time: '09:00', activity: 'טיול רגלי באגם בריינץ' }, { time: '14:00', activity: 'שייט באגם' }] },
        { day: 4, isFree: true, activities: [{ time: '', activity: 'יום חופשי' }] },
        { day: 5, activities: [{ time: '08:00', activity: 'סקי בגרינדלוולד' }, { time: '13:00', activity: 'שיעור סקי' }] },
        { day: 6, activities: [{ time: '10:00', activity: 'ביקור בלוצרן' }, { time: '13:00', activity: 'גשר הקפלה' }, { time: '16:00', activity: 'אריה לוצרן' }] },
        { day: 7, isFree: true, activities: [{ time: '', activity: 'יום חופשי' }] },
        { day: 8, activities: [{ time: '07:00', activity: 'רכבל למאטרהורן' }, { time: '12:00', activity: 'צילומים' }] },
        { day: 9, activities: [{ time: '14:00', activity: 'קניות שוקולד שוויצרי' }, { time: '19:00', activity: 'ארוחת פונדו' }] },
        { day: 10, activities: [{ time: '10:00', activity: 'ארוחת בוקר' }, { time: '13:00', activity: 'נסיעה לציריך' }, { time: '16:00', activity: 'טיסה חזרה' }] },
      ],
      likes: 18700,
      comments: 423,
      shares: 167,
    },
  ];

export default function VideoFeed({ filter = 'All' }: VideoFeedProps) {
  const { height } = useWindowDimensions();
  const filteredData = useMemo(
    () => filter === 'All' ? MOCK_DATA : MOCK_DATA.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <FlatList
      data={filteredData}
      renderItem={({ item }) => <VideoItem video={item} />}
      pagingEnabled
      snapToInterval={height}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
      getItemLayout={(_, index) => ({
        length: height,
        offset: height * index,
        index,
      })}
    />
  );
}
