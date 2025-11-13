<?php
/**
 * Plugin Name: Razorpay Discount Settings
 * Description: Manage discount percentage for Razorpay payments
 * Version: 1.0.0
 * Author: Your Name
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('RAZORPAY_DISCOUNT_VERSION', '1.0.0');
define('RAZORPAY_DISCOUNT_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('RAZORPAY_DISCOUNT_PLUGIN_URL', plugin_dir_url(__FILE__));

// Include admin class
require_once RAZORPAY_DISCOUNT_PLUGIN_DIR . 'includes/class-admin.php';

// Include API class
require_once RAZORPAY_DISCOUNT_PLUGIN_DIR . 'includes/class-api.php';

// Initialize admin and API classes
RazorpayDiscountAdmin::get_instance();
RazorpayDiscountAPI::get_instance();

// Initialize the plugin
class RazorpayDiscountSettings {

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
        add_action('init', array($this, 'load_textdomain'));
        add_action('admin_menu', array($this, 'add_admin_menu'));
        add_action('admin_init', array($this, 'register_settings'));
        add_action('rest_api_init', array($this, 'register_rest_routes'));
    }

    public function load_textdomain() {
        load_plugin_textdomain('razorpay-discount', false, dirname(plugin_basename(__FILE__)) . '/languages/');
    }

    public function add_admin_menu() {
        add_menu_page(
            __('Razorpay Discount', 'razorpay-discount'),
            __('Razorpay Discount', 'razorpay-discount'),
            'manage_options',
            'razorpay-discount',
            array($this, 'admin_page'),
            'dashicons-money-alt',
            30
        );
    }

    public function register_settings() {
        register_setting(
            'razorpay_discount_settings',
            'razorpay_discount_percent',
            array(
                'type' => 'number',
                'default' => 0,
                'sanitize_callback' => array($this, 'sanitize_discount_percent')
            )
        );
    }

    public function sanitize_discount_percent($value) {
        $value = floatval($value);
        if ($value < 0) {
            $value = 0;
        }
        if ($value > 100) {
            $value = 100;
        }
        return $value;
    }

    public function admin_page() {
        if (!current_user_can('manage_options')) {
            wp_die(__('You do not have sufficient permissions to access this page.'));
        }

        $discount_percent = get_option('razorpay_discount_percent', 0);

        ?>
        <div class="wrap">
            <h1><?php _e('Razorpay Discount Settings', 'razorpay-discount'); ?></h1>

            <div class="razorpay-discount-settings-form">
                <form id="razorpay-discount-form" method="post">
                    <table class="form-table">
                        <tr valign="top">
                            <th scope="row">
                                <?php _e('Discount Percentage', 'razorpay-discount'); ?>
                            </th>
                            <td>
                                <input type="number"
                                       name="razorpay_discount_percent"
                                       value="<?php echo esc_attr($discount_percent); ?>"
                                       min="0"
                                       max="100"
                                       step="0.01"
                                       class="regular-text" />
                                <p class="description">
                                    <?php _e('Enter the discount percentage for Razorpay payments (0-100).', 'razorpay-discount'); ?>
                                </p>
                            </td>
                        </tr>
                    </table>

                    <p class="submit">
                        <input type="submit"
                               name="submit"
                               id="submit"
                               class="button button-primary"
                               value="<?php _e('Save Changes', 'razorpay-discount'); ?>" />
                    </p>
                </form>
            </div>

            <div class="razorpay-discount-preview">
                <h4><?php _e('Preview', 'razorpay-discount'); ?></h4>
                <p><?php _e('Current discount percentage:', 'razorpay-discount'); ?> <span class="preview-amount"><?php echo esc_html($discount_percent); ?>%</span></p>
                <p><?php _e('API Endpoint:', 'razorpay-discount'); ?> <code><?php echo esc_url(rest_url('razorpay/v1/discount-settings')); ?></code></p>
            </div>
        </div>
        <?php
    }

    public function register_rest_routes() {
        register_rest_route('razorpay/v1', '/discount-settings', array(
            'methods' => 'GET',
            'callback' => array($this, 'get_discount_settings'),
            'permission_callback' => '__return_true', // Public endpoint
        ));
    }

    public function get_discount_settings() {
        $discount_percent = floatval(get_option('razorpay_discount_percent', 0));

        return new WP_REST_Response(array(
            'discount_percent' => $discount_percent
        ), 200);
    }
}

// Initialize the plugin
function razorpay_discount_settings_init() {
    return RazorpayDiscountSettings::get_instance();
}

// Start the plugin
add_action('plugins_loaded', 'razorpay_discount_settings_init');
