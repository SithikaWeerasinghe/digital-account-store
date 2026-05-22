const steps = [
  {
    step: '01',
    title: 'Choose a Product',
    description: 'Browse our curated catalog and select the digital product that fits your needs.',
    color: 'bg-[#009ee3]',
  },
  {
    step: '02',
    title: 'Complete Checkout',
    description: 'Enter your email and complete the secure payment process in just a few clicks.',
    color: 'bg-purple-500',
  },
  {
    step: '03',
    title: 'Receive Your Item',
    description: 'Your product details are delivered instantly to your email inbox upon confirmation.',
    color: 'bg-emerald-500',
  },
  {
    step: '04',
    title: 'Get Support Anytime',
    description: 'Our support team is always available if you have questions or need assistance.',
    color: 'bg-amber-500',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How It Works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Getting your digital product is simple and takes just minutes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-[#009ee3] via-purple-400 via-emerald-400 to-amber-400 opacity-30" />

          {steps.map(({ step, title, description, color }) => (
            <div key={step} className="relative flex flex-col items-center text-center p-6 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center text-white text-xl font-bold mb-4 shadow-lg`}>
                {step}
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
