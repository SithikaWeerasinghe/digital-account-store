const steps = [
  {
    step: '01',
    title: 'Choose a Product',
    description: 'Browse our curated catalog and select the digital product that fits your needs.',
  },
  {
    step: '02',
    title: 'Complete Checkout',
    description: 'Enter your email and complete the secure payment process in just a few clicks.',
  },
  {
    step: '03',
    title: 'Receive Your Item',
    description: 'Your product details are delivered instantly to your email inbox upon confirmation.',
  },
  {
    step: '04',
    title: 'Get Support Anytime',
    description: 'Our support team is always available if you have questions or need assistance.',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-4xl font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-4">
            How It <span className="text-primary drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">Works</span>
          </h2>
          <div className="w-24 h-1 bg-primary mx-auto rounded-full shadow-[0_0_10px_rgba(139,92,246,0.6)] mb-4"></div>
          <p className="text-text-secondary max-w-xl mx-auto tracking-wide">
            Getting your digital product is simple and takes just minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-8 left-[12.5%] right-[12.5%] h-[2px] bg-border z-0">
            {/* Glowing moving line */}
            <div className="absolute top-0 left-0 h-full bg-primary shadow-[0_0_10px_#8b5cf6] w-1/3 animate-[slideRight_3s_ease-in-out_infinite_alternate]"></div>
          </div>

          {steps.map(({ step, title, description }) => (
            <div key={step} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-16 h-16 bg-[#11111A] border-2 border-border rounded-full flex items-center justify-center text-white text-xl font-black font-[family-name:var(--font-heading)] mb-6 group-hover:border-primary group-hover:shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:text-primary transition-all duration-300">
                {step}
              </div>
              <h3 className="font-bold font-[family-name:var(--font-heading)] uppercase tracking-wider text-white mb-3 group-hover:text-primary transition-colors">
                {title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes slideRight {
          0% { left: 0; }
          100% { left: 66.66%; }
        }
      `}</style>
    </section>
  );
}
