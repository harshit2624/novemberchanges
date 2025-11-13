jQuery(document).ready(function($) {
    'use strict';

    // Handle form submission via AJAX
    $('#razorpay-discount-form').on('submit', function(e) {
        e.preventDefault();

        var $form = $(this);
        var $submitBtn = $form.find('input[type="submit"]');
        var originalText = $submitBtn.val();

        // Disable button and show loading
        $submitBtn.prop('disabled', true).val(razorpayDiscountAjax.strings.saving);

        // Get form data
        var discountPercent = $('input[name="razorpay_discount_percent"]').val();

        // Send AJAX request
        $.ajax({
            url: razorpayDiscountAjax.ajax_url,
            type: 'POST',
            data: {
                action: 'save_razorpay_discount',
                discount_percent: discountPercent,
                nonce: razorpayDiscountAjax.nonce
            },
            success: function(response) {
                if (response.success) {
                    // Show success message
                    showNotice(response.data.message, 'success');

                    // Update displayed value
                    $('input[name="razorpay_discount_percent"]').val(response.data.discount_percent);
                } else {
                    // Show error message
                    showNotice(response.data.message || razorpayDiscountAjax.strings.error, 'error');
                }
            },
            error: function() {
                showNotice(razorpayDiscountAjax.strings.error, 'error');
            },
            complete: function() {
                // Re-enable button
                $submitBtn.prop('disabled', false).val(originalText);
            }
        });
    });

    // Utility function to show notices
    function showNotice(message, type) {
        // Remove existing notices
        $('.razorpay-discount-notice').remove();

        // Create notice element
        var $notice = $('<div class="razorpay-discount-notice notice notice-' + type + ' is-dismissible"><p>' + message + '</p></div>');

        // Add dismiss functionality
        $notice.on('click', '.notice-dismiss', function() {
            $notice.fadeOut();
        });

        // Insert notice at the top of the form
        $('.wrap h1').after($notice);

        // Auto-dismiss after 5 seconds
        setTimeout(function() {
            $notice.fadeOut();
        }, 5000);
    }

    // Validate input on change
    $('input[name="razorpay_discount_percent"]').on('input', function() {
        var value = parseFloat($(this).val());

        if (value < 0) {
            $(this).val(0);
        } else if (value > 100) {
            $(this).val(100);
        }
    });
});
