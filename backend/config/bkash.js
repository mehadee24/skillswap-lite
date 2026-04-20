/**
 * bKash Sandbox Configuration
 * Demo payment gateway for testing
 */

const bKashConfig = {
    // Sandbox Credentials (Replace with your actual sandbox credentials)
    username: "your_username",
    password: "your_password",
    app_key: "your_app_key",
    app_secret: "your_app_secret",
    
    // API Endpoints
    grantTokenUrl: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/token/grant',
    createCheckoutUrl: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/create',
    executeCheckoutUrl: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/execute',
    queryPaymentUrl: 'https://checkout.sandbox.bka.sh/v1.2.0-beta/checkout/payment/query',
    
    // Demo credentials (for testing)
    demoNumber: "01968930713",
    demoPin: "12345"
};

module.exports = bKashConfig;