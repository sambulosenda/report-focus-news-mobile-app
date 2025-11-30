import React, { forwardRef } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { useThemeStore } from '@/src/features/theme';
import type { ShareableArticle } from '../types';
import { stripHtml } from '../utils/stripHtml';

interface ShareCardProps {
  article: ShareableArticle;
}

export const ShareCard = forwardRef<View, ShareCardProps>(({ article }, ref) => {
  const systemTheme = useColorScheme();
  const { theme, isSystemTheme } = useThemeStore();
  const effectiveTheme = isSystemTheme ? systemTheme : theme;
  const isDark = effectiveTheme === 'dark';

  const excerpt = stripHtml(article.excerpt);

  return (
    <View
      ref={ref}
      style={{
        width: 360,
        height: 450,
        backgroundColor: isDark ? '#000' : '#fff',
        borderRadius: 16,
        overflow: 'hidden',
      }}
    >
      {/* Featured Image */}
      {article.imageUrl ? (
        <Image
          source={{ uri: article.imageUrl }}
          style={{ width: '100%', height: 200 }}
          contentFit="cover"
        />
      ) : (
        <LinearGradient
          colors={['#007AFF', '#0055CC']}
          style={{ width: '100%', height: 200 }}
        />
      )}

      {/* Content */}
      <View style={{ flex: 1, padding: 20, justifyContent: 'space-between' }}>
        <View>
          {/* Category Badge */}
          {article.categoryName && (
            <View
              style={{
                alignSelf: 'flex-start',
                backgroundColor: isDark ? 'rgba(0,122,255,0.2)' : '#EBF5FF',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 12,
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: '#007AFF',
                  fontSize: 11,
                  fontWeight: '700',
                  textTransform: 'uppercase',
                  letterSpacing: 0.5,
                }}
              >
                {article.categoryName}
              </Text>
            </View>
          )}

          {/* Title */}
          <Text
            numberOfLines={3}
            style={{
              fontSize: 20,
              fontWeight: '700',
              color: isDark ? '#fff' : '#111',
              lineHeight: 26,
              marginBottom: 10,
            }}
          >
            {article.title}
          </Text>

          {/* Excerpt */}
          {excerpt && (
            <Text
              numberOfLines={3}
              style={{
                fontSize: 14,
                color: isDark ? '#999' : '#666',
                lineHeight: 20,
              }}
            >
              {excerpt}
            </Text>
          )}
        </View>

        {/* Branding */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingTop: 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#222' : '#eee',
          }}
        >
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              backgroundColor: '#007AFF',
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 10,
            }}
          >
            <Text style={{ color: '#fff', fontWeight: '700', fontSize: 14 }}>R</Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontWeight: '600',
              color: isDark ? '#888' : '#666',
            }}
          >
            Report Focus News
          </Text>
        </View>
      </View>
    </View>
  );
});

ShareCard.displayName = 'ShareCard';
