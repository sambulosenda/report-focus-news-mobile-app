<?php
/**
 * Plugin Name: Report Focus Push Notifications
 * Description: Push notification system for Report Focus News mobile app using Expo Push Notifications
 * Version: 1.0.0
 * Author: Report Focus
 */

if (!defined('ABSPATH')) {
    exit;
}

define('RFPN_VERSION', '1.0.0');
define('RFPN_PLUGIN_DIR', plugin_dir_path(__FILE__));

// Include required files
require_once RFPN_PLUGIN_DIR . 'includes/class-database.php';
require_once RFPN_PLUGIN_DIR . 'includes/class-rest-api.php';
require_once RFPN_PLUGIN_DIR . 'includes/class-expo-push.php';
require_once RFPN_PLUGIN_DIR . 'includes/class-notification-sender.php';

class ReportFocus_Push_Notifications {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        // Initialize components
        RFPN_Database::init();
        RFPN_REST_API::init();
        RFPN_Notification_Sender::init();

        // Activation hook
        register_activation_hook(__FILE__, array($this, 'activate'));
    }

    public function activate() {
        RFPN_Database::create_tables();
    }
}

// Initialize plugin
add_action('plugins_loaded', array('ReportFocus_Push_Notifications', 'get_instance'));
