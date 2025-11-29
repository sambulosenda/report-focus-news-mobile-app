<?php
/**
 * Notification sender - hooks into post publishing
 */

if (!defined('ABSPATH')) {
    exit;
}

class RFPN_Notification_Sender {

    public static function init() {
        add_action('transition_post_status', array(__CLASS__, 'on_post_publish'), 10, 3);
    }

    /**
     * Send notification when a post is published
     */
    public static function on_post_publish($new_status, $old_status, $post) {
        // Only trigger on new publications
        if ($new_status !== 'publish' || $old_status === 'publish') {
            return;
        }

        // Only for posts
        if ($post->post_type !== 'post') {
            return;
        }

        // Get post data
        $title = $post->post_title;
        $excerpt = wp_strip_all_tags(get_the_excerpt($post));
        if (empty($excerpt)) {
            $excerpt = wp_trim_words(wp_strip_all_tags($post->post_content), 20, '...');
        }

        // Get featured image
        $image_url = get_the_post_thumbnail_url($post->ID, 'medium');

        // Get categories
        $categories = wp_get_post_categories($post->ID);

        // Check if breaking news (using custom field or specific category)
        $is_breaking = self::is_breaking_news($post->ID, $categories);

        if ($is_breaking) {
            // Send breaking news notification to all subscribers
            RFPN_Expo_Push::send_breaking_news($post->ID, $title, $excerpt, $image_url);
        } else {
            // Send topic notification to category subscribers
            if (!empty($categories)) {
                RFPN_Expo_Push::send_topic_notification($post->ID, $categories, $title, $excerpt, $image_url);
            }
        }
    }

    /**
     * Check if post is breaking news
     */
    private static function is_breaking_news($post_id, $categories) {
        // Option 1: Check custom field
        $breaking_meta = get_post_meta($post_id, '_is_breaking_news', true);
        if ($breaking_meta === '1' || $breaking_meta === 'yes' || $breaking_meta === true) {
            return true;
        }

        // Option 2: Check if post has "Breaking News" category (customize slug as needed)
        $breaking_category = get_category_by_slug('breaking-news');
        if ($breaking_category && in_array($breaking_category->term_id, $categories)) {
            return true;
        }

        return false;
    }
}
