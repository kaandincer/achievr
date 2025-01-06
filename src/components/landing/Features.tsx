import { CheckCircle, Target, Trophy, Users } from "lucide-react";

const features = [
  {
    icon: Target,
    title: "Smart Goal Setting",
    description:
      "Set clear, achievable goals with AI-powered guidance that helps you break down big objectives into manageable steps.",
  },
  {
    icon: CheckCircle,
    title: "Daily Accountability",
    description:
      "Stay on track with intelligent check-ins and progress monitoring that adapts to your unique journey.",
  },
  {
    icon: Users,
    title: "Community Support",
    description:
      "Connect with like-minded individuals who share your goals and motivate each other to succeed.",
  },
  {
    icon: Trophy,
    title: "Achievement Tracking",
    description:
      "Celebrate your progress with detailed analytics and meaningful milestones that showcase your journey.",
  },
];

export const Features = () => {
  return (
    <section id="features-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-gray-50" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 animate-fade-up">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4">
            Empowering Your Journey
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our AI-powered platform provides the tools and support you need to turn
            your aspirations into accomplishments.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" role="list">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              role="listitem"
            >
              <feature.icon className="h-12 w-12 text-sage-500 mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};