import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import LatestNews from "../components/LatestNews";
import EventsSection from "../components/EventsSection";
import CommunityStats from "../components/CommunityStats";
import LeadershipPreview from "../components/LeadershipPreview";
import CTA from "../components/CTA";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <section className="py-16 bg-flag-blue text-white relative overflow-hidden">
          <style>{`
            @keyframes slideInDown {
              from {
                opacity: 0;
                transform: translateY(-30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            @keyframes slideInUp {
              from {
                opacity: 0;
                transform: translateY(30px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-title {
              animation: slideInDown 0.8s ease-out;
            }
            .animate-subtitle {
              animation: slideInUp 0.8s ease-out 0.3s both;
            }
          `}</style>
          <div className="max-w-7xl mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-4 animate-title bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
              Abyei Students in Rwanda
            </h1>
            <p className="text-lg max-w-2xl mx-auto animate-subtitle text-blue-50">Connecting people, culture, and local support in Musanze. Join events, find services, and volunteer.</p>
          </div>
        </section>

        <LatestNews />
        <EventsSection />
        <CommunityStats />
        <LeadershipPreview />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
