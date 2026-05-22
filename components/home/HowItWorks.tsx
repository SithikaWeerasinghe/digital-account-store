const steps = [
  {
    step: '01',
    title: 'Choose a Product',
    description: 'Browse our catalog and select the digital credentials or license keys you need.',
    color: 'text-cyan-600 bg-cyan-50 border-cyan-100 shadow-sm',
  },
  {
    step: '02',
    title: 'Complete Checkout',
    description: 'Enter your email and pay securely via encrypted processing options in seconds.',
    color: 'text-purple-600 bg-purple-50 border-purple-100 shadow-sm',
  },
  {
    step: '03',
    title: 'Receive Your Item',
    description: 'Your verified credentials or license keys are immediately routed straight to your inbox.',
    color: 'text-green-600 bg-green-50 border-green-100 shadow-sm',
  },
  {
    step: '04',
    title: 'Instant Support',
    description: 'Our customer support system remains ready to resolve any activation concerns 24/7.',
    color: 'text-orange-600 bg-orange-50 border-orange-100 shadow-sm',
  },
];

export default function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4 text-gray-900 tracking-tight">
            How It <span className="text-[#009ee3] font-black">Works</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            Get premium accounts and licenses up and running in four simple steps.
          </p>
        </div>
 
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          
          {/* Connector line for desktop */}
          <div className="hidden lg:block absolute top-12 left-[12.5%] right-[12.5%] h-[1px] bg-gray-200 pointer-events-none" />
 
          {steps.map(({ step, title, description, color }) => (
            <div 
              key={step} 
              className="relative flex flex-col items-center text-center p-8 rounded-2xl bg-white border border-gray-200 hover:border-[#009ee3]/30 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Step circle */}
              <div className={`w-14 h-14 rounded-2xl border ${color} flex items-center justify-center text-xl font-extrabold mb-6 transition-all duration-300 group-hover:scale-105`}>
                {step}
              </div>
              
              <h3 className="font-bold text-gray-900 text-base mb-3 group-hover:text-[#009ee3] transition-colors">
                {title}
              </h3>
              
              <p className="text-xs text-gray-500 leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
