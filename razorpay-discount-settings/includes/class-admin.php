<?php
/**
 * Admin class for Razorpay Discount Settings
 */

if (!defined('ABSPATH')) {
    exit;
}

class RazorpayDiscountAdmin {

    private static $instance = null;

    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }

    private function __construct() {
        $this->init_hooks();
    }

    private function init_hooks() {
        add_action('admin_enqueue_scripts', array($this, 'enqueue_scripts'));
        add_action('wp_ajax_save_razorpay_discount', array($this, 'save_discount_ajax'));
    }

    public function enqueue_scripts($hook) {
        if ('toplevel_page_razorpay-discount' !== $hook) {
            return;
        }

        wp_enqueue_script(
            'razorpay-discount-admin',
            RAZORPAY_DISCOUNT_PLUGIN_URL . 'assets/js/admin.js',
            array('jquery'),
            RAZORPAY_DISCOUNT_VERSION,
            true
        );

        wp_enqueue_style(
            'razorpay-discount-admin',
            RAZORPAY_DISCOUNT_PLUGIN_URL . 'assets/css/admin.css',
            array(),
            RAZORPAY_DISCOUNT_VERSION
        );

        wp_localize_script('razorpay-discount-admin', 'razorpayDiscountAjax', array(
            'ajax_url' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('razorpay_discount_nonce'),
            'strings' => array(
                'saving' => __('Saving...', 'razorpay-discount'),
                'saved' => __('Settings saved successfully!', 'razorpay-discount'),
                'error' => __('Error saving settings.', 'razorpay-discount'),
            ),
        ));
    }

    public function save_discount_ajax() {
        check_ajax_referer('razorpay_discount_nonce', 'nonce');

        if (!current_user_can('manage_options')) {
            wp_die(__('Insufficient permissions'));
        }

        $discount_percent = isset($_POST['discount_percent']) ? floatval($_POST['discount_percent']) : 0;

        // Validate range
        if ($discount_percent < 0 || $discount_percent > 100) {
            wp_send_json_error(array('message' => __('Discount percentage must be between 0 and 100.', 'razorpay-discount')));
        }

        update_option('razorpay_discount_percent', $discount_percent);

        wp_send_json_success(array(
            'message' => __('Settings saved successfully!', 'razorpay-discount'),
            'discount_percent' => $discount_percent
        ));
    }
}
