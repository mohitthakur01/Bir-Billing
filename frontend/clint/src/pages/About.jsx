import React from 'react';
import { ShieldCheck, Compass, Users } from 'lucide-react';

const About = () => {
  const highlights = [
    {
      icon: <Compass className="h-6 w-6 text-[#008cff]" />,
      title: 'Takeoff at 2,400m',
      description: 'Billing sits at an altitude of 2,400 meters, offering smooth thermal currents and optimal launch conditions.',
    },
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#008cff]" />,
      title: 'Safety Guidelines',
      description: 'We host experienced tandem pilots, certified equipment checking, and secure landing operations.',
    },
    {
      icon: <Users className="h-6 w-6 text-[#008cff]" />,
      title: 'Tibetan Settlement',
      description: 'Bir is home to a thriving Tibetan community, featuring beautiful monasteries, arts, and cultural centers.',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8 space-y-20 pb-28">
      {/* Page Header */}
      <section className="text-center max-w-3xl mx-auto space-y-4 animate-fade-in">
        <h1 className="text-3xl sm:text-5xl font-outfit font-extrabold text-slate-900">About Bir Billing</h1>
        <p className="text-slate-500 leading-relaxed text-sm sm:text-base">
          Bir Billing is globally recognized as the paragliding capital of India and one of the finest take-off points in the world. Nestled in the Joginder Nagar Valley of Himachal Pradesh, it offers visitors a blend of high-altitude adventure, peaceful monasteries, and stunning natural vistas.
        </p>
      </section>

      {/* Main Contents Grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-outfit font-bold text-slate-900">The Ultimate Mountain Gateway</h2>
          <p className="text-slate-555 text-slate-600 leading-relaxed text-sm">
            Whether you want to launch into the skies at Billing, trek through the rhododendron forests, camp along remote streams, or sip tea in the local Tibetan cafes, Bir has something special for everyone.
          </p>
          <p className="text-slate-600 leading-relaxed text-sm">
            Billing serves as the high takeoff ridge, while the landing grounds lie in the town of Bir. Together, they create a perfect ecosystem for free flight and cross-country paragliding.
          </p>
        </div>

        {/* Card highlights */}
        <div className="space-y-6">
          {highlights.map((hl, index) => (
            <div key={index} className="glass-panel p-6 rounded-3xl flex items-start space-x-4 border border-slate-200">
              <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20 flex-shrink-0">
                {hl.icon}
              </div>
              <div className="space-y-1">
                <h3 className="font-outfit font-bold text-slate-900 text-base">{hl.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{hl.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
