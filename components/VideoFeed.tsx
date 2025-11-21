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
      uri: 'https://res.cloudinary.com/dmxzi7dvx/video/upload/v1755583223/zwbbwckjrgjcrih4iuxj.mp4',
      category: 'Trips',
    },
    { id: '2', uri: 'https://www.w3schools.com/html/movie.mp4', category: 'Lodging' },
    { id: '3', uri: 'https://www.w3schools.com/html/mov_bbb.mp4', category: 'Entertainment' },
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
