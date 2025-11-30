import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import type { VideoInfo } from '../types';

interface VideoPlayerProps {
  videoInfo: VideoInfo;
}

export function VideoPlayer({ videoInfo }: VideoPlayerProps) {
  const player = useVideoPlayer(videoInfo.url, player => {
    player.loop = false;
  });

  return (
    <View className="aspect-video bg-black">
      <VideoView
        player={player}
        style={{ flex: 1 }}
        allowsFullscreen
        allowsPictureInPicture
      />
    </View>
  );
}
