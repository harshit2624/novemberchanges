=== Razorpay Discount Settings ===

Contributors: yourname
Tags: razorpay, discount, payment, woocommerce
Requires at least: 5.0
Tested up to: 6.4
Stable tag: 1.0.0
Requires PHP: 7.0
License: GPLv2 or later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Manage discount percentage for Razorpay payments in WooCommerce checkout.

== Description ==

This plugin allows you to set a discount percentage that will be applied when customers choose Razorpay as their payment method during checkout. The discount is displayed in real-time and applied to the order total.

Features:
* Easy-to-use admin interface to set discount percentage
* Real-time discount calculation and display
* REST API endpoint for frontend integration
* Compatible with WooCommerce

== Installation ==

1. Upload the plugin files to the `/wp-content/plugins/razorpay-discount-settings` directory, or install the plugin through the WordPress plugins screen directly.
2. Activate the plugin through the 'Plugins' screen in WordPress.
3. Go to Settings > Razorpay Discount to configure the discount percentage.

== Usage ==

1. After activation, go to the admin menu "Razorpay Discount".
2. Set the discount percentage (0-100).
3. Save the settings.
4. The discount will be automatically applied when customers select Razorpay payment method.

== API Usage ==

The plugin provides a REST API endpoint to retrieve discount settings:

GET /wp-json/razorpay/v1/discount-settings

Response:
{
    "discount_percent": 5.0,
    "success": true
}

== Changelog ==

= 1.0.0 =
* Initial release
* Admin interface for setting discount percentage
* REST API endpoint
* Frontend integration ready

== Frequently Asked Questions ==

= How do I set the discount percentage? =

Go to WordPress Admin > Razorpay Discount and enter the desired percentage.

= Is this compatible with all themes? =

The plugin provides API endpoints, so it should work with any theme that integrates with the API.

= Can I set different discounts for different products? =

Currently, the plugin applies a global discount for Razorpay payments. Product-specific discounts would require additional development.

== Upgrade Notice ==

= 1.0.0 =
Initial release. No upgrade needed.
