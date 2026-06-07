"use client";

import { MapPin, Truck, ShieldCheck, Phone, Navigation, ArrowRight } from "lucide-react";
import { useInView } from "./useInView";

export default function NationalCoverageMap() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  // Centered query for Sony Packers and Movers, Ranchi Jharkhand with zoom=5 to show India map
  const googleMapUrl = "https://maps.google.com/maps?q=Sony%20Packers%20and%20Movers%2C%20Ratu%20Road%2C%20Ranchi%2C%20Jharkhand&t=&z=5&ie=UTF8&iwloc=&output=embed";

  const keyRoutes = [
    { from: "Ranchi", to: "Patna", duration: "1-2 Days" },
    { from: "Ranchi", to: "Delhi NCR", duration: "3-4 Days" },
    { from: "Ranchi", to: "Kolkata", duration: "1-2 Days" },
    { from: "Ranchi", to: "Bangalore", duration: "4-5 Days" },
  ];

  return (
    <section ref={ref} className="bg-slate-50 py-16 md:py-24 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12 md:mb-16">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-orange-600 animate-fade-up">
            Nationwide Network
          </p>
          <h2 className="mt-3 text-3xl font-black text-slate-950 md:text-5xl tracking-tight animate-fade-up" style={{ animationDelay: "100ms" }}>
            Our National Presence & Network
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-base leading-8 text-slate-600 md:text-lg animate-fade-up" style={{ animationDelay: "200ms" }}>
            With our main headquarters in Ranchi, Jharkhand, we offer seamless, highly coordinated relocation and logistical services to every corner of India.
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          {/* Left Panel: Information & Features */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            {/* Headquarters Card */}
            <div 
              className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-700 ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-orange-50 text-orange-600">
                  <MapPin size={20} />
                </span>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Corporate Head Office</p>
                  <h3 className="text-lg font-bold text-slate-950">Ranchi, Jharkhand</h3>
                </div>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                Shop no- 302, Anmol Plaza, Ratu Road, Ranchi, Jharkhand (Opp. Nirvachan Bhawan)
              </p>
              <div className="mt-4 flex flex-wrap gap-4 text-xs font-medium text-slate-500 border-t border-slate-100 pt-4">
                <span className="flex items-center gap-1.5">
                  <Phone size={14} className="text-orange-600" />
                  +91 62092 80901
                </span>
                <span className="flex items-center gap-1.5">
                  <Navigation size={14} className="text-orange-600" />
                  Hub Office
                </span>
              </div>
            </div>

            {/* Network Strengths */}
            <div 
              className={`grid gap-4 sm:grid-cols-2 lg:grid-cols-1 transition-all duration-700 ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <div className="flex gap-4 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-blue-50 text-blue-600">
                  <Truck size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">All-India Transport Permits</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Dedicated fleet of GPS-enabled container vehicles running nationwide.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-green-50 text-green-600">
                  <ShieldCheck size={18} />
                </span>
                <div>
                  <h4 className="text-sm font-bold text-slate-900">Secure Shifting & Cargo Cover</h4>
                  <p className="mt-1 text-xs text-slate-500">
                    Multi-layer protective packaging with optional transit safety insurance.
                  </p>
                </div>
              </div>
            </div>

            {/* Popular Routes Panel */}
            <div 
              className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-700 ${
                isInView ? "translate-x-0 opacity-100" : "-translate-x-10 opacity-0"
              }`}
              style={{ transitionDelay: "400ms" }}
            >
              <h3 className="text-sm font-black uppercase tracking-[0.15em] text-slate-900 mb-4">
                Popular National Routes
              </h3>
              <div className="space-y-2.5">
                {keyRoutes.map((route, idx) => (
                  <div 
                    key={idx}
                    className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-2.5 text-xs font-semibold text-slate-800 transition hover:bg-slate-100"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-slate-900">{route.from}</span>
                      <ArrowRight size={12} className="text-slate-400" />
                      <span className="text-slate-950 font-bold">{route.to}</span>
                    </div>
                    <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[10px] font-bold text-orange-700">
                      {route.duration}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel: Working Interactive Map Container */}
          <div 
            className={`lg:col-span-7 flex flex-col transition-all duration-700 ${
              isInView ? "translate-x-0 opacity-100" : "translate-x-10 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative flex-1 min-h-[400px] md:min-h-[450px] lg:min-h-full rounded-3xl border-2 border-slate-200/80 bg-white p-2 shadow-md hover:shadow-lg transition-shadow duration-300">
              <iframe
                title="Sony Packers and Movers India Network Map"
                src={googleMapUrl}
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: "1.25rem" }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 w-full h-full p-2"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
