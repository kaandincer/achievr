import { Target, Footprints, Heart } from "lucide-react";

export const About = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Empowering dreamers to become achievers, one step at a time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-fade-up">
            <h3 className="text-2xl font-bold text-sage-600">The Story Behind Achievr</h3>
            <p className="text-gray-600">
              Achievr was born from a personal journey of understanding that the path to extraordinary achievements is paved with small, consistent steps. As someone who has always pursued ambitious goals, our founder recognized that the greatest challenge wasn't setting big goals—it was maintaining focus and momentum in the day-to-day journey toward them.
            </p>
            <p className="text-gray-600">
              Through years of personal development and goal achievement, a powerful truth emerged: every monumental achievement is built upon a foundation of small, daily wins. This realization led to the creation of Achievr—a platform that combines the power of AI with proven goal-setting methodologies.
            </p>
          </div>

          <div className="space-y-8 animate-fade-up">
            <div className="flex gap-4 items-start">
              <div className="bg-sage-100 p-3 rounded-lg">
                <Target className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Vision-Driven Progress</h4>
                <p className="text-gray-600">We believe in the power of breaking down ambitious goals into achievable daily actions.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-sage-100 p-3 rounded-lg">
                <Footprints className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Step-by-Step Journey</h4>
                <p className="text-gray-600">Our AI companion guides you through each step, ensuring you stay on track toward your goals.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-sage-100 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-sage-600" />
              </div>
              <div>
                <h4 className="font-semibold mb-2">Community Support</h4>
                <p className="text-gray-600">Join a community of goal-setters who understand that great achievements start with small steps.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};