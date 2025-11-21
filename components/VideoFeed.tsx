import React from 'react';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';

// ✅ Add prop type
type VideoFeedProps = {
  filter?: 'All' | 'Trips' | 'Lodging' | 'Entertainment';
};

export default function VideoFeed({ filter = 'All' }: VideoFeedProps) {
  const data = [
    {
      id: '1',
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      category: 'Trips',
    },
    {
      id: '2', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
      category: 'Lodging' 
    },
    {
      id: '3', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
      category: 'Entertainment' 
    },
    {
      id: '4', 
      uri: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4', 
      category: 'Trips' 
    },
  ];

  // ✅ Optional filtering logic (keeps it future-ready)
  const filteredData = filter === 'All' ? data : data.filter((item) => item.category === filter);

  return (
    <FlashList
      data={filteredData}
      renderItem={({ item }) => <VideoItem uri={item.uri} />}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
}
