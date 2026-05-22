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
    <section className="py-20 bg-[#050509] relative">
      <div className="neon-divider" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="text-center mb-14">
          <span className="section-label mb-4 inline-flex">Simple Process</span>
          <h2
            className="text-3xl sm:text-4xl font-black uppercase text-white mt-4 mb-3 tracking-wide"
            style={{ fontFamily: 'var(--font-orbitron)' }}
          >
            How It Works
          </h2>
          <p className="text-[#A1A1AA] max-w-xl mx-auto text-sm">
            Getting your digital product is simple and takes just minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-9 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-[#8B5CF6] via-[#A855F7] to-[#8B5CF6] opacity-25" />

          {steps.map(({ step, title, description }) => (
            <div
              key={step}
              className="group relative flex flex-col items-center text-center p-7 bg-[#11111A] rounded-xl border border-[#25253A] hover:border-[#8B5CF6]/40 hover:bg-[#16161F] hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(139,92,246,0.1)] transition-all duration-300 overflow-hidden"
            >
              {/* Top glow on hover */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#8B5CF6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Step number circle */}
              <div
                className="relative w-16 h-16 rounded-full bg-gradient-to-br from-[#8B5CF6] to-[#A855F7] flex items-center justify-center text-white text-sm font-black mb-5 shadow-[0_0_20px_rgba(139,92,246,0.4)] group-hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] transition-all duration-300"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {step}
              </div>

              <h3
                className="text-sm font-bold uppercase tracking-wider text-white mb-2 group-hover:text-[#A855F7] transition-colors"
                style={{ fontFamily: 'var(--font-orbitron)' }}
              >
                {title}
              </h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
