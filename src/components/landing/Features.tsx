import { Trophy, Sparkles, Gamepad, Users, Timer, Activity } from "lucide-react";

const features = [
  {
    icon: Trophy,
    title: "Win Real Rewards",
    description:
      "Earn points for consistent stretching and win cash prizes in monthly contests. Turn your recovery routine into real rewards.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Recovery",
    description:
      "Get personalized stretching routines based on your run intensity and recovery needs, optimized by AI.",
  },
  {
    icon: Gamepad,
    title: "Fun Gamification",
    description:
      "Build virtual characters, complete storylines, and play stretching-based games that make recovery entertaining.",
  },
  {
    icon: Users,
    title: "Social Stretching",
    description:
      "Join group stretches and compete with friends. Make recovery a social and motivating experience.",
  },
  {
    icon: Timer,
    title: "Multi-task Mode",
    description:
      "Efficiently combine stretching with other activities. Make the most of your recovery time.",
  },
  {
    icon: Activity,
    title: "Progress Tracking",
    description:
      "Monitor your recovery journey with detailed analytics and see how consistent stretching improves your performance.",
  },
];

export const Features = () => {
  return (
    <section id="features-section" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#f9f8f6]" aria-labelledby="features-heading">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-16 animate-fade-up">
          <h2 id="features-heading" className="text-3xl sm:text-4xl font-bold mb-4 text-[#27425e]">
            Recovery Reimagined
          </h2>
          <p className="text-[#27425e]/80 max-w-2xl mx-auto">
            Plio transforms your post-run recovery into an engaging experience that
            rewards you for taking care of your body.
          </p>
        </header>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" role="list">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
              role="listitem"
            >
              <feature.icon className="h-12 w-12 text-[#527fb8] mb-4" aria-hidden="true" />
              <h3 className="text-xl font-semibold mb-2 text-[#27425e]">{feature.title}</h3>
              <p className="text-[#27425e]/80">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};