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
  itinerary: { day: number; activities: string[]; isFree?: boolean }[];
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
        { day: 1, activities: ['טיסה לסנטוריני', 'צ׳ק-אין במלון', 'סיור בעיר פירה'] },
        { day: 2, activities: ['שייט לוולקן', 'מעיינות חמים', 'שקיעה באויה'] },
        { day: 3, activities: ['חוף קמארי', 'טעימות יין', 'ארוחת ערב רומנטית'] },
        { day: 4, isFree: true, activities: ['יום חופשי'] },
        { day: 5, activities: ['סיור באקרוטירי', 'חוף אדום', 'קניות'] },
        { day: 6, activities: ['שייט לאיים הסמוכים', 'צלילה'] },
        { day: 7, activities: ['ארוחת בוקר אחרונה', 'טיסה חזרה'] },
      ],
      likes: 12500,
      comments: 340,
      shares: 89,
    },
    {
      id: '2', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
      category: 'Lodging',
      influencer: { id: 'amit', name: 'אמית חצאל', avatar: '👩', verified: true },
      title: 'מלון יוקרה בדובאי ✨',
      location: 'Dubai, UAE',
      price: '₪8,900',
      days: 5,
      itinerary: [
        { day: 1, activities: ['טיסה לדובאי', 'צ׳ק-אין במלון בורג׳ אל ערב', 'ארוחת ערב במסעדת אל מונתהא'] },
        { day: 2, activities: ['ביקור בבורג׳ חליפה', 'קניות בדובאי מול', 'מזרקות דובאי'] },
        { day: 3, activities: ['ספארי במדבר', 'רכיבה על גמלים', 'ארוחת ערב בדואית'] },
        { day: 4, activities: ['יום ספא במלון', 'חוף פרטי', 'שייט ביאכטה'] },
        { day: 5, activities: ['ארוחת בוקר מאוחרת', 'קניות אחרונות', 'טיסה חזרה'] },
      ],
      likes: 23400,
      comments: 567,
      shares: 234,
    },
    {
      id: '3', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
      category: 'Entertainment',
      influencer: { id: 'amir', name: 'אמיר אבניאל', avatar: '🧔', verified: true },
      title: 'פארק שעשועים בברצלונה 🎢',
      location: 'Barcelona, Spain',
      price: '₪2,200',
      days: 4,
      itinerary: [
        { day: 1, activities: ['טיסה לברצלונה', 'צ׳ק-אין', 'סיור ברמבלס'] },
        { day: 2, activities: ['פארק גואל', 'סגרדה פמיליה', 'חוף ברצלונטה'] },
        { day: 3, activities: ['פורט אוונטורה - פארק שעשועים', 'מופעי ערב'] },
        { day: 4, activities: ['קניות', 'ארוחת בוקר מאוחרת', 'טיסה חזרה'] },
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
        { day: 1, activities: ['טיסה לציריך', 'נסיעה לאינטרלקן', 'צ׳ק-אין'] },
        { day: 2, activities: ['רכבל ליונגפראו', 'ארמון הקרח', 'נוף פנורמי'] },
        { day: 3, activities: ['טיול רגלי באגם בריינץ', 'שייט באגם'] },
        { day: 4, isFree: true, activities: ['יום חופשי'] },
        { day: 5, activities: ['סקי בגרינדלוולד', 'שיעור סקי'] },
        { day: 6, activities: ['ביקור בלוצרן', 'גשר הקפלה', 'אריה לוצרן'] },
        { day: 7, isFree: true, activities: ['יום חופשי'] },
        { day: 8, activities: ['רכבל למאטרהורן', 'צילומים'] },
        { day: 9, activities: ['קניות שוקולד שוויצרי', 'ארוחת פונדו'] },
        { day: 10, activities: ['ארוחת בוקר', 'נסיעה לציריך', 'טיסה חזרה'] },
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
