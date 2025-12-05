import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  Modal,
  Pressable,
  ActivityIndicator,
  Share,
} from 'react-native';
import * as Haptics from 'expo-haptics';
import * as Sharing from 'expo-sharing';
import { captureRef } from 'react-native-view-shot';
import * as FileSystem from 'expo-file-system';
import { ShareCard } from './ShareCard';
import { useEffectiveTheme } from '@/src/features/theme';
import type { ShareableArticle } from '../types';
import { Icon } from '@/src/shared/components';

interface ShareModalProps {
  visible: boolean;
  onClose: () => void;
  article: ShareableArticle;
}

export function ShareModal({ visible, onClose, article }: ShareModalProps) {
  const { isDark } = useEffectiveTheme();
  const cardRef = useRef<View>(null);
  const [isSharing, setIsSharing] = useState(false);

  const handleShareImage = async () => {
    if (!cardRef.current) return;

    setIsSharing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    let tempUri: string | null = null;

    try {
      tempUri = await captureRef(cardRef, {
        format: 'png',
        quality: 1,
      });

      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(tempUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share Article',
        });
      }
      onClose();
    } catch (error) {
      console.warn('Share image failed:', error);
    } finally {
      setIsSharing(false);
      // Clean up temp file
      if (tempUri) {
        try {
          await FileSystem.deleteAsync(tempUri, { idempotent: true });
        } catch (deleteError) {
          console.warn('Failed to delete temp file:', deleteError);
        }
      }
    }
  };

  const handleShareLink = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    try {
      await Share.share({
        message: article.title,
        url: article.url,
        title: article.title,
      });
      onClose();
    } catch (error) {
      console.warn('Share link failed:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.7)',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <View
          style={{
            backgroundColor: isDark ? '#1c1c1e' : '#fff',
            borderRadius: 20,
            padding: 20,
            width: '90%',
            maxWidth: 400,
          }}
        >
          {/* Header */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 16,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: '700',
                color: isDark ? '#fff' : '#000',
              }}
            >
              Share Article
            </Text>
            <Pressable onPress={onClose} hitSlop={10}>
              <Icon
                name="close-circle"
                size={28}
                color={isDark ? '#666' : '#999'}
              />
            </Pressable>
          </View>

          {/* Card Preview */}
          <View
            style={{
              alignItems: 'center',
              marginBottom: 20,
              transform: [{ scale: 0.85 }],
              marginVertical: -30,
            }}
          >
            <ShareCard ref={cardRef} article={article} />
          </View>

          {/* Share Buttons */}
          <View style={{ gap: 12 }}>
            <Pressable
              onPress={handleShareImage}
              disabled={isSharing}
              style={{
                backgroundColor: '#007AFF',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 14,
                borderRadius: 12,
                opacity: isSharing ? 0.7 : 1,
              }}
            >
              {isSharing ? (
                <ActivityIndicator color="#fff" style={{ marginRight: 8 }} />
              ) : (
                <Icon
                  name="image"
                  size={20}
                  color="#fff"
                  style={{ marginRight: 8 }}
                />
              )}
              <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>
                Share as Image
              </Text>
            </Pressable>

            <Pressable
              onPress={handleShareLink}
              style={{
                backgroundColor: isDark ? '#333' : '#f0f0f0',
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 14,
                borderRadius: 12,
              }}
            >
              <Icon
                name="link"
                size={20}
                color={isDark ? '#fff' : '#000'}
                style={{ marginRight: 8 }}
              />
              <Text
                style={{
                  color: isDark ? '#fff' : '#000',
                  fontSize: 16,
                  fontWeight: '600',
                }}
              >
                Share Link
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
