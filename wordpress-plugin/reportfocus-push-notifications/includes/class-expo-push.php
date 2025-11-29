<?php
/**
 * Expo Push Notification API client
 */

if (!defined('ABSPATH')) {
    exit;
}

class RFPN_Expo_Push {

    const EXPO_PUSH_URL = 'https://exp.host/--/api/v2/push/send';
    const BATCH_SIZE = 100;

    /**
     * Send push notifications to multiple tokens
     */
    public static function send($tokens, $title, $body, $data = array(), $channel_id = 'topic-updates') {
        if (empty($tokens)) {
            return array('success' => true, 'sent' => 0);
        }

        // Remove duplicates
        $tokens = array_unique($tokens);

        // Process in batches
        $batches = array_chunk($tokens, self::BATCH_SIZE);
        $total_sent = 0;
        $errors = array();

        foreach ($batches as $batch) {
            $messages = array();

            foreach ($batch as $token) {
                $message = array(
                    'to' => $token,
                    'sound' => 'default',
                    'title' => $title,
                    'body' => $body,
                    'data' => $data,
                    'channelId' => $channel_id,
                );

                $messages[] = $message;
            }

            $response = wp_remote_post(self::EXPO_PUSH_URL, array(
                'headers' => array(
                    'Accept' => 'application/json',
                    'Accept-Encoding' => 'gzip, deflate',
                    'Content-Type' => 'application/json',
                ),
                'body' => json_encode($messages),
                'timeout' => 30,
            ));

            if (is_wp_error($response)) {
                $errors[] = $response->get_error_message();
                continue;
            }

            $body = wp_remote_retrieve_body($response);
            $result = json_decode($body, true);

            if (isset($result['data'])) {
                foreach ($result['data'] as $ticket) {
                    if ($ticket['status'] === 'ok') {
                        $total_sent++;
                    } else {
                        $errors[] = $ticket['message'] ?? 'Unknown error';
                    }
                }
            }
        }

        return array(
            'success' => empty($errors),
            'sent' => $total_sent,
            'errors' => $errors,
        );
    }

    /**
     * Send breaking news notification
     */
    public static function send_breaking_news($post_id, $title, $body, $image_url = null) {
        $tokens = RFPN_Database::get_tokens_for_breaking_news();

        $data = array(
            'articleId' => strval($post_id),
            'type' => 'breaking',
        );

        if ($image_url) {
            $data['imageUrl'] = $image_url;
        }

        return self::send($tokens, 'Breaking: ' . $title, $body, $data, 'breaking-news');
    }

    /**
     * Send topic notification
     */
    public static function send_topic_notification($post_id, $category_ids, $title, $body, $image_url = null) {
        $all_tokens = array();

        foreach ($category_ids as $category_id) {
            $tokens = RFPN_Database::get_tokens_for_category($category_id);
            $all_tokens = array_merge($all_tokens, $tokens);
        }

        $all_tokens = array_unique($all_tokens);

        $data = array(
            'articleId' => strval($post_id),
            'type' => 'topic',
            'categoryId' => strval($category_ids[0] ?? ''),
        );

        if ($image_url) {
            $data['imageUrl'] = $image_url;
        }

        return self::send($all_tokens, $title, $body, $data, 'topic-updates');
    }
}
