import AnimatedComplianceWorkflow from './AnimatedComplianceWorkflow';

export default function ProcessSection() {
  return (
    <section id="fasi" className="w-full bg-slate-50/70 py-14 lg:py-20 border-b border-slate-200 relative z-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Animated 4-Phase Conduit Workflow */}
        <AnimatedComplianceWorkflow />
      </div>
    </section>
  );
}
