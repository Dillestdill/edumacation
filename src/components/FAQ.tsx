const faqs = [
  {
    question: "What is EduMaCation, and how does it help teachers?",
    answer: "EduMaCation is an AI-powered web app designed to create personalized lesson plans for teachers and educators. It saves you time by generating custom plans tailored to your grade level, subject, and teaching goals—perfect for busy educators who want to focus on their students.",
    iconBg: "bg-pink-50",
  },
  {
    question: "How does EduMaCation generate lesson plans?",
    answer: "EduMaCation uses advanced artificial intelligence to analyze your input—like grade level, subject, and lesson objectives—and creates a detailed lesson plan. Each plan includes activities, materials, assessments, and more, designed to fit your teaching style.",
    iconBg: "bg-purple-50",
  },
  {
    question: "Can EduMaCation align with educational standards like Common Core?",
    answer: "Yes! EduMaCation can align your lesson plans with specific standards, such as Common Core or Next Generation Science Standards, ensuring that your lessons meet educational requirements.",
    iconBg: "bg-blue-50",
  },
  {
    question: "Is EduMaCation suitable for all grade levels and subjects?",
    answer: "Absolutely! EduMaCation works for all grade levels, from kindergarten to high school, and supports various subjects, including Math, English, Science, History, and more.",
    iconBg: "bg-pink-50",
  },
  {
    question: "How much does EduMaCation cost?",
    answer: "We offer flexible pricing options: $4.60/month for unlimited lesson plans, or $50/year (a 9% savings!) for annual access. Affordable, time-saving, and designed for every teacher.",
    iconBg: "bg-purple-50",
  },
];

const FAQ = () => {
  return (
    <section id="faq" className="py-24 px-6 bg-surface">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-2 justify-center mb-4">
          <div className="w-6 h-6 rounded-full border border-primary/20 flex items-center justify-center">
            <span className="text-sm">?</span>
          </div>
          <span className="text-sm text-secondary">Frequently Asked Questions (FAQs)</span>
        </div>
        
        <h2 className="text-4xl md:text-6xl font-bold text-center mb-16">
          Have questions? We're here to help
        </h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {faqs.map((faq, index) => (
            <div 
              key={index} 
              className="bg-white p-8 rounded-3xl hover:shadow-lg transition-all duration-300 border border-gray-100"
            >
              <div className={`w-12 h-6 ${faq.iconBg} rounded-full mb-6`} />
              <h3 className="text-xl font-medium mb-3">{faq.question}</h3>
              <p className="text-secondary text-sm">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FAQ;