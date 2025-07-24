import React, { useState, useRef } from 'react';
import { LayoutTemplate, User, Mail, Phone, MapPin, Calendar, Award, Briefcase, GraduationCap, Download, Eye, EyeOff, Palette, Zap, Star, Globe, Github, Linkedin } from 'lucide-react';

// Color schemes and utilities at top level
const colorSchemes = {
  blue: { 
    primary: { color: 'rgb(59, 130, 246)', class: 'blue' },
    secondary: { color: 'rgb(99, 102, 241)', class: 'indigo' },
    accent: { color: 'rgb(14, 165, 233)', class: 'sky' }
  },
  green: {
    primary: { color: 'rgb(16, 185, 129)', class: 'emerald' },
    secondary: { color: 'rgb(20, 184, 166)', class: 'teal' },
    accent: { color: 'rgb(34, 197, 94)', class: 'green' }
  },
  purple: {
    primary: { color: 'rgb(147, 51, 234)', class: 'purple' },
    secondary: { color: 'rgb(139, 92, 246)', class: 'violet' },
    accent: { color: 'rgb(217, 70, 239)', class: 'fuchsia' }
  },
  orange: {
    primary: { color: 'rgb(249, 115, 22)', class: 'orange' },
    secondary: { color: 'rgb(245, 158, 11)', class: 'amber' },
    accent: { color: 'rgb(234, 179, 8)', class: 'yellow' }
  },
  red: {
    primary: { color: 'rgb(239, 68, 68)', class: 'red' },
    secondary: { color: 'rgb(244, 63, 94)', class: 'rose' },
    accent: { color: 'rgb(236, 72, 153)', class: 'pink' }
  },
  gray: {
    primary: { color: 'rgb(107, 114, 128)', class: 'gray' },
    secondary: { color: 'rgb(100, 116, 139)', class: 'slate' },
    accent: { color: 'rgb(113, 113, 122)', class: 'zinc' }
  }
};

const getColorClass = (type, shade = '600', selectedColor = 'blue') => {
  const scheme = colorSchemes[selectedColor];
  const colorType = type === 'primary' ? scheme.primary : type === 'secondary' ? scheme.secondary : scheme.accent;
  return `${colorType.class}-${shade}`;
};

  // Enhanced Template Components with better styling and more sections
  const ModernTemplate = ({ data, isDark = false, selectedColor = 'blue' }) => {
    const experience = data?.experience || [];
    const education = data?.education || [];
    const certifications = data?.certifications || [];
    const projects = data?.projects || [];
    const technicalSkills = data?.skills?.technical || [];
    const softSkills = data?.skills?.soft || [];
    const scheme = colorSchemes[selectedColor];

    return (
      <div style={{
        background: isDark ? '#111827' : '#fff',
        color: isDark ? '#f3f4f6' : '#111827',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        borderRadius: '1rem',
        maxWidth: '64rem',
        margin: 'auto',
        overflow: 'hidden'
      }}>
        <div style={{
          background: `linear-gradient(to right, ${scheme.primary.color}, ${scheme.secondary.color})`,
          color: 'white',
          padding: '2rem'
        }}>
          {/* Enhanced Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.5rem' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
              <p style={{ fontSize: '1.5rem', opacity: 0.9, marginBottom: '1rem' }}>{data?.personalInfo?.title || 'Your Title'}</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', fontSize: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Mail size={16} />
                  <span>{data?.personalInfo?.email || 'email@example.com'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} />
                  <span>{data?.personalInfo?.phone || 'Phone Number'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={16} />
                  <span>{data?.personalInfo?.location || 'Location'}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Globe size={16} />
                  <span>{data?.personalInfo?.website || 'Website'}</span>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '1rem' }}>
                <Linkedin size={14} />
                <span>LinkedIn</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.2)', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '1rem' }}>
                <Github size={14} />
                <span>GitHub</span>
              </div>
            </div>
          </div>
        </div>
        <div style={{ padding: '2rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              {/* Professional Summary */}
              <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', borderBottom: `2px solid ${scheme.primary.color}`, paddingBottom: '0.5rem' }}>Professional Summary</h2>
                <p style={{ lineHeight: 1.7, color: '#374151' }}>{data.personalInfo.summary}</p>
              </section>
              {/* Experience */}
              <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', borderBottom: `2px solid ${scheme.primary.color}`, paddingBottom: '0.5rem' }}>Professional Experience</h2>
                {experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '2rem', position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, width: '0.25rem', height: '100%', background: scheme.primary.color, opacity: 0.2, borderRadius: '1rem' }}></div>
                    <div style={{ paddingLeft: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{exp.title}</h3>
                          <p style={{ color: scheme.primary.color, fontWeight: 600, fontSize: '1.1rem' }}>{exp.company}</p>
                          {exp.location && <p style={{ color: '#6b7280', fontSize: '0.95rem' }}>{exp.location}</p>}
                        </div>
                        <span style={{ background: scheme.primary.color, color: '#fff', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 600 }}>{exp.period}</span>
                      </div>
                      <p style={{ marginBottom: '0.75rem', color: '#374151' }}>{exp.description}</p>
                      {exp.achievements && (
                        <ul style={{ marginLeft: 0, paddingLeft: 0, listStyle: 'disc', color: '#6b7280' }}>
                          {exp.achievements.map((achievement, i) => (
                            <li key={i} style={{ fontSize: '0.95rem', marginLeft: '1rem' }}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </section>
              {/* Projects */}
              <section>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', borderBottom: `2px solid ${scheme.primary.color}`, paddingBottom: '0.5rem' }}>Key Projects</h2>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  {projects.map((project, index) => (
                    <div key={index} style={{ border: `1px solid ${scheme.primary.color}`, borderRadius: '0.75rem', padding: '1rem' }}>
                      <h3 style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '0.5rem' }}>{project.name}</h3>
                      <p style={{ color: '#374151', marginBottom: '0.5rem' }}>{project.description}</p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {project.technologies.map((tech, i) => (
                          <span key={i} style={{ background: scheme.accent.color, color: '#fff', padding: '0.25rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.85rem' }}>{tech}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {/* Skills */}
              <section>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Technical Skills</h2>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {technicalSkills.map((skill, index) => (
                    <span key={index} style={{ background: scheme.primary.color, color: '#fff', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 500 }}>{skill}</span>
                  ))}
                </div>
              </section>
              {/* Soft Skills */}
              <section>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Core Competencies</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {softSkills.map((skill, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ width: '0.75rem', height: '0.75rem', background: scheme.secondary.color, borderRadius: '9999px' }}></div>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
              </section>
              {/* Education */}
              <section>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Education</h2>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 700 }}>{edu.degree}</h3>
                    <p style={{ color: scheme.primary.color, fontWeight: 600 }}>{edu.school}</p>
                    <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>{edu.year} • {edu.honors}</p>
                    <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>GPA: {edu.gpa}</p>
                  </div>
                ))}
              </section>
              {/* Certifications */}
              <section>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '1rem' }}>Certifications</h2>
                {certifications.map((cert, index) => (
                  <div key={index} style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 600 }}>{cert.name}</h3>
                    <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>{cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </section>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ClassicTemplate = ({ data, isDark = false, selectedColor = 'blue' }) => {
    const experience = data?.experience || [];
    const education = data?.education || [];
    const certifications = data?.certifications || [];
    const technicalSkills = data?.skills?.technical || [];
    const softSkills = data?.skills?.soft || [];

    // Use only inline rgb/hex colors for html2canvas compatibility
    const bgColor = isDark ? '#111827' : '#fff'; // gray-900 or white
    const textColor = isDark ? '#f3f4f6' : '#111827'; // gray-100 or gray-900
    const borderColor = isDark ? '#374151' : '#e5e7eb'; // gray-700 or gray-200
    const borderBColor = '#111827'; // gray-900
    const borderSectionColor = '#9ca3af'; // gray-400

    return (
      <div style={{ background: bgColor, color: textColor, boxShadow: '0 4px 24px rgba(0,0,0,0.08)', maxWidth: '64rem', margin: 'auto', border: `2px solid ${borderColor}`, borderRadius: '1rem' }}>
        {/* Traditional Header */}
        <div style={{ textAlign: 'center', borderBottom: `4px solid ${borderBColor}`, padding: '2rem 0' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 700, marginBottom: '0.75rem', letterSpacing: '0.05em' }}>{data?.personalInfo?.name || 'Your Name'}</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 300 }}>{data?.personalInfo?.title || 'Your Title'}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '1rem', fontSize: '1rem' }}>
            <span>{data?.personalInfo?.email || 'email@example.com'}</span>
            <span>•</span>
            <span>{data?.personalInfo?.phone || 'Phone'}</span>
            <span>•</span>
            <span>{data?.personalInfo?.location || 'Location'}</span>
            <span>•</span>
            <span>{data?.personalInfo?.website || 'Website'}</span>
          </div>
        </div>
        <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Executive Summary */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${borderSectionColor}`, paddingBottom: '0.5rem' }}>
              Executive Summary
            </h2>
            <p style={{ lineHeight: 1.7, textAlign: 'justify' }}>{data.personalInfo.summary}</p>
          </section>
          {/* Professional Experience */}
          <section>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${borderSectionColor}`, paddingBottom: '0.5rem' }}>
              Professional Experience
            </h2>
            {experience.map((exp, index) => (
              <div key={index} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{exp.title}</h3>
                    <p style={{ fontSize: '1.125rem', fontWeight: 600 }}>{exp.company}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700 }}>{exp.period}</p>
                    {exp.location && <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>{exp.location}</p>}
                  </div>
                </div>
                <p style={{ marginBottom: '0.75rem' }}>{exp.description}</p>
                {exp.achievements && (
                  <ul style={{ listStyle: 'disc inside', marginLeft: '1rem', marginBottom: 0 }}>
                    {exp.achievements.map((achievement, i) => (
                      <li key={i} style={{ fontSize: '0.95rem' }}>{achievement}</li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
            {/* Education & Certifications */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${borderSectionColor}`, paddingBottom: '0.5rem' }}>
                  Education
                </h2>
                {education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '1rem' }}>
                    <h3 style={{ fontWeight: 700 }}>{edu.degree}</h3>
                    <p style={{ fontWeight: 600 }}>{edu.school}</p>
                    <p style={{ fontSize: '0.95rem' }}>{edu.year} • {edu.honors} • GPA: {edu.gpa}</p>
                  </div>
                ))}
              </section>
              <section>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${borderSectionColor}`, paddingBottom: '0.5rem' }}>
                  Certifications
                </h2>
                {certifications.map((cert, index) => (
                  <div key={index} style={{ marginBottom: '0.75rem' }}>
                    <h3 style={{ fontWeight: 600 }}>{cert.name}</h3>
                    <p style={{ fontSize: '0.95rem' }}>{cert.issuer}, {cert.year}</p>
                  </div>
                ))}
              </section>
            </div>
            {/* Core Competencies */}
            <section>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', borderBottom: `1px solid ${borderSectionColor}`, paddingBottom: '0.5rem' }}>
                Core Competencies
              </h2>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Technical Skills</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.25rem', fontSize: '0.95rem' }}>
                    {technicalSkills.map((skill, index) => (
                      <div key={index}>• {skill}</div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Leadership & Soft Skills</h3>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.25rem', fontSize: '0.95rem' }}>
                    {softSkills.map((skill, index) => (
                      <div key={index}>• {skill}</div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  const MinimalistTemplate = ({ data, isDark = false, selectedColor = 'blue' }) => {
    const experience = data?.experience || [];
    const education = data?.education || [];
    const certifications = data?.certifications || [];
    const technicalSkills = data?.skills?.technical || [];
    const softSkills = data?.skills?.soft || [];

    return (
      <div style={{
        background: isDark ? '#111827' : '#fff',
        color: isDark ? '#f3f4f6' : '#111827',
        maxWidth: '64rem',
        margin: 'auto',
        fontWeight: 300,
        borderRadius: '1rem',
        padding: '2rem'
      }}>
        {/* Minimal Header */}
        <div style={{ marginBottom: '4rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 200, marginBottom: '1rem', letterSpacing: '0.05em' }}>{data.personalInfo.name}</h1>
          <p style={{ fontSize: '1.5rem', marginBottom: '2rem', color: '#6b7280' }}>{data.personalInfo.title}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', fontSize: '1rem', color: '#6b7280', borderBottom: '1px solid #e5e7eb', paddingBottom: '2rem' }}>
            <span>{data.personalInfo.email}</span>
            <span>{data.personalInfo.phone}</span>
            <span>{data.personalInfo.location}</span>
            <span>{data.personalInfo.website}</span>
          </div>
        </div>

        {/* Summary */}
        <section style={{ marginBottom: '4rem' }}>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.7, color: '#374151' }}>{data.personalInfo.summary}</p>
        </section>

        {/* Experience */}
        <section style={{ marginBottom: '4rem' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 200, marginBottom: '3rem', color: '#1f2937' }}>Experience</h2>
          {experience.map((exp, index) => (
            <div key={index} style={{ marginBottom: '3rem', display: 'grid', gridTemplateColumns: '1fr 4fr', gap: '2rem' }}>
              <div style={{ color: '#6b7280', fontSize: '1rem' }}>
                <p style={{ fontWeight: 500 }}>{exp.period}</p>
                {exp.location && <p>{exp.location}</p>}
              </div>
              <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 500, marginBottom: '0.5rem' }}>{exp.title}</h3>
                <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '1rem' }}>{exp.company}</p>
                <p style={{ marginBottom: '1rem', lineHeight: 1.7 }}>{exp.description}</p>
                {exp.achievements && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {exp.achievements.map((achievement, i) => (
                      <p key={i} style={{ fontSize: '0.95rem', color: '#374151', paddingLeft: '1rem', borderLeft: '2px solid #e5e7eb' }}>{achievement}</p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </section>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem' }}>
          {/* Education & Certifications */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <section>
              <h2 style={{ fontSize: '2rem', fontWeight: 200, marginBottom: '2rem', color: '#1f2937' }}>Education</h2>
              {education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '1.5rem' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 500 }}>{edu.degree}</h3>
                  <p style={{ color: '#6b7280' }}>{edu.school}</p>
                  <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>{edu.year} • {edu.honors}</p>
                </div>
              ))}
            </section>
            <section>
              <h2 style={{ fontSize: '2rem', fontWeight: 200, marginBottom: '2rem', color: '#1f2937' }}>Certifications</h2>
              {certifications.map((cert, index) => (
                <div key={index} style={{ marginBottom: '1rem' }}>
                  <h3 style={{ fontWeight: 500 }}>{cert.name}</h3>
                  <p style={{ fontSize: '0.95rem', color: '#6b7280' }}>{cert.issuer}, {cert.year}</p>
                </div>
              ))}
            </section>
          </div>

          {/* Skills */}
          <section>
            <h2 style={{ fontSize: '2rem', fontWeight: 200, marginBottom: '2rem', color: '#1f2937' }}>Skills</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div>
                <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Technical</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {technicalSkills.map((skill, index) => (
                    <div key={index} style={{ color: '#374151' }}>{skill}</div>
                  ))}
                </div>
              </div>
              <div>
                <h3 style={{ fontWeight: 500, marginBottom: '1rem' }}>Leadership</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {softSkills.map((skill, index) => (
                    <div key={index} style={{ color: '#374151' }}>{skill}</div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  };

  const CreativeTemplate = ({ data, isDark = false, selectedColor = 'blue' }) => {
    const experience = data?.experience || [];
    const education = data?.education || [];
    const certifications = data?.certifications || [];
    const technicalSkills = data?.skills?.technical || [];
    const softSkills = data?.skills?.soft || [];
    const scheme = colorSchemes[selectedColor];

    return (
      <div style={{
        background: isDark
          ? 'linear-gradient(to bottom right, #111827, #1f2937)'
          : 'linear-gradient(to bottom right, #f9fafb, #fff)',
        color: isDark ? '#f3f4f6' : '#111827',
        maxWidth: '64rem',
        margin: 'auto',
        borderRadius: '1.5rem',
        boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
        overflow: 'hidden'
      }}>
        {/* Creative Header */}
        <div style={{ position: 'relative', background: isDark ? '#1f2937' : '#fff', padding: '3rem' }}>
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '16rem',
            height: '16rem',
            background: `linear-gradient(to bottom right, ${scheme.primary.color}, ${scheme.accent.color})`,
            borderRadius: '9999px',
            opacity: 0.1,
            marginRight: '-8rem',
            marginTop: '-8rem',
            zIndex: 0
          }}></div>
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '12rem',
            height: '12rem',
            background: `linear-gradient(to top right, ${scheme.secondary.color}, ${scheme.primary.color})`,
            borderRadius: '9999px',
            opacity: 0.1,
            marginLeft: '-6rem',
            marginBottom: '-6rem',
            zIndex: 0
          }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              background: `linear-gradient(to right, ${scheme.primary.color}, ${scheme.accent.color})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              fontSize: '3.5rem',
              fontWeight: 700,
              marginBottom: '1.5rem'
            }}>{data?.personalInfo?.name || 'Your Name'}</h1>
            <p style={{ fontSize: '2rem', marginBottom: '2rem', fontWeight: 300 }}>{data.personalInfo.title}</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: `linear-gradient(90deg, ${scheme.primary.color}, ${scheme.secondary.color})`, padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
                <Mail size={18} style={{ color: scheme.primary.color }} />
                <span style={{ color: scheme.primary.color, fontWeight: 500 }}>{data.personalInfo.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: `linear-gradient(90deg, ${scheme.secondary.color}, ${scheme.accent.color})`, padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
                <Phone size={18} style={{ color: scheme.secondary.color }} />
                <span style={{ color: scheme.secondary.color, fontWeight: 500 }}>{data.personalInfo.phone}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: `linear-gradient(90deg, ${scheme.accent.color}, ${scheme.primary.color})`, padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
                <MapPin size={18} style={{ color: scheme.accent.color }} />
                <span style={{ color: scheme.accent.color, fontWeight: 500 }}>{data.personalInfo.location}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: `linear-gradient(90deg, ${scheme.primary.color}, ${scheme.accent.color})`, padding: '0.75rem 1.25rem', borderRadius: '1rem' }}>
                <Globe size={18} style={{ color: scheme.primary.color }} />
                <span style={{ color: scheme.primary.color, fontWeight: 500 }}>{data.personalInfo.website}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2 space-y-12">
              {/* About Me */}
              <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20`}>
                <h2 className={`text-3xl font-bold mb-6 flex items-center gap-3 text-${getColorClass('primary')}`}>
                  <User size={28} />
                  About Me
                </h2>
                <p className="leading-relaxed text-lg">{data?.personalInfo?.summary || ''}</p>
              </div>

              {/* Experience */}
              <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20`}>
                <h2 className={`text-3xl font-bold mb-8 flex items-center gap-3 text-${getColorClass('primary')}`}>
                  <Briefcase size={28} />
                  Experience Journey
                </h2>
                <div className="space-y-8">
                  {experience.map((exp, index) => (
                    <div key={index} className="relative">
                      <div style={{ background: `linear-gradient(to right, ${scheme.primary.color}, ${scheme.accent.color})`, borderRadius: '0.75rem', padding: '1rem', border: `1px solid ${scheme.primary.color}` }}>
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-2xl font-bold">{exp.title}</h3>
                            <p className={`text-${getColorClass('primary')} font-bold text-lg`}>{exp.company}</p>
                            {exp.location && <p className="text-gray-500">{exp.location}</p>}
                          </div>
                          <span style={{ background: `linear-gradient(to right, ${scheme.primary.color}, ${scheme.secondary.color})`, color: '#fff', padding: '0.25rem 1rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 600 }}>
                            {exp.period}
                          </span>
                        </div>
                        <p style={{ marginBottom: '1rem', color: '#374151' }}>{exp.description}</p>
                        {exp.achievements && (
                          <div className="grid gap-2">
                            {exp.achievements.map((achievement, i) => (
                              <div key={i} className="flex items-start gap-3">
                                <Star size={16} style={{ color: scheme.accent.color, marginTop: '0.125rem' }} />
                                <span className="text-sm">{achievement}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-8">
              {/* Skills */}
              <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20`}>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 text-${getColorClass('primary')}`}>
                  <Zap size={24} />
                  Skills & Expertise
                </h2>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-bold mb-3">Technical Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {technicalSkills.map((skill, index) => (
                        <span key={index} style={{ background: `linear-gradient(to right, ${scheme.primary.color}, ${scheme.secondary.color})`, color: '#fff', padding: '0.5rem 1rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 500 }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mb-3">Core Competencies</h3>
                    <div className="space-y-2">
                      {softSkills.map((skill, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div style={{ width: '0.5rem', height: '0.5rem', background: scheme.accent.color, borderRadius: '9999px' }}></div>
                          <span>{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Education */}
              <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20`}>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 text-${getColorClass('primary')}`}>
                  <GraduationCap size={24} />
                  Education
                </h2>
                {(education || []).map((edu, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-bold text-lg">{edu.degree}</h3>
                    <p className={`text-${getColorClass('primary')} font-semibold`}>{edu.school}</p>
                    <p className="text-sm text-gray-600">{edu.year} • {edu.honors}</p>
                    <p className="text-sm text-gray-600">GPA: {edu.gpa}</p>
                  </div>
                ))}
              </div>

              {/* Certifications */}
              <div className={`${isDark ? 'bg-gray-800/50' : 'bg-white/70'} backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20`}>
                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 text-${getColorClass('primary')}`}>
                  <Award size={24} />
                  Certifications
                </h2>
                {(certifications || []).map((cert, index) => (
                  <div key={index} className="mb-4">
                    <h3 className="font-semibold">{cert.name}</h3>
                    <p className="text-sm text-gray-600">{cert.issuer} • {cert.year}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const ResumeTemplateSelector = ({ selectedTemplate = 'Modern', setSelectedTemplate, onUseTemplate, onClose, isDark = false }) => {
    const [showPreview, setShowPreview] = useState(true);
    const [previewScale, setPreviewScale] = useState(0.7);
    const [selectedColor, setSelectedColor] = useState('blue');
    const printRef = useRef();

    // Enhanced sample resume data with more realistic content
    const sampleData = {
      personalInfo: {
        name: "Sarah Johnson",
        title: "Full Stack Developer",
        email: "sarah.johnson@email.com",
        phone: "+1 (555) 987-6543",
        location: "Austin, TX",
        website: "sarah-dev.com",
        linkedin: "linkedin.com/in/sarahjohnson",
        github: "github.com/sarahjdev",
        summary: "Passionate full-stack developer with 6+ years of experience building scalable web applications. Expertise in React, Node.js, and cloud technologies with a proven track record of delivering high-quality solutions that drive business growth."
      },
      experience: [
        {
          title: "Senior Full Stack Developer",
          company: "TechFlow Solutions",
          period: "Jan 2022 - Present",
          location: "Austin, TX",
          description: "Lead a team of 4 developers in building enterprise-grade web applications. Architected microservices that handle 1M+ daily requests with 99.9% uptime. Reduced deployment time by 60% through CI/CD automation.",
          achievements: [
            "Increased application performance by 45% through code optimization",
            "Mentored 3 junior developers, leading to 2 promotions",
            "Implemented automated testing reducing bugs by 30%"
          ]
        },
        {
          title: "Full Stack Developer",
          company: "InnovateLab",
          period: "Jun 2020 - Dec 2021",
          location: "Remote",
          description: "Developed responsive web applications using React and Express.js. Collaborated with UX designers to create intuitive user interfaces. Integrated third-party APIs and payment systems.",
          achievements: [
            "Built 5 client projects generating $500K+ revenue",
            "Reduced page load times by 40% through optimization",
            "Implemented real-time features using WebSocket"
          ]
        },
        {
          title: "Frontend Developer",
          company: "StartupXYZ",
          period: "Sep 2018 - May 2020",
          location: "San Francisco, CA",
          description: "Created dynamic user interfaces and collaborated with backend teams to integrate RESTful APIs. Participated in agile development processes and code reviews.",
          achievements: [
            "Developed mobile-first responsive designs",
            "Improved user engagement by 25%",
            "Contributed to open-source projects"
          ]
        }
      ],
      education: [
        {
          degree: "Bachelor of Science in Computer Science",
          school: "University of Texas at Austin",
          year: "2018",
          gpa: "3.8/4.0",
          honors: "Magna Cum Laude"
        }
      ],
      skills: {
        technical: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker", "MongoDB", "PostgreSQL", "GraphQL"],
        soft: ["Leadership", "Problem Solving", "Communication", "Team Collaboration", "Project Management"]
      },
      certifications: [
        {
          name: "AWS Certified Solutions Architect",
          issuer: "Amazon Web Services",
          year: "2023"
        },
        {
          name: "React Developer Certification",
          issuer: "Meta",
          year: "2022"
        }
      ],
      projects: [
        {
          name: "E-commerce Platform",
          description: "Built a full-stack e-commerce solution handling 10K+ products",
          technologies: ["React", "Node.js", "MongoDB", "Stripe API"]
        },
        {
          name: "Task Management App",
          description: "Real-time collaborative project management tool",
          technologies: ["Vue.js", "Socket.io", "Express", "PostgreSQL"]
        }
      ]
    };

    const templates = {
      Modern: ModernTemplate,
      Classic: ClassicTemplate,
      Minimalist: MinimalistTemplate,
      Creative: CreativeTemplate
    };

    const templateDescriptions = {
      Modern: "Clean design with gradient header and enhanced sections",
      Classic: "Traditional professional format with timeless appeal",
      Minimalist: "Simple, elegant design with plenty of white space",
      Creative: "Colorful and dynamic with creative visual elements"
    };

    const handlePrint = () => {
      window.print();
    };

    const handleDownloadPDF = () => {
      // In a real app, you'd use a library like html2pdf or jsPDF
      alert('PDF download functionality would be implemented here using a library like html2pdf.js');
    };

    const SelectedTemplate = templates[selectedTemplate];

    return (
      <div style={{ 
        width: '100%',
        maxWidth: '80rem',
        margin: '0 auto',
        padding: '1.5rem',
        background: isDark ? '#111827' : '#f9fafb',
        color: isDark ? '#f3f4f6' : '#111827'
      }}>
        <div style={{ 
          background: isDark ? '#1e293b' : '#ffffff',
          color: isDark ? '#f3f4f6' : '#111827',
          borderRadius: '1rem',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          padding: '2rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <div>
              <h1 style={{ fontSize: '2.25rem', fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center' }}>
                <LayoutTemplate style={{ marginRight: '1rem', color: '#4f46e5' }} size={40} />
                Resume Templates
              </h1>
              <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>Choose from our professional resume templates with live previews</p>
            </div>
            <button
              onClick={() => setShowPreview(!showPreview)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '0.75rem',
                fontWeight: 500,
                transition: 'all 0.2s',
                background: showPreview ? '#3b82f6' : '#e5e7eb',
                color: showPreview ? '#ffffff' : '#374151',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              {showPreview ? <EyeOff size={20} /> : <Eye size={20} />}
              {showPreview ? 'Hide Preview' : 'Show Preview'}
            </button>
          </div>

          {/* Color Scheme Selector */}
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Palette size={20} />
              Color Scheme
            </h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {Object.entries(colorSchemes).map(([color, scheme]) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '9999px',
                    border: `4px solid ${selectedColor === color ? '#1e293b' : '#d1d5db'}`,
                    background: `linear-gradient(135deg, ${scheme.primary.color}, ${scheme.secondary.color})`,
                    transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                    transition: 'all 0.2s',
                    outline: 'none',
                    cursor: 'pointer'
                  }}
                  title={color.charAt(0).toUpperCase() + color.slice(1)}
                />
              ))}
            </div>
          </div>

          {/* Template Selection Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {Object.keys(templates).map(template => (
              <button
                key={template}
                onClick={() => setSelectedTemplate(template)}
                style={{
                  position: 'relative',
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  border: `2px solid ${selectedTemplate === template ? '#6366f1' : isDark ? '#374151' : '#e5e7eb'}`,
                  background: selectedTemplate === template ? '#eef2ff' : isDark ? '#1e293b' : '#fff',
                  color: isDark ? '#f3f4f6' : '#111827',
                  boxShadow: selectedTemplate === template ? '0 4px 24px rgba(99,102,241,0.15)' : isDark ? '0 2px 8px rgba(30,41,59,0.08)' : '0 2px 8px rgba(0,0,0,0.06)',
                  transform: selectedTemplate === template ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s',
                  textAlign: 'left',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  width: '3.5rem',
                  height: '3.5rem',
                  borderRadius: '0.75rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: selectedTemplate === template ? '#6366f1' : isDark ? '#334155' : '#f1f5f9',
                  color: selectedTemplate === template ? '#fff' : '#64748b',
                  transition: 'all 0.2s'
                }}>
                  <LayoutTemplate size={28} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem', color: selectedTemplate === template ? '#4338ca' : isDark ? '#f3f4f6' : '#111827' }}>{template}</h3>
                <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: '#64748b' }}>{templateDescriptions[template]}</p>
                {selectedTemplate === template && (
                  <div style={{ position: 'absolute', top: '1rem', right: '1rem', width: '2rem', height: '2rem', background: '#6366f1', borderRadius: '9999px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3">
                      <polyline points="20,6 9,17 4,12"></polyline>
                    </svg>
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Action Bar */}
          <div style={{ background: isDark ? '#374151' : '#f9fafb', borderRadius: '1rem', padding: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p className="text-xl font-bold">
                Selected: <span style={{ color: '#4338ca' }}>{selectedTemplate}</span>
              </p>
              <p className="text-sm" style={{ color: '#64748b' }}>{templateDescriptions[selectedTemplate]}</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handlePrint}
                style={{ background: '#4b5563', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#374151'}
                onMouseLeave={e => e.currentTarget.style.background = '#4b5563'}
              >
                <Download size={20} />
                Print
              </button>
              <button
                onClick={handleDownloadPDF}
                style={{ background: '#dc2626', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 500, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#b91c1c'}
                onMouseLeave={e => e.currentTarget.style.background = '#dc2626'}
              >
                <Download size={20} />
                Download PDF
              </button>
              <button
                onClick={() => {
                  if (onUseTemplate) onUseTemplate(selectedTemplate);
                  if (onClose) onClose();
                }}
                style={{ background: '#16a34a', color: '#fff', padding: '0.75rem 1.5rem', borderRadius: '9999px', fontSize: '0.95rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem', border: 'none', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#15803d'}
                onMouseLeave={e => e.currentTarget.style.background = '#16a34a'}
              >
                <Download size={20} />
                Use Template
              </button>
            </div>
          </div>
        </div>

        {/* Preview Container */}
        {showPreview && (
          <div style={{ 
            background: isDark ? '#1e293b' : '#ffffff',
            borderRadius: '1rem',
            padding: '2rem',
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
          }}>
            <div style={{ 
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}>
              <h2 style={{ 
                fontSize: '1.875rem',
                fontWeight: 700,
                color: isDark ? '#f3f4f6' : '#111827'
              }}>
                {selectedTemplate} Template Preview
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <label style={{ fontSize: '0.875rem', fontWeight: 500, color: isDark ? '#f3f4f6' : '#111827' }}>
                    Zoom:
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="1"
                    step="0.1"
                    value={previewScale}
                    onChange={(e) => setPreviewScale(parseFloat(e.target.value))}
                    style={{ width: '5rem' }}
                  />
                  <span style={{ fontSize: '0.875rem', color: isDark ? '#f3f4f6' : '#111827' }}>
                    {Math.round(previewScale * 100)}%
                  </span>
                </div>
              </div>
            </div>
            
            {/* Export Preview Area */}
            <div style={{ 
              border: '2px solid #e5e7eb',
              borderRadius: '1rem',
              padding: '2rem',
              background: '#ffffff',
              overflow: 'auto',
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
              maxHeight: '80vh'
            }}>
              <div ref={printRef} style={{ background: '#ffffff' }}>
                <SelectedTemplate 
                  data={sampleData} 
                  isDark={false}
                  selectedColor={selectedColor} 
                />
              </div>
            </div>
          </div>
        )}

        {onClose && (
          <div style={{ 
            marginTop: '2rem',
            textAlign: 'center'
          }}>
            <button 
              onClick={onClose} 
              style={{
                background: '#d1d5db',
                color: '#1f2937',
                padding: '0.75rem 1.5rem',
                borderRadius: '9999px',
                fontSize: '0.95rem',
                fontWeight: 500,
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Close Template Selector
            </button>
          </div>
        )}
      </div>
    );
  };

export default ResumeTemplateSelector;

// 🔁 Named exports for templates (used in PDF export)
export {
  ModernTemplate,
  ClassicTemplate,
  MinimalistTemplate,
  CreativeTemplate
};