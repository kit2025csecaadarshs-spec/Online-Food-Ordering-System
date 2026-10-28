import React from 'react';
import { Sparkles, MapPin, Clock, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-stone-200/90 text-stone-600 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-lg bg-amber-500 text-white flex items-center justify-center text-xs font-bold font-display">
                S3D
              </span>
              <span className="text-base font-bold text-stone-900 font-display">
                Savor<span className="text-amber-600">3D</span>
              </span>
            </div>
            <p className="text-stone-500 leading-relaxed text-xs">
              Artisanal online kitchen bringing physical dish inspection into the digital dining age with real-time Three.js 3D rendering.
            </p>
          </div>

          {/* Kitchen Hours & Address */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Flagship Kitchen
            </h4>
            <div className="flex items-start gap-2 text-stone-600">
              <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
              <span>120 Mercer Street, SoHo, New York, NY 10012</span>
            </div>
            <div className="flex items-center gap-2 text-stone-600">
              <Clock className="w-3.5 h-3.5 text-stone-400 shrink-0" />
              <span>Mon – Sun: 11:00 AM – 10:30 PM</span>
            </div>
          </div>

          {/* Sustainable Sourcing */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Quality Commitment
            </h4>
            <p className="text-stone-500 leading-relaxed">
              100% pasture-raised meats, wild-caught Pacific seafood, and certified organic seasonal produce sourced from regional regenerative family farms.
            </p>
          </div>

          {/* Safe & Fresh Guarantee */}
          <div className="space-y-2">
            <h4 className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">
              Hygiene & Service
            </h4>
            <div className="flex items-center gap-1.5 text-stone-600">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>Grade-A Health Inspected Kitchen</span>
            </div>
            <div className="flex items-center gap-1.5 text-stone-600">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Eco-friendly biodegradable packaging</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <p>© {new Date().getFullYear()} Savor3D Kitchen Technologies. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span aria-hidden="true">·</span>
            <span>Terms of Service</span>
            <span aria-hidden="true">·</span>
            <span>Food Safety</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
