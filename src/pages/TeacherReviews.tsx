import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TeacherReviews = () => {
  const reviews = [
    {
      name: "Sarah Martinez",
      role: "High School Math Teacher",
      review: "EduMaCation has transformed how I create and manage my lesson plans. The AI assistance helps me develop creative teaching approaches that really connect with my students.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "James Wilson",
      role: "Middle School Science Teacher",
      review: "The platform's ability to generate engaging activities has made my science classes more interactive and fun. My students' participation has increased significantly.",
      rating: 5,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
    },
    {
      name: "Emily Chen",
      role: "Elementary School Teacher",
      review: "As a new teacher, EduMaCation has been invaluable in helping me plan lessons and manage my classroom effectively. The community support is amazing!",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
    }
  ];

  const caseStudies = [
    {
      title: "Increasing Student Engagement",
      teacher: "Dr. Michael Thompson",
      school: "Lincoln High School",
      content: "After implementing EduMaCation in my classroom, I saw a 40% increase in student participation. The AI-generated discussion prompts and interactive activities helped create a more dynamic learning environment.",
      results: ["85% improvement in class participation", "32% increase in test scores", "Reduced lesson planning time by 50%"],
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=600"
    },
    {
      title: "Personalized Learning at Scale",
      teacher: "Lisa Rodriguez",
      school: "Washington Middle School",
      content: "EduMaCation helped me create differentiated learning materials for my diverse classroom. I can now easily adapt lessons for different learning styles and abilities.",
      results: ["Personalized learning plans for 28 students", "95% parent satisfaction rate", "Improved student confidence levels"],
      image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=600"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="pt-24 px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-4">Teacher Success Stories</h1>
          <p className="text-lg text-gray-600 text-center mb-12">See how educators are transforming their classrooms with EduMaCation</p>

          {/* Reviews Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {reviews.map((review, index) => (
              <Card key={index} className="border-none shadow-lg">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{review.name}</h3>
                      <p className="text-sm text-gray-600">{review.role}</p>
                    </div>
                  </div>
                  <div className="flex mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <Quote className="w-8 h-8 text-gray-300 mb-2" />
                  <p className="text-gray-600">{review.review}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Case Studies Section */}
          <h2 className="text-3xl font-bold text-center mb-12">Case Studies</h2>
          <div className="space-y-12 mb-16">
            {caseStudies.map((study, index) => (
              <Card key={index} className="border-none shadow-lg overflow-hidden">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="h-64 md:h-auto">
                    <img
                      src={study.image}
                      alt={study.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold mb-2">{study.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      {study.teacher} - {study.school}
                    </p>
                    <p className="text-gray-600 mb-4">{study.content}</p>
                    <div className="space-y-2">
                      <h4 className="font-semibold">Key Results:</h4>
                      <ul className="list-disc list-inside text-gray-600">
                        {study.results.map((result, i) => (
                          <li key={i}>{result}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TeacherReviews;
