import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';

type VideoFeedProps = {
  filter?: 'All' | 'Trips' | 'Lodging' | 'Entertainment';
};

export type VideoData = {
  id: string;
  uri: string;
  category: 'Trips' | 'Lodging' | 'Entertainment';
  influencer: {
    name: string;
    avatar: string;
    verified: boolean;
  };
  title: string;
  location: string;
  price: string;
  likes: number;
  comments: number;
  shares: number;
};

export const MOCK_DATA: VideoData[] = [
    {
      id: '1',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category: 'Trips',
      influencer: { name: 'Sarah Travel', avatar: '👩', verified: true },
      title: 'חופשה מדהימה ביוון 🇬🇷',
      location: 'Santorini, Greece',
      price: '₪3,500',
      likes: 12500,
      comments: 340,
      shares: 89,
    },
    {
      id: '2', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
      category: 'Lodging',
      influencer: { name: 'David Hotels', avatar: '👨', verified: true },
      title: 'מלון יוקרה בדובאי ✨',
      location: 'Dubai, UAE',
      price: '₪8,900',
      likes: 23400,
      comments: 567,
      shares: 234,
    },
    {
      id: '3', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
      category: 'Entertainment',
      influencer: { name: 'Maya Fun', avatar: '👧', verified: false },
      title: 'פארק שעשועים בברצלונה 🎢',
      location: 'Barcelona, Spain',
      price: '₪2,200',
      likes: 8900,
      comments: 156,
      shares: 45,
    },
    {
      id: '4', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 
      category: 'Trips',
      influencer: { name: 'Tom Adventures', avatar: '🧔', verified: true },
      title: 'טיול בהרי האלפים 🏔️',
      location: 'Swiss Alps',
      price: '₪5,600',
      likes: 18700,
      comments: 423,
      shares: 167,
    },
  ];

export default function VideoFeed({ filter = 'All' }: VideoFeedProps) {
  const filteredData = useMemo(
    () => filter === 'All' ? MOCK_DATA : MOCK_DATA.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <FlashList
      data={filteredData}
      renderItem={({ item }) => <VideoItem video={item} />}
      estimatedItemSize={Dimensions.get('window').height}
      pagingEnabled
      snapToInterval={Dimensions.get('window').height}
      snapToAlignment="start"
      decelerationRate="fast"
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
}
