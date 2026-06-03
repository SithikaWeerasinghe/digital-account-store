'use client';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="bg-secondary border-b border-border relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-widest text-text-primary mb-4 sm:mb-6">
            Privacy <span className="text-primary drop-shadow-[0_0_10px_rgba(0,158,227,0.2)]">Policy</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg font-medium tracking-wide">
            We are committed to protecting your privacy. This policy explains how we collect, use, and safeguard your information.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 relative z-10">
        <div className="prose prose-invert max-w-none space-y-8">

          {/* Last Updated Note */}
          <div className="mp-card p-6 bg-primary/5 border border-primary/20 rounded-xl">
            <p className="text-sm text-text-secondary font-medium">
              <span className="font-bold text-text-primary">Last Updated:</span> June 2026
            </p>
          </div>

          {/* 1. Information We Collect */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              1. Information We Collect
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We collect information you provide directly to us:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li><strong>Account Information:</strong> Name, email address, and account credentials when you create an account.</li>
              <li><strong>Order Information:</strong> Product selection, quantity, and purchase history.</li>
              <li><strong>Contact Information:</strong> Email address used for order confirmations and support communications.</li>
              <li><strong>Support Information:</strong> Messages, attachments, and details provided in support tickets.</li>
            </ul>
          </section>

          {/* 2. How We Use Information */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              2. How We Use Information
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We use the information we collect for:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Processing your orders and delivering digital products.</li>
              <li>Sending order confirmations and delivery notifications.</li>
              <li>Responding to your support requests and inquiries.</li>
              <li>Improving our products and services.</li>
              <li>Detecting and preventing fraud.</li>
              <li>Complying with legal obligations.</li>
            </ul>
          </section>

          {/* 3. Orders and Payment Data */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              3. Orders and Payment Data
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              <strong>Important:</strong> ApexFled does not store, process, or have access to credit card information. All payment processing is handled securely by Mercado Pago, our payment provider. We only receive order confirmation and payment status information.
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Payment details are processed directly by Mercado Pago.</li>
              <li>We store your order history and purchase records in Supabase for order management.</li>
              <li>Order data includes product purchased, amount, date, and delivery status.</li>
              <li>Your payment method information is never stored on our servers.</li>
            </ul>
          </section>

          {/* 4. Email Notifications */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              4. Email Notifications
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We send transactional emails via Resend email service:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Order confirmation emails with product delivery details.</li>
              <li>Payment status notifications.</li>
              <li>Support ticket responses.</li>
              <li>Account-related notifications (if applicable).</li>
              <li>You can control email preferences in your account settings.</li>
            </ul>
          </section>

          {/* 5. Support Tickets */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              5. Support Tickets
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              When you submit a support ticket:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Your name, email, and message are stored in our support system.</li>
              <li>Supporting documents or attachments may be attached to your ticket.</li>
              <li>Our support team reviews your request and responds to your email.</li>
              <li>Ticket history is kept for up to 1 year for reference.</li>
              <li>You can request deletion of your support history at any time.</li>
            </ul>
          </section>

          {/* 6. Data Security */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              6. Data Security
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              We implement industry-standard security measures:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>HTTPS encryption for all data in transit.</li>
              <li>Secure database storage via Supabase with encryption at rest.</li>
              <li>Access controls and authentication to prevent unauthorized access.</li>
              <li>Regular security reviews and updates.</li>
              <li>No passwords or sensitive data is logged in plain text.</li>
            </ul>
          </section>

          {/* 7. Third-Party Services */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              7. Third-Party Services
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              ApexFled uses the following third-party services:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li><strong>Supabase:</strong> Database and data storage for orders, accounts, and support information.</li>
              <li><strong>Mercado Pago:</strong> Payment processing for all transactions. We do not have access to payment details.</li>
              <li><strong>Resend:</strong> Email service for order confirmations and notifications.</li>
              <li><strong>Vercel:</strong> Web hosting and deployment platform.</li>
            </ul>
            <p className="text-text-secondary leading-relaxed mt-3">
              These services have their own privacy policies. We recommend reviewing their policies at their respective websites.
            </p>
          </section>

          {/* 8. Customer Rights */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              8. Customer Rights
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              You have the following rights regarding your personal data:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
              <li><strong>Correction:</strong> Request corrections to inaccurate or incomplete information.</li>
              <li><strong>Deletion:</strong> Request deletion of your personal data (subject to legal requirements).</li>
              <li><strong>Opt-Out:</strong> Unsubscribe from marketing communications at any time.</li>
              <li><strong>Portability:</strong> Request your data in a portable format.</li>
            </ul>
          </section>

          {/* 9. Contact Information */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              9. Contact Information
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              If you have questions or concerns about this Privacy Policy or our privacy practices:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Visit our Support page at /support</li>
              <li>Submit a support ticket with your privacy-related question</li>
              <li>Include "PRIVACY" in the subject line for priority review</li>
              <li>Our support team will respond within 24 hours</li>
            </ul>
          </section>

          {/* Policy Changes */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              Changes to This Policy
            </h2>
            <p className="text-text-secondary leading-relaxed">
              We may update this Privacy Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify users of material changes via email or through prominent notice on our website. Your continued use of ApexFled after such changes constitutes your acceptance of the updated policy.
            </p>
          </section>

          {/* Disclaimer */}
          <div className="mp-card p-6 bg-amber-50/10 border border-amber-500/20 rounded-xl">
            <p className="text-sm text-text-secondary font-medium">
              <span className="font-bold text-text-primary block mb-2">⚖️ Legal Review Note:</span>
              This Privacy Policy is provided as a standard template. We recommend that you have this policy reviewed by a qualified legal professional in your jurisdiction before public launch to ensure compliance with GDPR, CCPA, and other applicable data protection regulations in your region.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
