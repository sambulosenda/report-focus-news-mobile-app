<?php
/**
 * REST API endpoints for push notification token management
 */

if (!defined('ABSPATH')) {
    exit;
}

class RFPN_REST_API {

    public static function init() {
        add_action('rest_api_init', array(__CLASS__, 'register_routes'));
    }

    public static function register_routes() {
        register_rest_route('reportfocus/v1', '/push-token', array(
            array(
                'methods' => 'POST',
                'callback' => array(__CLASS__, 'register_token'),
                'permission_callback' => '__return_true',
            ),
            array(
                'methods' => 'DELETE',
                'callback' => array(__CLASS__, 'unregister_token'),
                'permission_callback' => '__return_true',
            ),
        ));

        register_rest_route('reportfocus/v1', '/push-token/preferences', array(
            'methods' => 'PUT',
            'callback' => array(__CLASS__, 'update_preferences'),
            'permission_callback' => '__return_true',
        ));
    }

    public static function register_token($request) {
        $params = $request->get_json_params();

        $token = sanitize_text_field($params['token'] ?? '');
        $platform = sanitize_text_field($params['platform'] ?? '');
        $device_id = sanitize_text_field($params['deviceId'] ?? '');
        $followed_topic_ids = $params['followedTopicIds'] ?? array();
        $breaking_news_enabled = $params['breakingNewsEnabled'] ?? true;

        if (empty($token) || empty($platform)) {
            return new WP_Error('missing_params', 'Token and platform are required', array('status' => 400));
        }

        // Insert/update token
        $token_id = RFPN_Database::insert_token($token, $platform, $device_id, $breaking_news_enabled);

        if (!$token_id) {
            return new WP_Error('db_error', 'Failed to register token', array('status' => 500));
        }

        // Update topic subscriptions
        if (!empty($followed_topic_ids)) {
            RFPN_Database::update_token_topics($token, $followed_topic_ids);
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Token registered successfully',
        ), 200);
    }

    public static function unregister_token($request) {
        $params = $request->get_json_params();
        $token = sanitize_text_field($params['token'] ?? '');

        if (empty($token)) {
            return new WP_Error('missing_token', 'Token is required', array('status' => 400));
        }

        $result = RFPN_Database::delete_token($token);

        if (!$result) {
            return new WP_Error('not_found', 'Token not found', array('status' => 404));
        }

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Token unregistered successfully',
        ), 200);
    }

    public static function update_preferences($request) {
        $params = $request->get_json_params();

        $token = sanitize_text_field($params['token'] ?? '');
        $followed_topic_ids = $params['followedTopicIds'] ?? array();
        $breaking_news_enabled = $params['breakingNewsEnabled'] ?? true;

        if (empty($token)) {
            return new WP_Error('missing_token', 'Token is required', array('status' => 400));
        }

        // Update breaking news preference
        RFPN_Database::update_breaking_news_preference($token, $breaking_news_enabled);

        // Update topic subscriptions
        RFPN_Database::update_token_topics($token, $followed_topic_ids);

        return new WP_REST_Response(array(
            'success' => true,
            'message' => 'Preferences updated successfully',
        ), 200);
    }
}
