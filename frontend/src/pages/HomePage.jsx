import React from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from '../components/StarRating';
import { Store, ShieldCheck, MapPin } from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1 — HERO
          Dot-grid texture + off-center radial glow. Plain language. Real UI preview.
          No CTA button here (reserved for Section 2).
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#FAF9F6] texture-dots hero-glow border-b border-[#E8E5DF] py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center relative z-10">
          {/* Left Column: Plain, functional copy */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#FFFFFF] border border-[#E8E5DF] text-xs text-[#8A8578]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C9714F]"></span>
              <span>Store rating & governance system</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-[40px] font-semibold text-[#1A1815] tracking-tight leading-[1.18]">
              Ratings, reviews, and store performance — in one place.
            </h1>

            <p className="text-base sm:text-lg text-[#8A8578] font-normal leading-relaxed max-w-xl">
              Customers rate stores. Owners track performance. Admins manage it all.
            </p>
          </div>

          {/* Right Column: Real, simplified UI preview using actual craft components */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[380px] space-y-3">
              {/* Product Card Preview */}
              <div className="craft-card p-5 bg-[#FFFFFF] rounded-[8px] border border-[#E8E5DF] shadow-card space-y-4 select-none">
                {/* Store Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF] flex items-center justify-center text-[#C9714F] shrink-0">
                      <Store className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-[#1A1815] leading-tight">
                        Apex Artisan Emporium
                      </h2>
                      <p className="text-xs text-[#8A8578] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>108 Market Street</span>
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-[4px] bg-[#FAF9F6] border border-[#E8E5DF] text-[#6B8F6B] font-medium flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3" />
                    Verified
                  </span>
                </div>

                {/* Star Rating Display */}
                <div className="p-3 bg-[#FAF9F6] rounded-[6px] border border-[#E8E5DF] flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-[11px] text-[#8A8578]">Overall score</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <StarRating value={5} readOnly size="sm" />
                      <span className="text-sm font-semibold tabular-nums text-[#1A1815]">
                        4.9
                      </span>
                    </div>
                  </div>
                  <span className="text-xs tabular-nums text-[#8A8578]">
                    48 reviews
                  </span>
                </div>

                {/* Sample Review Excerpt */}
                <div className="text-xs text-[#2B2924] bg-[#FFFFFF] border-l-2 border-[#C9714F] pl-3 py-1 space-y-0.5">
                  <p className="font-normal text-[#2B2924] italic">
                    "Fast customer service and accurate store inventory."
                  </p>
                  <p className="text-[11px] text-[#8A8578] not-italic">
                    Verified customer • 5 stars submitted
                  </p>
                </div>
              </div>

              {/* Mini Stat Badge */}
              <div className="craft-card px-4 py-2.5 bg-[#FFFFFF] rounded-[8px] border border-[#E8E5DF] flex items-center justify-between text-xs">
                <span className="text-[#8A8578]">Platform accuracy</span>
                <span className="font-medium tabular-nums text-[#1A1815]">
                  1 verified review per customer
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — CTA TO ENTER THE APP
          Calm background (no dot grid). Singular action. Max-width 600px.
         ========================================================================= */}
      <section className="bg-[#FFFFFF] py-20 sm:py-28 px-4 sm:px-6">
        <div className="max-w-[600px] mx-auto text-center space-y-6">
          <p className="text-base sm:text-lg text-[#2B2924] font-normal leading-relaxed">
            Whether you're rating a store, managing one, or running the platform — it starts here.
          </p>

          <div className="flex flex-col items-center gap-3 pt-2">
            {/* ONE Primary Button in burnt-orange accent */}
            <Link
              to="/login"
              className="btn-primary py-2.5 px-8 text-sm font-medium w-full sm:w-auto"
            >
              Log in
            </Link>

            {/* ONE Secondary, quieter plain text link in muted grey */}
            <Link
              to="/signup"
              className="text-xs text-[#8A8578] hover:text-[#1A1815] transition-colors"
            >
              New here? Create an account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};
