<?php
/**
 * Database handler for push notification tokens
 */

if (!defined('ABSPATH')) {
    exit;
}

class RFPN_Database {

    public static function init() {
        // Nothing to initialize for now
    }

    public static function create_tables() {
        global $wpdb;

        $charset_collate = $wpdb->get_charset_collate();
        $tokens_table = $wpdb->prefix . 'push_tokens';
        $topics_table = $wpdb->prefix . 'push_token_topics';

        $sql = "CREATE TABLE IF NOT EXISTS $tokens_table (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            token VARCHAR(255) NOT NULL,
            platform VARCHAR(10) NOT NULL,
            device_id VARCHAR(255),
            breaking_news_enabled TINYINT(1) DEFAULT 1,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
            PRIMARY KEY (id),
            UNIQUE KEY token (token)
        ) $charset_collate;

        CREATE TABLE IF NOT EXISTS $topics_table (
            id BIGINT(20) UNSIGNED NOT NULL AUTO_INCREMENT,
            token_id BIGINT(20) UNSIGNED NOT NULL,
            category_id BIGINT(20) UNSIGNED NOT NULL,
            PRIMARY KEY (id),
            KEY token_id (token_id),
            KEY category_id (category_id)
        ) $charset_collate;";

        require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
        dbDelta($sql);
    }

    public static function insert_token($token, $platform, $device_id, $breaking_news_enabled = true) {
        global $wpdb;
        $table = $wpdb->prefix . 'push_tokens';

        // Check if token exists
        $existing = $wpdb->get_row($wpdb->prepare(
            "SELECT id FROM $table WHERE token = %s",
            $token
        ));

        if ($existing) {
            // Update existing
            $wpdb->update(
                $table,
                array(
                    'platform' => $platform,
                    'device_id' => $device_id,
                    'breaking_news_enabled' => $breaking_news_enabled ? 1 : 0,
                ),
                array('token' => $token)
            );
            return $existing->id;
        }

        // Insert new
        $wpdb->insert(
            $table,
            array(
                'token' => $token,
                'platform' => $platform,
                'device_id' => $device_id,
                'breaking_news_enabled' => $breaking_news_enabled ? 1 : 0,
            )
        );

        return $wpdb->insert_id;
    }

    public static function delete_token($token) {
        global $wpdb;
        $tokens_table = $wpdb->prefix . 'push_tokens';
        $topics_table = $wpdb->prefix . 'push_token_topics';

        // Get token ID
        $token_row = $wpdb->get_row($wpdb->prepare(
            "SELECT id FROM $tokens_table WHERE token = %s",
            $token
        ));

        if (!$token_row) {
            return false;
        }

        // Delete topic subscriptions
        $wpdb->delete($topics_table, array('token_id' => $token_row->id));

        // Delete token
        return $wpdb->delete($tokens_table, array('id' => $token_row->id));
    }

    public static function update_token_topics($token, $category_ids) {
        global $wpdb;
        $tokens_table = $wpdb->prefix . 'push_tokens';
        $topics_table = $wpdb->prefix . 'push_token_topics';

        // Get token ID
        $token_row = $wpdb->get_row($wpdb->prepare(
            "SELECT id FROM $tokens_table WHERE token = %s",
            $token
        ));

        if (!$token_row) {
            return false;
        }

        // Delete existing topics
        $wpdb->delete($topics_table, array('token_id' => $token_row->id));

        // Insert new topics
        foreach ($category_ids as $category_id) {
            $wpdb->insert(
                $topics_table,
                array(
                    'token_id' => $token_row->id,
                    'category_id' => intval($category_id),
                )
            );
        }

        return true;
    }

    public static function update_breaking_news_preference($token, $enabled) {
        global $wpdb;
        $table = $wpdb->prefix . 'push_tokens';

        return $wpdb->update(
            $table,
            array('breaking_news_enabled' => $enabled ? 1 : 0),
            array('token' => $token)
        );
    }

    public static function get_tokens_for_breaking_news() {
        global $wpdb;
        $table = $wpdb->prefix . 'push_tokens';

        return $wpdb->get_col(
            "SELECT token FROM $table WHERE breaking_news_enabled = 1"
        );
    }

    public static function get_tokens_for_category($category_id) {
        global $wpdb;
        $tokens_table = $wpdb->prefix . 'push_tokens';
        $topics_table = $wpdb->prefix . 'push_token_topics';

        return $wpdb->get_col($wpdb->prepare(
            "SELECT t.token FROM $tokens_table t
             INNER JOIN $topics_table tt ON t.id = tt.token_id
             WHERE tt.category_id = %d",
            $category_id
        ));
    }
}
