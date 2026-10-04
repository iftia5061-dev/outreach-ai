export default function SupportPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Support</h1>
        
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Get Help</h2>
            <p className="text-gray-700 mb-4">
              Our support team is here to help you with any questions or issues you may have.
            </p>
            <div className="space-y-2">
              <p className="text-gray-700">
                <strong>Email:</strong> support@outreachai.com
              </p>
              <p className="text-gray-700">
                <strong>Response Time:</strong> Within 24 hours
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-gray-900">How do I upgrade my plan?</h3>
                <p className="text-gray-700">
                  Go to the Billing page and click "Change Plan" to upgrade or downgrade your subscription.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Can I cancel anytime?</h3>
                <p className="text-gray-700">
                  Yes, you can cancel your subscription at any time. Your access will continue until the end of your billing period.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">What happens if I exceed my limits?</h3>
                <p className="text-gray-700">
                  You'll need to upgrade to a higher plan to add more prospects or clients. We'll notify you when you're approaching your limits.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
