import React from 'react';

const projects = [
  {
    index: 1,
    title: 'Trilok Mart',
    description:
      'A comprehensive salesman tracking & supply chain dashboard featuring real-time analytics, inventory forecasting, and AI-driven route optimisation.',
    align: 'left',
    accent: 'cyan',
  },
  {
    index: 2,
    title: 'Career Compass AI',
    description:
      'An AI-driven career path platform that analyses market demand and maps out personalised learning trajectories to land your dream role.',
    align: 'right',
    accent: 'magenta',
  },
  {
    index: 3,
    title: 'Face In',
    description:
      'Advanced biometric face recognition system designed for seamless, contactless access control and high-security attendance tracking.',
    align: 'left',
    accent: 'cyan',
  },
];

const ProjectCard = ({ index, title, description, align, accent }) => (
  <div className={`project-row align-${align}`}>
    <div className={`glass-panel project-card ${accent === 'magenta' ? 'magenta' : ''}`}>
      <span className="project-index">0{index}</span>
      <h2 className={`project-title neon-text-${accent}`}>{title}</h2>
      <p className="project-desc">{description}</p>
    </div>
  </div>
);

const ProjectsSection = () => (
  <section>
    {projects.map((p) => (
      <ProjectCard key={p.index} {...p} />
    ))}
  </section>
);

export default ProjectsSection;
