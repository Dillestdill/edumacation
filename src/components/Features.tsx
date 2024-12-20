const features = [
  {
    title: "Custom Lesson Plans",
    description: "Create personalized lesson plans tailored to your classroom needs in minutes. Save hours of planning time with our intuitive platform.",
  },
  {
    title: "Education Community Unites",
    description: "Connect with fellow educators, share resources, and grow together in our supportive teaching community.",
  },
  {
    title: "Affordable for Every Teacher",
    description: "Access unlimited custom lesson plans for just $10/month—an investment in your time and classroom.",
  },
  {
    title: "Save Hours of Lesson Planning",
    description: "Let EduMaCation handle the heavy lifting! Create custom lesson plans tailored to your classroom in just minutes.",
  },
  {
    title: "Tailored to Your Needs",
    description: "Whether it's grade-specific, subject-focused, or goal-driven, EduMaCation delivers lesson plans personalized just for you.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
          Designed for Excellence
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="glass p-8 rounded-2xl hover:bg-opacity-20 transition-all duration-300"
            >
              <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;