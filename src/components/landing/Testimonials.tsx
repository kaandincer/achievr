import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Entrepreneur",
    content:
      "This AI accountability tool has completely transformed how I approach my business goals. The intelligent insights and daily check-ins keep me focused and motivated.",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Fitness Coach",
    content:
      "As someone who helps others achieve their fitness goals, I can say this platform is a game-changer. The AI-powered progress tracking is incredibly effective.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Student",
    content:
      "The way this tool breaks down my academic goals into manageable tasks has helped me stay on top of my studies. The community support is amazing too!",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16 animate-fade-up">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Success Stories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Join thousands of users who have transformed their goals into reality
            with our AI-powered platform.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div
              key={testimonial.name}
              className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 animate-fade-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-sage-500 fill-current"
                  />
                ))}
              </div>
              <p className="text-gray-600 mb-6">{testimonial.content}</p>
              <div>
                <p className="font-semibold">{testimonial.name}</p>
                <p className="text-gray-500 text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};