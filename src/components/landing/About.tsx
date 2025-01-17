import { Target, Footprints, Heart } from "lucide-react";

export const About = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Making recovery an enjoyable and rewarding part of every runner's journey.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h3 className="text-2xl font-bold text-[#527fb8]">The Story Behind Plio</h3>
            <p className="text-gray-600">
              As an avid runner, our founder intimately understood the crucial role of post-run recovery and stretching. Despite knowing its benefits - reduced injury risk, improved flexibility, and faster recovery - he struggled to consistently incorporate it into his busy schedule. Like many runners, the immediate gratification of the run often overshadowed the importance of recovery.
            </p>
            <p className="text-gray-600">
              This personal challenge sparked the idea for Plio - a platform that transforms the "should do" of stretching into a "want to do" through rewards, gamification, and social connection. By combining real cash incentives with AI-powered personalization, we're making recovery not just important, but irresistible.
            </p>
          </div>

          <div className="space-y-8 animate-fade-up">
            <div className="flex gap-4 items-start">
              <div className="bg-[#f9f8f6] p-3 rounded-lg">
                <Target className="w-6 h-6 text-[#527fb8]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Personalized Recovery</h4>
                <p className="text-gray-600">Our AI adapts your stretching routine based on your specific workout and recovery needs.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-[#f9f8f6] p-3 rounded-lg">
                <Footprints className="w-6 h-6 text-[#527fb8]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Rewarding Journey</h4>
                <p className="text-gray-600">Turn your recovery sessions into opportunities to earn real rewards while improving your performance.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-[#f9f8f6] p-3 rounded-lg">
                <Heart className="w-6 h-6 text-[#527fb8]" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community Support</h4>
                <p className="text-gray-600">Join a community of runners who understand that proper recovery is key to achieving their goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};