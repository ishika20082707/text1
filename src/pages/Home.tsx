import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBeacon } from '../context/BeaconContext';
import { 
  BookOpen, 
  Calendar, 
  ShieldCheck, 
  Award, 
  ChevronDown, 
  ArrowRight, 
  GraduationCap, 
  Clock, 
  Users 
} from 'lucide-react';
// Import the generated image path
import campusHero from '../assets/images/university_campus_hero_1791297470470.jpg';
import studentOne from '../assets/images/types_of_data_flowchart_1791300895515.jpg';
import studentTwo from '../assets/images/student_portrait_two_1791300640393.jpg';
import studentThree from '../assets/images/student_portrait_three_1791300655014.jpg';
import studentFour from '../assets/images/student_portrait_four_1791300670681.jpg';

export const Home: React.FC = () => {
  const { courses } = useBeacon();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const stats = [
    { value: '120+', label: 'Expert Faculty Members' },
    { value: '98%', label: 'Placement Rate' },
    { value: '45+', label: 'Global Research Collaborations' },
    { value: '10k+', label: 'Successful Alumni' },
  ];

  const highlights = [
    {
      icon: <Award className="h-6 w-6 text-blue-600" />,
      title: 'Global Academic Accreditation',
      description: 'Fully accredited degrees recognized globally, paving the way for international research and professional pathways.'
    },
    {
      icon: <BookOpen className="h-6 w-6 text-blue-600" />,
      title: 'Industry-Aligned Curriculum',
      description: 'Hands-on programs co-developed with leading technology, design, and financial institutions to secure instant job readiness.'
    },
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: 'State-Of-The-Art Facilities',
      description: 'Advanced laboratories, collaborative study spaces, high-tech studios, and a comprehensive research library.'
    }
  ];

  const criticalDates = [
    { event: 'Online Application Portal Opens', date: 'October 01, 2026', type: 'Open' },
    { event: 'Early Decision Application Deadline', date: 'November 15, 2026', type: 'Priority' },
    { event: 'Regular Decision Deadline', date: 'January 15, 2027', type: 'Regular' },
    { event: 'Scholarship Applications Close', date: 'February 28, 2027', type: 'Funding' },
    { event: 'Admissions Decision Announcements', date: 'March 15, 2027', type: 'Result' }
  ];

  const faqs = [
    {
      question: 'What are the general admission eligibility criteria?',
      answer: 'Generally, candidates must have completed their 10+2 (high school equivalent) with a minimum overall percentage of 50-60%, depending on the specific program. Engineering and Data Science degrees require a background in Mathematics/Physics.'
    },
    {
      question: 'Can I apply for multiple courses at once?',
      answer: 'Yes! Our multi-step student portal lets you select a First Preference course and a Second Preference course within a single application.'
    },
    {
      question: 'Is it possible to save my application as a draft and finish it later?',
      answer: 'Absolutely. You can log into your account, enter any details, and click "Save Draft". Your information is securely stored and you can resume and submit whenever you are ready.'
    },
    {
      question: 'What documents are required to be uploaded with the application?',
      answer: 'You will need a passport-sized photograph, your secondary/high school academic marksheet (transcript), and a government-issued ID proof (e.g., passport, national ID, or driver’s license).'
    },
    {
      question: 'How long does the application review process take?',
      answer: 'Once submitted, the admissions staff reviews applications on a rolling basis. On average, status updates (such as "Under Review", "Approved", or "Waitlisted") take 2-3 weeks from final submission.'
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="bg-slate-50 min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative bg-white overflow-hidden py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold uppercase tracking-wider">
              <span>●</span> Fall 2027 Admissions Open
            </div>
            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              Begin Your Journey of <span className="text-blue-600">Impactful Learning</span>
            </h1>
            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Beacon College offers top-tier academic degrees, globally certified curriculum, and industry immersion designed to build specialized careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link
                to="/login?mode=register"
                className="px-6 py-3.5 text-sm font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 hover:shadow-lg transition-all text-center"
              >
                Start Application
              </Link>
              <Link
                to="/courses"
                className="px-6 py-3.5 text-sm font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all text-center flex items-center justify-center gap-1.5"
              >
                Explore Courses
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-16/9 md:aspect-3/2 group">
              <img
                src={campusHero}
                alt="Beacon College Campus Building"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
                onError={(e) => {
                  // Fallback container in case the generated path has an issue
                  (e.target as HTMLElement).style.display = 'none';
                  const fallback = document.getElementById('hero-fallback');
                  if (fallback) fallback.classList.remove('hidden');
                }}
              />
              <div
                id="hero-fallback"
                className="hidden absolute inset-0 bg-gradient-to-tr from-blue-700 to-indigo-900 flex flex-col justify-center items-center text-white p-6"
              >
                <GraduationCap className="h-16 w-16 mb-4 animate-bounce" />
                <span className="font-serif text-2xl font-bold">Beacon College</span>
                <span className="text-sm opacity-80 mt-1">Nurturing Leaders of Tomorrow</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-blue-600 py-10 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="text-2xl sm:text-4xl font-extrabold font-mono tabular-nums">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-blue-100 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Institutional Highlights */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Why Choose Beacon College?</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Our educational framework pairs strict mathematical logic and research methods with creative freedom and industry exposure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {highlights.map((h, i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-100 p-6 shadow-xs hover:shadow-md transition-shadow space-y-4">
              <div className="p-3 bg-blue-50 w-fit rounded-lg">
                {h.icon}
              </div>
              <h3 className="text-lg font-semibold text-slate-900">{h.title}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{h.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Courses Callout */}
      <section className="bg-slate-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
            <div className="space-y-1">
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900">Featured Specialized Degrees</h2>
              <p className="text-sm text-slate-600">Select programs designed for high academic rigour and industrial relevance.</p>
            </div>
            <Link
              to="/courses"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              View All Courses
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 3).map((course) => (
              <div key={course.id} className="bg-white rounded-xl border border-slate-200/60 p-6 flex flex-col justify-between shadow-xs">
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900 text-lg group-hover:text-blue-600">{course.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{course.description}</p>
                  
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-xs text-slate-600 border-t border-slate-50">
                    <div>
                      <span className="font-semibold">Duration:</span> {course.duration}
                    </div>
                    <div>
                      <span className="font-semibold">Seats:</span> <span className="font-mono tabular-nums">{course.seats}</span>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-sm font-bold text-blue-600 font-mono tabular-nums">{course.fees}</span>
                  <Link
                    to={`/login?mode=register&course=${course.id}`}
                    className="text-xs font-semibold text-slate-800 hover:text-blue-600 flex items-center gap-1"
                  >
                    Apply for this
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Student Ambassadors */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-slate-150">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Voices of Beacon: Meet Our Ambassadors</h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Don’t just take our word for it—hear directly from current undergraduate scholars building real-world impacts.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              image: studentOne,
              name: 'Emily Chen',
              major: 'B.Tech in Computer Science',
              year: 'Year 3 Scholar',
              quote: 'The collaborative research focus at Beacon has allowed me to join hands-on AI projects that normally aren\'t available to undergraduates. It completely accelerated my career.'
            },
            {
              image: studentTwo,
              name: 'Ryan Murphy',
              major: 'BBA (Business Management)',
              year: 'Year 2 Scholar',
              quote: 'The incubation program here is amazing. The faculty helped me structure my first startup model and connected me with key regional angel networks in Boston.'
            },
            {
              image: studentThree,
              name: 'Aisha Rahman',
              major: 'B.Sc in Data Science',
              year: 'Year 4 Scholar',
              quote: 'Beacon\'s mathematical rigor coupled with machine learning practicals set me up for an internship at a major analytics firm. The program was exactly what I needed.'
            },
            {
              image: studentFour,
              name: 'Marcus Vance',
              major: 'Bachelor of Design',
              year: 'Year 3 Scholar',
              quote: 'I love the multidisciplinary freedom. The design labs are high-tech, and combining creative visual work with software logic courses gave me a unique portfolio edge.'
            }
          ].map((student, idx) => (
            <div key={idx} className="bg-white rounded-xl border border-slate-200/60 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all">
              <div className="space-y-4">
                <div className="aspect-square w-full rounded-lg overflow-hidden border border-slate-100 bg-slate-50">
                  <img
                    src={student.image}
                    alt={student.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900 text-sm">{student.name}</h4>
                  {/* Clean unboxed metadata separator */}
                  <div className="text-[11px] text-slate-500 font-medium">
                    <span>{student.major}</span>
                    <span aria-hidden="true" className="mx-1">·</span>
                    <span>{student.year}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed italic">
                  "{student.quote}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Important Admission Dates */}
      <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10 space-y-2">
          <h2 className="font-serif text-3xl font-bold text-slate-900">Key Admission Dates</h2>
          <p className="text-slate-600 text-sm">Please monitor key deadlines to qualify for priority reviews and scholarships.</p>
        </div>

        <div className="bg-white rounded-xl border border-slate-100 shadow-xs overflow-hidden">
          <div className="divide-y divide-slate-100">
            {criticalDates.map((item, idx) => (
              <div key={idx} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:bg-slate-50/50 transition-colors">
                <div className="space-y-1">
                  <div className="text-sm font-semibold text-slate-900">{item.event}</div>
                  <div className="text-xs text-slate-500 font-medium">Category: {item.type}</div>
                </div>
                <div className="flex items-center gap-3 self-start sm:self-center">
                  <div className="text-sm font-semibold text-blue-600 font-mono tabular-nums flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    {item.date}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Interactive FAQs Accordion */}
      <section className="py-16 bg-slate-100/60">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 space-y-2">
            <h2 className="font-serif text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
            <p className="text-slate-600 text-sm">Have queries about admission procedures, documents, or selection criteria?</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="bg-white rounded-xl border border-slate-200/60 overflow-hidden shadow-xs">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-slate-900 hover:text-blue-600 transition-colors focus:outline-hidden"
                  >
                    <span className="text-sm sm:text-base">{faq.question}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
};
