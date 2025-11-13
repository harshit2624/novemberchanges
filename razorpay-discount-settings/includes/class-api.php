<?php
/**
 * API class for Razorpay Discount Settings
 */

if (!defined('ABSPATH')) {
    exit;
}

class RazorpayDiscountAPI {

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
        add_action('rest_api_init', array($this, 'register_routes'));
    }

    public function register_routes() {
        register_rest_route('razorpay/v1', '/discount-settings', array(
            array(
                'methods' => 'GET',
                'callback' => array($this, 'get_discount_settings'),
                'permission_callback' => '__return_true',
                'args' => array(),
            ),
            array(
                'methods' => 'POST',
                'callback' => array($this, 'update_discount_settings'),
                'permission_callback' => array($this, 'check_admin_permissions'),
                'args' => array(
                    'discount_percent' => array(
                        'required' => true,
                        'validate_callback' => array($this, 'validate_discount_percent'),
                        'sanitize_callback' => 'floatval',
                    ),
                ),
            ),
        ));
    }

    public function get_discount_settings() {
        $discount_percent = floatval(get_option('razorpay_discount_percent', 0));

        return new WP_REST_Response(array(
            'discount_percent' => $discount_percent,
            'success' => true,
        ), 200);
    }

    public function update_discount_settings($request) {
        $discount_percent = $request->get_param('discount_percent');

        update_option('razorpay_discount_percent', $discount_percent);

        return new WP_REST_Response(array(
            'success' => true,
            'message' => __('Discount settings updated successfully.', 'razorpay-discount'),
            'discount_percent' => $discount_percent,
        ), 200);
    }

    public function check_admin_permissions() {
        return current_user_can('manage_options');
    }

    public function validate_discount_percent($value, $request, $param) {
        $value = floatval($value);

        if ($value < 0 || $value > 100) {
            return new WP_Error('invalid_discount_percent', __('Discount percentage must be between 0 and 100.', 'razorpay-discount'));
        }

        return true;
    }
}
