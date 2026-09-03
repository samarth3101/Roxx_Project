import React from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from '../components/StarRating';
import {
  Store,
  ShieldCheck,
  MapPin,
  Shield,
  User,
  Building2,
  Server,
  Database,
  Code2,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';

export const HomePage = () => {
  return (
    <div className="w-full">
      {/* =========================================================================
          SECTION 1 — HERO & PLATFORM CAPABILITIES
          Dot-grid texture + off-center radial glow. Plain language. Real UI preview.
          Detailed role capabilities from the FullStack Intern Challenge spec.
         ========================================================================= */}
      <section className="relative overflow-hidden bg-[#FAF9F6] texture-dots hero-glow border-b border-[#E8E5DF] py-14 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto space-y-16 relative z-10">
          {/* Hero Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
            {/* Left Column: Plain, functional copy & Tech Stack badges */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-[6px] bg-[#FFFFFF] border border-[#E8E5DF] text-xs text-[#8A8578]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C9714F]"></span>
                <span>Fullstack Intern Coding Challenge Solution</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-semibold text-[#1A1815] tracking-tight leading-[1.15]">
                Ratings, reviews, and store performance — in one place.
              </h1>

              <p className="text-base sm:text-lg text-[#8A8578] font-normal leading-relaxed max-w-xl">
                Customers rate stores. Owners track performance. Admins manage it all.
              </p>

              {/* Verified Tech Stack Pills */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FFFFFF] border border-[#E8E5DF] text-[#2B2924]">
                  <Server className="w-3.5 h-3.5 text-[#C9714F]" />
                  <span>Express.js backend</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FFFFFF] border border-[#E8E5DF] text-[#2B2924]">
                  <Database className="w-3.5 h-3.5 text-[#4A6FA5]" />
                  <span>PostgreSQL & Prisma</span>
                </span>
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-[6px] bg-[#FFFFFF] border border-[#E8E5DF] text-[#2B2924]">
                  <Code2 className="w-3.5 h-3.5 text-[#6B8F6B]" />
                  <span>React 18 & Vite</span>
                </span>
              </div>
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
                      <span className="text-[11px] text-[#8A8578]">Overall store score</span>
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
                      Verified user • 5 stars submitted
                    </p>
                  </div>
                </div>

                {/* Accuracy Badge */}
                <div className="craft-card px-4 py-2.5 bg-[#FFFFFF] rounded-[8px] border border-[#E8E5DF] flex items-center justify-between text-xs">
                  <span className="text-[#8A8578]">Relational constraint</span>
                  <span className="font-medium text-[#1A1815]">
                    1 rating per customer per store
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Three Core Roles Breakdown (from Challenge Requirements) */}
          <div className="pt-4 space-y-4">
            <div className="border-b border-[#E8E5DF] pb-2 flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-[#1A1815]">
                Role-based platform capabilities
              </h2>
              <span className="text-xs text-[#8A8578]">Single unified authentication</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              {/* Role 1: System Administrator */}
              <div className="craft-card p-4 bg-[#FFFFFF] rounded-[8px] border border-[#E8E5DF] space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF] text-[#4A6FA5] flex items-center justify-center">
                    <Shield className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-semibold text-[#1A1815] text-sm">System Administrator</h3>
                </div>
                <ul className="space-y-1.5 text-[#8A8578] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6FA5] shrink-0 mt-0.5" />
                    <span>Real-time dashboard metrics (total users, stores, submitted ratings)</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6FA5] shrink-0 mt-0.5" />
                    <span>Provision new stores, normal users, and administrators</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6FA5] shrink-0 mt-0.5" />
                    <span>Filter and sort listings by name, email, address, and role</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6FA5] shrink-0 mt-0.5" />
                    <span>Calculates aggregated store rating for assigned store owners</span>
                  </li>
                </ul>
              </div>

              {/* Role 2: Normal User */}
              <div className="craft-card p-4 bg-[#FFFFFF] rounded-[8px] border border-[#E8E5DF] space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF] text-[#6B8F6B] flex items-center justify-center">
                    <User className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-semibold text-[#1A1815] text-sm">Normal User</h3>
                </div>
                <ul className="space-y-1.5 text-[#8A8578] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F6B] shrink-0 mt-0.5" />
                    <span>Public registration page with real-time requirement validation</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F6B] shrink-0 mt-0.5" />
                    <span>Explore and search registered stores by name and address</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F6B] shrink-0 mt-0.5" />
                    <span>Submit ratings between 1 and 5 stars for any store</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#6B8F6B] shrink-0 mt-0.5" />
                    <span>Seamlessly modify previously submitted ratings (upsert logic)</span>
                  </li>
                </ul>
              </div>

              {/* Role 3: Store Owner */}
              <div className="craft-card p-4 bg-[#FFFFFF] rounded-[8px] border border-[#E8E5DF] space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-[6px] bg-[#FAF9F6] border border-[#E8E5DF] text-[#C9714F] flex items-center justify-center">
                    <Building2 className="w-3.5 h-3.5" />
                  </div>
                  <h3 className="font-semibold text-[#1A1815] text-sm">Store Owner</h3>
                </div>
                <ul className="space-y-1.5 text-[#8A8578] leading-relaxed">
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9714F] shrink-0 mt-0.5" />
                    <span>Dedicated store performance overview with large KPI metrics</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9714F] shrink-0 mt-0.5" />
                    <span>Live calculation of store's overall average rating score</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9714F] shrink-0 mt-0.5" />
                    <span>Sortable customer review table with reviewer name and address</span>
                  </li>
                  <li className="flex items-start gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#C9714F] shrink-0 mt-0.5" />
                    <span>In-app password updates and session controls</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2 — CTA & EVALUATION SPECS
          Calm background (no dot grid). Singular action. Demo accounts & form rules.
         ========================================================================= */}
      <section className="bg-[#FFFFFF] py-16 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto space-y-12 text-center">
          {/* Primary Action Box */}
          <div className="max-w-[600px] mx-auto space-y-6">
            <h2 className="text-xl sm:text-2xl font-semibold text-[#1A1815] tracking-tight">
              Ready to test the platform?
            </h2>
            <p className="text-sm sm:text-base text-[#8A8578] font-normal leading-relaxed">
              Whether you're rating a store, managing one, or running the platform — it starts here.
            </p>

            <div className="flex flex-col items-center gap-3 pt-1">
              <Link
                to="/login"
                className="btn-primary py-2.5 px-8 text-sm font-medium w-full sm:w-auto"
              >
                Log in to portal
              </Link>
              <Link
                to="/signup"
                className="text-xs text-[#8A8578] hover:text-[#1A1815] transition-colors"
              >
                New here? Create an account
              </Link>
            </div>
          </div>

          {/* Quick Demo Access & Form Rules (for Challenge Evaluators) */}
          <div className="pt-8 border-t border-[#E8E5DF] grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            {/* Quick Demo Credentials */}
            <div className="craft-card p-5 bg-[#FAF9F6] rounded-[8px] border border-[#E8E5DF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A1815]">Demo test accounts</span>
                <span className="text-[11px] text-[#6B8F6B] font-medium">Pre-seeded & ready</span>
              </div>
              <p className="text-xs text-[#8A8578]">
                You can use these accounts to verify all three roles immediately:
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex items-center justify-between">
                  <div>
                    <span className="text-[#4A6FA5] font-sans font-medium text-[11px] block">
                      Admin:
                    </span>
                    <span className="text-[#2B2924]">admin@roxx.com</span>
                  </div>
                  <span className="text-[#8A8578] text-[11px]">Admin@1234</span>
                </div>

                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex items-center justify-between">
                  <div>
                    <span className="text-[#C9714F] font-sans font-medium text-[11px] block">
                      Store Owner:
                    </span>
                    <span className="text-[#2B2924]">owner1@roxx.com</span>
                  </div>
                  <span className="text-[#8A8578] text-[11px]">Owner@1234</span>
                </div>

                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex items-center justify-between">
                  <div>
                    <span className="text-[#6B8F6B] font-sans font-medium text-[11px] block">
                      Normal User:
                    </span>
                    <span className="text-[#2B2924]">user1@roxx.com</span>
                  </div>
                  <span className="text-[#8A8578] text-[11px]">User@1234</span>
                </div>
              </div>
            </div>

            {/* Strict Form Validation Rules (Challenge Requirements) */}
            <div className="craft-card p-5 bg-[#FAF9F6] rounded-[8px] border border-[#E8E5DF] space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#1A1815]">Form validation rules</span>
                <span className="text-[11px] text-[#4A6FA5] font-medium">Zod + DB enforced</span>
              </div>
              <p className="text-xs text-[#8A8578]">
                Strict constraints enforced on both frontend and backend:
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex justify-between">
                  <span className="text-[#2B2924] font-medium">Full Name</span>
                  <span className="text-[#8A8578] tabular-nums">Min 20, Max 60 characters</span>
                </div>

                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex justify-between">
                  <span className="text-[#2B2924] font-medium">Address</span>
                  <span className="text-[#8A8578] tabular-nums">Max 400 characters</span>
                </div>

                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex justify-between">
                  <span className="text-[#2B2924] font-medium">Password</span>
                  <span className="text-[#8A8578] text-[11px]">8-16 chars, 1 uppercase, 1 special</span>
                </div>

                <div className="p-2 bg-[#FFFFFF] rounded border border-[#E8E5DF] flex justify-between">
                  <span className="text-[#2B2924] font-medium">Store Ratings</span>
                  <span className="text-[#8A8578] tabular-nums">1 to 5 integer stars (upsert)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
