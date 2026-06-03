'use client';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[100px] pointer-events-none z-0"></div>

      {/* Header */}
      <div className="bg-secondary border-b border-border relative z-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-black font-heading uppercase tracking-widest text-text-primary mb-4 sm:mb-6">
            Terms of <span className="text-primary drop-shadow-[0_0_10px_rgba(0,158,227,0.2)]">Service</span>
          </h1>
          <p className="text-text-secondary max-w-2xl mx-auto text-base sm:text-lg font-medium tracking-wide">
            Please read these terms carefully before using the ApexFled digital products store. By accessing and purchasing products, you agree to these terms.
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

          {/* 1. Introduction */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              1. Introduction
            </h2>
            <p className="text-text-secondary leading-relaxed">
              ApexFled ("we," "us," "our," or "Company") provides a digital products marketplace. These Terms of Service ("Terms") govern your use of our website, services, and all products offered through our platform. If you do not agree to these terms, please do not use our service.
            </p>
          </section>

          {/* 2. Digital Products */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              2. Digital Products
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              All products sold on ApexFled are digital goods, including but not limited to software, tools, resources, templates, and digital content. Digital products are delivered electronically to your registered email address after successful payment.
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Products are verified before sale to ensure quality and functionality.</li>
              <li>All products come with a replacement guarantee.</li>
              <li>Product delivery is typically instantaneous via email.</li>
            </ul>
          </section>

          {/* 3. Orders and Payments */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              3. Orders and Payments
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              When you place an order:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>You represent that you are at least 18 years old and legally able to enter into transactions.</li>
              <li>You agree to provide accurate and complete information.</li>
              <li>Payments are processed securely through Mercado Pago.</li>
              <li>We do not store credit card details — all payment processing is handled by our payment provider.</li>
              <li>Prices are in the currency displayed and are subject to applicable taxes.</li>
            </ul>
          </section>

          {/* 4. Delivery of Digital Items */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              4. Delivery of Digital Items
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              After successful payment:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>An order confirmation email will be sent to your registered email address.</li>
              <li>Digital products are typically delivered instantly via email.</li>
              <li>If delivery does not arrive within 2 hours, please contact our support team immediately.</li>
              <li>You are responsible for providing a valid email address.</li>
            </ul>
          </section>

          {/* 5. Product Guarantee */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              5. Product Guarantee
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              All digital products purchased on ApexFled come with a working product guarantee:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Products are verified to be functional at the time of sale.</li>
              <li>If a product does not work as described, you are eligible for a replacement.</li>
              <li>The guarantee covers functionality issues and delivery failures.</li>
              <li>Guarantee does not cover user errors or misuse of products.</li>
            </ul>
          </section>

          {/* 6. Replacement and Support */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              6. Replacement and Support
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              If you experience issues with your digital product:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Submit a support ticket through our support page detailing the issue.</li>
              <li>Our support team will review your request and respond within 24 hours.</li>
              <li>If the product cannot be fixed, we will provide a replacement or alternative product.</li>
              <li>Replacement requests must be submitted within 14 days of purchase.</li>
            </ul>
          </section>

          {/* 7. Customer Responsibility */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              7. Customer Responsibility
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              By purchasing products, you agree:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>To use products solely for lawful purposes and in accordance with all applicable laws.</li>
              <li>Not to resell, redistribute, or share products without authorization.</li>
              <li>To respect intellectual property rights and product licensing terms.</li>
              <li>To keep your account information secure and confidential.</li>
              <li>That you are responsible for your own compliance with local laws and regulations.</li>
            </ul>
          </section>

          {/* 8. Refund Policy */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              8. Refund Policy
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              Due to the nature of digital products:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Products are non-refundable once delivered and confirmed as received.</li>
              <li>If you experience technical issues, we offer replacements instead of refunds.</li>
              <li>Refunds may be issued for payment failures or erroneous charges at our discretion.</li>
              <li>Contact our support team to discuss exceptional circumstances.</li>
            </ul>
          </section>

          {/* 9. Account Usage Rules */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              9. Account Usage Rules
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              When using ApexFled:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>You must provide accurate and truthful information.</li>
              <li>You will not attempt to gain unauthorized access to our systems.</li>
              <li>You will not engage in fraudulent or deceptive practices.</li>
              <li>You will not use automated tools to scrape or collect data without permission.</li>
              <li>We reserve the right to suspend or terminate accounts that violate these rules.</li>
            </ul>
          </section>

          {/* 10. Contact and Support */}
          <section>
            <h2 className="text-2xl font-black font-heading uppercase tracking-wider text-text-primary mb-4">
              10. Contact and Support
            </h2>
            <p className="text-text-secondary leading-relaxed mb-3">
              For questions about these Terms or to report issues:
            </p>
            <ul className="list-disc list-inside space-y-2 text-text-secondary">
              <li>Visit our Support page at /support</li>
              <li>Submit a support ticket with your question or concern</li>
              <li>Our support team responds within 24 hours</li>
              <li>For urgent matters, include "URGENT" in your ticket subject</li>
            </ul>
          </section>

          {/* Disclaimer */}
          <div className="mp-card p-6 bg-amber-50/10 border border-amber-500/20 rounded-xl">
            <p className="text-sm text-text-secondary font-medium">
              <span className="font-bold text-text-primary block mb-2">⚖️ Legal Review Note:</span>
              These Terms of Service are provided as a standard template for a digital products marketplace. We recommend that you have these terms reviewed by a qualified legal professional in your jurisdiction before public launch to ensure compliance with all applicable laws and regulations in your region.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
