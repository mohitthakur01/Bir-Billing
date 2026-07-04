import React from 'react';
import { Link } from 'react-router-dom';
import { Wind, Tent, Compass, Coffee, ArrowRight } from 'lucide-react';

const Home = () => {
  const activities = [
    {
      icon: <Wind className="h-6 w-6 text-[#008cff]" />,
      title: 'Paragliding',
      description: 'Fly high above the mountains with experienced pilots and experience the thrill of tandem flights.',
    },
    {
      icon: <Compass className="h-6 w-6 text-[#008cff]" />,
      title: 'Mountain Treks',
      description: 'Explore wilderness trails, high altitude ridges, and lush green meadows of the Dhauladhars.',
    },
    {
      icon: <Tent className="h-6 w-6 text-[#008cff]" />,
      title: 'Eco Camping',
      description: 'Sleep under star-filled skies in comfortable camps located inside serene oak and pine forests.',
    },
    {
      icon: <Coffee className="h-6 w-6 text-[#008cff]" />,
      title: 'Cafe Culture',
      description: 'Indulge in delicious local Himalayan tea, traditional Tibetan cuisines, and artisan coffees.',
    },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Intro banner */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden py-16 px-4">
        {/* Subtle grid pattern background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-50"></div>
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

        <div className="max-w-4xl text-center space-y-6 animate-slide-up">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-550/10 text-[#008cff] border border-[#008cff]/20 tracking-wider uppercase">
            Himachal Pradesh, India
          </span>
          <h1 className="text-4xl sm:text-6xl font-outfit font-extrabold tracking-tight leading-tight text-slate-900">
            Fly Like a Bird in <br />
            <span className="bg-gradient-to-r from-[#008cff] via-sky-500 to-indigo-500 bg-clip-text text-transparent">
              Bir Billing
            </span>
          </h1>
          <p className="text-base sm:text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Experience paragliding at the world's second-highest takeoff site. Discover beautiful Buddhist monasteries, scenic mountain routes, and relaxing cafe vibes.
          </p>
          <div className="pt-6 flex flex-wrap justify-center gap-4">
            <Link
              to="/gallery"
              className="bg-[#008cff] hover:bg-[#0070cc] text-white font-semibold px-8 py-3.5 rounded-full transition-all duration-300 shadow-lg shadow-blue-500/20 flex items-center gap-2 hover:scale-[1.03]"
            >
              Explore Media Gallery
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="glass-panel text-slate-600 hover:text-slate-900 font-semibold px-8 py-3.5 rounded-full transition-all hover:bg-white border border-slate-200"
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Activities */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-outfit font-bold text-slate-900">Discover Adventures in Bir</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            From the sky to the forest floor, Bir offers unmatched experiences for adventure junkies and relaxation seekers alike.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {activities.map((act, index) => (
            <div
              key={index}
              className="glass-panel glass-panel-hover p-6 rounded-3xl space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="p-3 bg-blue-550/10 rounded-xl w-fit border border-blue-550/20">
                  {act.icon}
                </div>
                <h3 className="text-lg font-bold font-outfit text-slate-900">{act.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{act.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
