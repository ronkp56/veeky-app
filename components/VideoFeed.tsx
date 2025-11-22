import React, { useMemo } from 'react';
import { Dimensions } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import VideoItem from './VideoItem';

type VideoFeedProps = {
  filter?: 'All' | 'Trips' | 'Lodging' | 'Entertainment';
};

type VideoData = {
  id: string;
  uri: string;
  category: 'Trips' | 'Lodging' | 'Entertainment';
};

const MOCK_DATA: VideoData[] = [
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

export default function VideoFeed({ filter = 'All' }: VideoFeedProps) {
  const filteredData = useMemo(
    () => filter === 'All' ? MOCK_DATA : MOCK_DATA.filter((item) => item.category === filter),
    [filter]
  );

  return (
    <FlashList
      data={filteredData}
      renderItem={({ item }) => <VideoItem uri={item.uri} />}
      estimatedItemSize={Dimensions.get('window').height}
      pagingEnabled
      showsVerticalScrollIndicator={false}
      keyExtractor={(item) => item.id}
    />
  );
}
