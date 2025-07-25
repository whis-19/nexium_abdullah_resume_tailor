"use client";
import React, { useState, useEffect, createContext, useContext, useRef } from 'react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import ResumeTemplateSelector from './ResumeTemplateSelector';
import {
  ModernTemplate,
  ClassicTemplate,
  MinimalistTemplate,
  CreativeTemplate
} from './ResumeTemplateSelector';
import { savePromptAndResponse } from '../../db/supabase';
import { ThemeToggle } from '../../components/ThemeToggle.jsx';
import { generateAISuggestions, correctText as aiCorrectText } from '../ai/generate.js';


// IMPORTANT: For PDF generation, ensure html2canvas and jspdf are available in your environment.
// If running in a standard React setup, you would typically `npm install html2canvas jspdf`
// and import them:
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// For this Canvas environment, we will assume they are globally available or

// Theme Context for Dark/Light mode
const ThemeContext = createContext();
const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};

const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true); // Default to dark mode
  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// SVG Icon Components
const FileTextIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-file-text">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z" />
    <path d="M14 2v4a2 2 0 0 0 2 2h4" />
    <path d="M10 9H8" />
    <path d="M16 13H8" />
    <path d="M16 17H8" />
  </svg>
);
const PlusIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-plus">
    <path d="M5 12h14" /><path d="M12 5v14" />
  </svg>
);
const DownloadIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-download">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" x2="12" y1="15" y2="3" />
  </svg>
);
const EditIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-edit">
    <path d="M20.7 7.07a1 1 0 0 0-1.41-1.41L7 18.17l-3 3 3-3L18.17 3.29Z" />
    <path d="M14.71 10.29 16 11.58" />
  </svg>
);
const Trash2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-trash-2">
    <path d="M3 6h18" /><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" /><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /><line x1="10" x2="10" y1="11" y2="17" /><line x1="14" x2="14" y1="11" y2="17" />
  </svg>
);
const LightbulbIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-lightbulb">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.2c1-.7 1.5-1.7 1.5-2.8A6 6 0 0 0 6 8c0 1 .5 2 1.5 2.8c.8.5 1.3 1.2 1.5 2.2" />
    <path d="M9 18h6" /><path d="M10 22h4" /><path d="M11 17L12 22" />
  </svg>
);
const PenToolIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-pen-tool">
    <path d="M12 19l7-7 3 3-7 7-3-3z" />
    <path d="M18 13l-1.5-7.5L2 2l7.5 1.5L18 13z" />
    <path d="M2 2l7.5 7.5" />
  </svg>
);
const XIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
    <path d="M18 6 6 18"/><path d="m6 6 12 12"/>
  </svg>
);
const SunIcon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 20 20">
    <path
      fillRule="evenodd"
      d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
      clipRule="evenodd"
    />
  </svg>
);
const MoonIcon = (props) => (
  <svg {...props} fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);


// Custom Modal Component (replaces alert/confirm)
const Modal = ({ message, onClose, onConfirm, showConfirmButton = false }) => {
  const { isDark } = useTheme();
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100]">
      <div className={`p-6 rounded-lg shadow-xl max-w-sm mx-auto text-center border ${isDark ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-900 border-gray-200'}`}>
        <p className="text-lg font-semibold mb-4">{message}</p>
        <div className="flex justify-center space-x-4">
          {showConfirmButton && (
            <button
              onClick={onConfirm}
              className={`py-2 px-5 rounded-lg font-semibold transition duration-300 ${isDark ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-red-500 hover:bg-red-600 text-white'}`}
            >
              Confirm
            </button>
          )}
          <button
            onClick={onClose}
            className={`py-2 px-5 rounded-lg font-semibold transition duration-300 ${isDark ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-500 hover:bg-blue-600 text-white'}`}
          >
            {showConfirmButton ? 'Cancel' : 'Okay'}
          </button>
        </div>
      </div>
    </div>
  );
};

// Session ID management
function getSessionId() {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('sessionId');
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    localStorage.setItem('sessionId', sessionId);
  }
  return sessionId;
}

const App = () => {
  const [loading, setLoading] = useState(true);
  const [resumes, setResumes] = useState([]);
  const [currentResume, setCurrentResume] = useState(null);
  const [newResumeName, setNewResumeName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [textToCorrect, setTextToCorrect] = useState('');
  const [correctedText, setCorrectedText] = useState('');
  const [correctionLoading, setCorrectionLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [modalCallback, setModalCallback] = useState(null);
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [newSkillInput, setNewSkillInput] = useState('');
  const [isAddingSkill, setIsAddingSkill] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [skillSuggestions, setSkillSuggestions] = useState([]);
  const skillInputRef = useRef(null);
  const [startPDFExport, setStartPDFExport] = useState(false);
  const [selectedColor, setSelectedColor] = useState('blue');


  // Determine theme-based classes
  const themeClasses = {
    bg: isDark ? 'bg-gradient-to-br from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-br from-gray-100 via-white to-gray-50',
    text: isDark ? 'text-gray-100' : 'text-gray-900',
    textSecondary: isDark ? 'text-gray-400' : 'text-gray-600',
    cardBg: isDark ? 'bg-gray-800/70 border-gray-700/50' : 'bg-white/70 border-gray-200/50',
    inputBg: isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-50/50 border-gray-300',
    buttonPrimary: isDark ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg' : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-md',
    buttonSecondary: isDark ? 'bg-gray-700 hover:bg-gray-600 text-gray-100 border-gray-600' : 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-gray-300',
    sidebarBg: isDark ? 'bg-gray-800/80 border-r border-gray-700' : 'bg-white/80 border-r border-gray-200',
    sectionDivider: isDark ? 'border-gray-700' : 'border-gray-200',
    // New sidebar specific classes
    sidebarAccentBg: isDark ? 'bg-gradient-to-r from-blue-700 to-purple-700' : 'bg-gradient-to-r from-blue-100 to-purple-100',
    sidebarHoverBg: isDark ? 'hover:bg-gray-700/60' : 'hover:bg-gray-100/60',
    selectedItemBg: isDark ? 'bg-blue-600/70 text-white' : 'bg-blue-200 text-blue-900',
    selectedItemShadow: 'shadow-inner'
  };

  // Fetch resumes on mount
  useEffect(() => {
    async function fetchResumes() {
      setLoading(true);
      try {
        const sessionId = getSessionId();
        const res = await fetch(`/api/resume?sessionId=${sessionId}`);
        if (!res.ok) throw new Error('Failed to fetch resumes');
        const fetchedResumes = await res.json();
        setResumes(fetchedResumes);
        if (!currentResume && fetchedResumes.length > 0) {
          setCurrentResume(fetchedResumes[0]);
        }
      } catch (error) {
        showSystemMessage(`Error fetching resumes: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }
    fetchResumes();
  }, []);

  // Helper function to show system messages via modal
  const showSystemMessage = (message, confirmButton = false, callback = null) => {
    setModalMessage(message);
    setModalCallback(() => callback); // Store callback
    setShowModal(true);
  };

  // Handler for creating a new resume
  const handleCreateNewResume = async () => {
    if (!newResumeName.trim()) {
      showSystemMessage("Resume name cannot be empty.");
      return;
    }
    setLoading(true);
    try {
      const sessionId = getSessionId();
      const res = await fetch('/api/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newResumeName, sessionId })
      });
      if (!res.ok) throw new Error('Failed to create resume');
      const newResume = await res.json();
      console.log('Resume created in MongoDB:', newResume);
      setNewResumeName('');
      showSystemMessage(`Resume "${newResumeName}" created successfully!`);
      setCurrentResume(newResume);
      setResumes(prev => [...prev, newResume]);
    } catch (error) {
      showSystemMessage(`Error creating resume: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = () => {
    const skill = newSkillInput.trim();
    if (skill && !currentResume.content.skills.some(s => s.skill.toLowerCase() === skill.toLowerCase())) {
      setIsAddingSkill(true);
      handleAddSectionItem('skills');
      handleContentChange('skills', 'skill', skill, currentResume.content.skills.length);
      setNewSkillInput('');
      setTimeout(() => setIsAddingSkill(false), 300);
    }
  };
  
  const handleClearAllSkills = () => {
    // Clear all skills logic
  };

  const handleAddSuggestionToExperience = (suggestion) => {
    setCurrentResume((prev) => ({
      ...prev,
      content: {
        ...prev.content,
        experience: [
          ...(prev.content.experience || []),
          { title: '', company: '', duration: '', description: suggestion }
        ],
      },
    }));
    setAiSuggestions((prev) => prev.filter((s) => s !== suggestion));
  };


  // Handler for selecting an existing resume
  const handleSelectResume = (resume) => {
    // Ensure personalInfo and summary always exist
    const content = typeof resume.content === "string"
      ? JSON.parse(resume.content)
      : resume.content;
    if (!content.personalInfo) content.personalInfo = {};
    if (typeof content.personalInfo.summary !== 'string') content.personalInfo.summary = "";
    setCurrentResume({
      ...resume,
      content
    });
  };

  // Handler for updating the current resume
  const handleUpdateResume = async () => {
    if (!currentResume) {
      showSystemMessage("No resume selected.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/resume', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: currentResume })
      });
      if (!res.ok) throw new Error('Failed to update resume');
      const updated = await res.json();
      console.log('Resume saved to MongoDB:', updated);
      showSystemMessage(`Resume "${currentResume.name}" updated successfully!`);
    } catch (error) {
      showSystemMessage(`Error updating resume: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Handler for deleting a resume
  const handleDeleteResume = (resumeId) => {
    console.log('Deleting resume with id:', resumeId); // Log the id for confirmation
    showSystemMessage("Are you sure you want to delete this resume?", true, async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/resume', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: resumeId })
        });
        if (!res.ok && res.status !== 204) throw new Error('Failed to delete resume');
        setResumes(prev => prev.filter(r => r.id !== resumeId));
        if (currentResume && currentResume.id === resumeId) {
          setCurrentResume(null);
        }
        showSystemMessage("Resume deleted successfully!");
      } catch (error) {
        showSystemMessage(`Error deleting resume: ${error.message}`);
      } finally {
        setLoading(false);
      }
    });
  };

  // Generic handler for updating resume content fields
  const handleContentChange = (section, field, value, index = null) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      const newContent = { ...prev.content };
      if (index !== null && Array.isArray(newContent[section])) {
        const newArray = [...newContent[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        newContent[section] = newArray;
      } else {
        newContent[section] = { ...newContent[section], [field]: value };
      }
      return { ...prev, content: newContent };
    });
  };

  // Handler for adding a new item to a section (e.g., new experience entry)
  const handleAddSectionItem = (section) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      const newContent = { ...prev.content };
      if (!newContent[section]) {
        newContent[section] = [];
      }
      if (section === 'experience') {
        newContent[section] = [...newContent[section], { title: '', company: '', duration: '', description: '' }];
      } else if (section === 'education') {
        newContent[section] = [...newContent[section], { degree: '', institution: '', year: '' }];
      } else if (section === 'skills') {
        newContent[section] = [...newContent[section], { skill: '' }];
      } else if (section === 'certifications') {
        newContent[section] = [...newContent[section], { name: '', issuer: '', year: '' }];
      }
      return { ...prev, content: newContent };
    });
  };

  // Handler for removing an item from a section
  const handleRemoveSectionItem = (section, index) => {
    setCurrentResume(prev => {
      if (!prev) return prev;
      const newContent = { ...prev.content };
      if (Array.isArray(newContent[section])) {
        const newArray = [...newContent[section]];
        newArray.splice(index, 1);
        newContent[section] = newArray;
      }
      return { ...prev, content: newContent };
    });
  };

  // Handler for generating AI suggestions based on job description
  const handleGenerateAISuggestions = async () => {
    if (!jobDescription.trim()) {
      showSystemMessage("Please enter a job description to get suggestions.");
      return;
    }
    setAiLoading(true);
    setAiSuggestions([]);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const suggestionsArray = await generateAISuggestions(jobDescription, apiKey);
      setAiSuggestions(suggestionsArray);
      if (suggestionsArray.length === 0) {
        showSystemMessage("No suggestions generated. Please try again.");
      }
      try {
        await savePromptAndResponse(jobDescription, suggestionsArray);
      } catch (e) {
        console.error('Failed to save prompt/response to Supabase:', e);
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error);
      showSystemMessage(`Error generating AI suggestions: ${error.message}`);
    } finally {
      setAiLoading(false);
    }
  };

  // Handler for AI text correction
  const handleCorrectText = async () => {
    if (!textToCorrect.trim()) {
      showSystemMessage("Please enter text to correct.");
      return;
    }
    setCorrectionLoading(true);
    setCorrectedText('');
    try {
      const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      const corrected = await aiCorrectText(textToCorrect, apiKey);
      if (corrected) {
        setCorrectedText(corrected);
      } else {
        showSystemMessage("No corrections generated. Please try again.");
      }
    } catch (error) {
      console.error("Error correcting text:", error);
      showSystemMessage(`Error correcting text: ${error.message}`);
    } finally {
      setCorrectionLoading(false);
    }
  };

  // PDF Export Functionality
  const handleExportPDF = () => {
    if (!currentResume) {
      showSystemMessage("Please select a resume to export.");
      return;
    }
    setPreviewVisible(true);      // triggers render of #resume-preview-area
    setStartPDFExport(true);      // triggers export logic after render
  };

  const templates = {
    Modern: ModernTemplate,
    Classic: ClassicTemplate,
    Minimalist: MinimalistTemplate,
    Creative: CreativeTemplate
  };

  useEffect(() => {
    const exportResume = async () => {
      if (!startPDFExport) return;

      await new Promise((r) => setTimeout(r, 200)); // give React time to render preview
      const input = document.getElementById('resume-preview-area');

      if (!input) {
        console.error("Preview DOM not found after delay!");
        showSystemMessage("Resume preview area not found for export.");
        setStartPDFExport(false);
        setPreviewVisible(false);
        return;
      }

      try {
        const canvas = await html2canvas(input, { scale: 2, useCORS: true });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft > 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${currentResume.name || 'resume'}.pdf`);
        showSystemMessage("Resume exported as PDF successfully!");
      } catch (error) {
        console.error("Export error:", error);
        showSystemMessage(`Error exporting PDF: ${error.message}`);
      }

      setStartPDFExport(false);
      setPreviewVisible(false);
    };

    exportResume();
  }, [startPDFExport]);

  // Loading state rendering
  if (loading) {
    return (
      <div className={"min-h-screen flex items-center justify-center " + themeClasses.bg + " text-white"}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500 mb-4"></div>
          <p className="text-xl font-semibold">Loading your career journey...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={"min-h-screen flex flex-col lg:flex-row " + themeClasses.bg + " font-inter relative"}>
      {/* Theme Toggle Button - top right, same as homepage */}
      <div className="fixed top-4 right-4 z-50">
        <ThemeToggle isDark={isDark} toggleTheme={toggleTheme} />
      </div>

      {/* Modal for system messages */}
      {showModal && (
        <Modal
          message={modalMessage}
          onClose={() => {
            setShowModal(false);
            setModalMessage('');
            setModalCallback(null);
          }}
          onConfirm={() => {
            if (modalCallback) {
              modalCallback();
            }
            setShowModal(false);
            setModalMessage('');
            setModalCallback(null);
          }}
          showConfirmButton={modalCallback !== null}
        />
      )}

      {/* Template Selector Modal */}
      {showTemplateSelector && (
        <div className="fixed inset-0 z-[200] bg-black bg-opacity-40 flex items-center justify-center">
          <div className={`relative w-full max-w-4xl max-h-[90vh] mx-auto overflow-y-auto rounded-xl shadow-2xl ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
            <ResumeTemplateSelector
              selectedTemplate={currentResume?.template || 'Modern'}
              setSelectedTemplate={(template) => {
                setCurrentResume((prev) => prev ? { ...prev, template } : prev);
              }}
              selectedColor={currentResume?.color || selectedColor}
              setSelectedColor={(color) => {
                setSelectedColor(color);
                setCurrentResume((prev) => prev ? { ...prev, color } : prev);
              }}
              onUseTemplate={(template, color) => {
                setCurrentResume((prev) => prev ? { ...prev, template, color } : prev);
                setShowTemplateSelector(false);
                showSystemMessage(`Template changed to "${template}"!`);
              }}
              onClose={() => setShowTemplateSelector(false)}
              isDark={isDark}
            />
          </div>
        </div>
      )}

      {/* Improved Sidebar */}
      <aside className={themeClasses.sidebarBg + " backdrop-blur-lg flex flex-col shadow-2xl z-10 overflow-hidden lg:h-screen lg:sticky lg:top-0 transition-all duration-300 ease-in-out border-r " + (isDark ? 'border-gray-700' : 'border-gray-200') + ' ' + (isSidebarCollapsed ? 'w-20' : 'w-full lg:w-80 min-w-[320px] max-w-[350px]')}>
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <button
              onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
              className={`w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center transition-transform duration-300 hover:scale-105 ${isSidebarCollapsed ? 'mx-auto' : ''}`}
            >
              <FileTextIcon className="w-6 h-6 text-white" />
            </button>
            {!isSidebarCollapsed && (
              <h2 className={"text-2xl font-bold " + themeClasses.text + " ml-3"}>Resume Builder</h2>
            )}
          </div>
        </div>

        {!isSidebarCollapsed && (
          <>
            {/* Create New Resume Section */}
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  // Simple toggle - you can replace this with actual state management
                  const form = document.getElementById('create-form');
                  if (form.style.display === 'none' || !form.style.display) {
                    form.style.display = 'block';
                  } else {
                    form.style.display = 'none';
                  }
                }}
                className={`w-full p-4 rounded-xl border-2 border-dashed transition-all duration-300 hover:scale-[1.02] ${
                  isDark 
                    ? 'border-gray-600 bg-gray-800/50 hover:border-blue-500 hover:bg-gray-800' 
                    : 'border-gray-300 bg-gray-50 hover:border-blue-500 hover:bg-blue-50'
                }`}
              >
                <div className="flex items-center justify-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-blue-900/50' : 'bg-blue-100'
                  }`}>
                    <PlusIcon className="w-5 h-5 text-blue-500" />
                  </div>
                  <div className="text-left">
                    <p className={`font-semibold ${themeClasses.text}`}>Create New Resume</p>
                    <p className={`text-sm ${themeClasses.textSecondary}`}>Start building your resume</p>
                  </div>
                </div>
              </button>

              {/* Create Form (Expandable) */}
              <div id="create-form" style={{ display: 'none' }} className="mt-4 space-y-3">
                <input
                  type="text"
                  placeholder="Enter resume name..."
                  value={newResumeName}
                  onChange={(e) => setNewResumeName(e.target.value)}
                  className={"w-full p-3 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-200 " + themeClasses.inputBg + " " + themeClasses.text}
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      handleCreateNewResume();
                      document.getElementById('create-form').style.display = 'none';
                    }}
                    disabled={!newResumeName.trim()}
                    className="flex-1 p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
                  >
                    Create
                  </button>
                  <button
                    onClick={() => {
                      document.getElementById('create-form').style.display = 'none';
                      setNewResumeName('');
                    }}
                    className={`px-4 py-3 rounded-lg border transition-all duration-200 ${
                      isDark 
                        ? 'border-gray-600 text-gray-400 hover:bg-gray-800' 
                        : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>

            {/* Resume List Header */}
            <div className="p-6 pb-3">
              <div className="flex items-center justify-between">
                <h3 className={"text-lg font-semibold " + themeClasses.text + " flex items-center gap-2"}>
                  Your Resumes
                  <span className={"text-sm px-2 py-1 rounded-full " + (isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-600')}>
                    {resumes.length}
                  </span>
                </h3>
                {resumes.length > 0 && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => showSystemMessage("View toggle coming soon!")}
                      className={`p-2 rounded-lg transition-all duration-200 ${
                        isDark ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                      title="Switch view mode"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Resume List */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
              {resumes.length === 0 ? (
                <div className="text-center py-12">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                    isDark ? 'bg-gray-800' : 'bg-gray-100'
                  }`}>
                    <FileTextIcon className={`w-8 h-8 ${themeClasses.textSecondary}`} />
                  </div>
                  <p className={`${themeClasses.textSecondary} mb-2`}>No resumes yet</p>
                  <p className={`text-sm ${themeClasses.textSecondary}`}>Create your first resume to get started</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {resumes.map((resume) => (
                    <div
                      key={resume.id}
                      className={"group relative rounded-xl border-2 transition-all duration-300 cursor-pointer " +
                        (currentResume?.id === resume.id
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white border-blue-500 shadow-lg scale-[1.02]'
                          : isDark
                            ? 'bg-gray-800/50 border-gray-700 text-gray-200 hover:bg-gray-800 hover:border-blue-500/50 hover:shadow-lg'
                            : 'bg-white border-gray-200 text-gray-800 hover:bg-blue-50 hover:border-blue-300 hover:shadow-md')}
                      onClick={() => handleSelectResume(resume)}
                    >
                      <div className="p-4">
                        <div className="flex items-start gap-3">
                          {/* Resume Icon */}
                          <div className={"mt-1 w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 " +
                            (currentResume?.id === resume.id 
                              ? 'bg-white/20' 
                              : isDark ? 'bg-blue-900/30' : 'bg-blue-100')}>
                            <FileTextIcon className={"w-5 h-5 " + (currentResume?.id === resume.id ? 'text-white' : 'text-blue-500')} />
                          </div>

                          {/* Resume Info */}
                          <div className="flex-1 min-w-0">
                            <h4 className={"font-semibold truncate " + (currentResume?.id === resume.id ? 'text-white' : themeClasses.text)}>
                              {resume.name}
                            </h4>
                              <div className={"flex items-center gap-2 mt-1 text-xs " + (currentResume?.id === resume.id ? 'text-blue-100' : themeClasses.textSecondary)}>
                                <span>{resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Today'}</span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="10"></circle>
                                    <polyline points="12,6 12,12 16,14"></polyline>
                                  </svg>
                                  Recent
                                </span>
                              </div>
                            
                            {/* Progress indicator */}
                            <div className="mt-2">
                              <div className={"flex items-center gap-2 text-xs " + (currentResume?.id === resume.id ? 'text-blue-100' : themeClasses.textSecondary)}>
                                <span>Completeness</span>
                                <div className={"flex-1 h-1.5 rounded-full overflow-hidden " + (currentResume?.id === resume.id ? 'bg-white/30' : isDark ? 'bg-gray-700' : 'bg-gray-200')}>
                                  <div 
                                    className={"h-full transition-all duration-500 " + (currentResume?.id === resume.id ? 'bg-white' : 'bg-green-500')}
                                    style={{ width: `${(resume.completeness || 25)}%` }}
                                  />
                                </div>
                                <span>{(resume.completeness || 25)}%</span>
                              </div>
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className={"flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 " + (currentResume?.id === resume.id ? 'opacity-100' : '')}>
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                const resumeToDuplicate = resumes.find(r => r.id === resume.id);
                                if (resumeToDuplicate) {
                                  showSystemMessage("Duplicate feature coming soon!");
                                }
                              }}
                              className={"p-1.5 rounded-lg transition-all duration-200 " +
                                (currentResume?.id === resume.id
                                  ? 'text-white hover:bg-white/20'
                                  : isDark ? 'text-gray-400 hover:text-blue-400 hover:bg-gray-700' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-100')}
                              title="Duplicate Resume"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                              </svg>
                            </button>
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                showSystemMessage("Edit feature coming soon!"); 
                              }}
                              className={"p-1.5 rounded-lg transition-all duration-200 " +
                                (currentResume?.id === resume.id
                                  ? 'text-white hover:bg-white/20'
                                  : isDark ? 'text-gray-400 hover:text-yellow-400 hover:bg-gray-700' : 'text-gray-500 hover:text-yellow-600 hover:bg-yellow-100')}
                              title="Rename Resume"
                            >
                              <EditIcon className="w-4 h-4" />
                            </button>
                            <button
                              onClick={(e) => { 
                                e.stopPropagation(); 
                                handleDeleteResume(resume.id); 
                              }}
                              className={"p-1.5 rounded-lg transition-all duration-200 " +
                                (currentResume?.id === resume.id
                                  ? 'text-white hover:bg-red-500/20'
                                  : isDark ? 'text-gray-400 hover:text-red-400 hover:bg-gray-700' : 'text-gray-500 hover:text-red-600 hover:bg-red-100')}
                              title="Delete Resume"
                            >
                              <Trash2Icon className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Active Resume Indicator */}
                      {currentResume?.id === resume.id && (
                        <div className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Actions */}
            {resumes.length > 0 && (
              <div className={"p-6 pt-3 border-t " + (isDark ? 'border-gray-700' : 'border-gray-200')}>
                <div className="flex gap-2">

                </div>
              </div>
            )}
          </>
        )}
      </aside>

      {/* Main Content Area */}
      <main className={"flex-grow p-6 overflow-y-auto " + themeClasses.text + " min-w-0"}> 
        {currentResume ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Resume Editor Column */}
            <section className="lg:col-span-2 space-y-6">
            <h1 className={"text-4xl font-extrabold mb-4 " + themeClasses.text + " flex items-center gap-3"}>
  <PenToolIcon className="w-9 h-9 text-blue-500" />
  {currentResume.name}
  <button
    onClick={handleUpdateResume}
    className={`ml-auto group relative py-2 px-4 rounded-lg font-medium text-sm text-white
      bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800 
      active:from-blue-800 active:to-blue-900
      transition-all duration-300 ease-out
      hover:scale-105 hover:shadow-lg hover:shadow-blue-500/25
      focus:outline-none focus:ring-4 focus:ring-blue-500/30
      transform hover:-translate-y-0.5
      border border-blue-500/20
      backdrop-blur-sm
      ${themeClasses.buttonPrimary}`}
  >
    <span className="flex items-center gap-2">
      <svg 
        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:scale-110" 
        fill="none" 
        stroke="currentColor" 
        viewBox="0 0 24 24"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3-3m0 0l-3 3m3-3v12" 
        />
      </svg>
      Save Resume
    </span>
    
    {/* Animated shine effect */}
    <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/10 to-transparent 
        transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
    </div>
  </button>
</h1>


              {/* Personal Info Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 " + themeClasses.text}>Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    placeholder="Full Name"
                    value={currentResume.content.personalInfo.name || ""}
                    onChange={(e) => handleContentChange('personalInfo', 'name', e.target.value)}
                    className={"p-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={currentResume.content.personalInfo.email || ""}
                    onChange={(e) => handleContentChange('personalInfo', 'email', e.target.value)}
                    className={"p-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={currentResume.content.personalInfo.phone || ""}
                    onChange={(e) => handleContentChange('personalInfo', 'phone', e.target.value)}
                    className={"p-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    value={currentResume.content.personalInfo.location || ""}
                    onChange={(e) => handleContentChange('personalInfo', 'location', e.target.value)}
                    className={"p-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                  />
                  <input
                    type="url"
                    placeholder="LinkedIn Profile"
                    value={currentResume.content.personalInfo.linkedin || ""}
                    onChange={(e) => handleContentChange('personalInfo', 'linkedin', e.target.value)}
                    className={"p-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                  />
                </div>
              </div>

              {/* Summary Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 " + themeClasses.text}>Summary</h2>
                <textarea
                  placeholder="A concise summary of your professional background and goals..."
                  value={currentResume.content.personalInfo.summary || ""}
                  onChange={(e) => handleContentChange('personalInfo', 'summary', e.target.value)}
                  rows="5"
                  className={"w-full p-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                ></textarea>
              </div>

              {/* Experience Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 " + themeClasses.text}>Experience</h2>
                {currentResume.content.experience.map((exp, index) => (
                  <div key={index} className={`mb-6 p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50/30 border-gray-200'}`}>
                    <input
                      type="text"
                      placeholder="Job Title"
                      value={exp.title}
                      onChange={(e) => handleContentChange('experience', 'title', e.target.value, index)}
                      className={"w-full p-2 mb-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    />
                    <input
                      type="text"
                      placeholder="Company"
                      value={exp.company}
                      onChange={(e) => handleContentChange('experience', 'company', e.target.value, index)}
                      className={"w-full p-2 mb-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    />
                    <input
                      type="text"
                      placeholder="Duration (e.g., Jan 2020 - Dec 2022)"
                      onChange={(e) => handleContentChange('experience', 'duration', e.target.value, index)}
                      className={"w-full p-2 mb-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    />
                    <textarea
                      placeholder="Key achievements and responsibilities (use bullet points)"
                      value={exp.description}
                      onChange={(e) => handleContentChange('experience', 'description', e.target.value, index)}
                      rows="4"
                      className={"w-full p-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    ></textarea>
                    <button
                      onClick={() => handleRemoveSectionItem('experience', index)}
                      className={"mt-3 py-1.5 px-4 rounded-lg text-sm font-semibold transition duration-300 " + (isDark ? 'bg-red-700 hover:bg-red-800 text-white' : 'bg-red-500 hover:bg-red-600 text-white')}
                    >
                      Remove Experience
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddSectionItem('experience')}
                  className={"mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 " + themeClasses.buttonSecondary + " border"}
                >
                  <PlusIcon className="inline w-4 h-4 mr-2" /> Add Experience
                </button>
              </div>

              {/* Education Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 " + themeClasses.text}>Education</h2>
                {currentResume.content.education.map((edu, index) => (
                  <div key={index} className={`mb-6 p-4 rounded-lg border ${isDark ? 'bg-gray-700/30 border-gray-600' : 'bg-gray-50/30 border-gray-200'}`}>
                    <input
                      type="text"
                      placeholder="Degree/Field of Study"
                      value={edu.degree}
                      onChange={(e) => handleContentChange('education', 'degree', e.target.value, index)}
                      className={"w-full p-2 mb-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    />
                    <input
                      type="text"
                      placeholder="Institution"
                      value={edu.institution}
                      onChange={(e) => handleContentChange('education', 'institution', e.target.value, index)}
                      className={"w-full p-2 mb-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    />
                    <input
                      type="text"
                      placeholder="Year of Graduation"
                      value={edu.year}
                      onChange={(e) => handleContentChange('education', 'year', e.target.value, index)}
                      className={"w-full p-2 rounded-md text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                    />
                    <button
                      onClick={() => handleRemoveSectionItem('education', index)}
                      className={"mt-3 py-1.5 px-4 rounded-lg text-sm font-semibold transition duration-300 " + (isDark ? 'bg-red-700 hover:bg-red-800 text-white' : 'bg-red-500 hover:bg-red-600 text-white')}
                    >
                      Remove Education
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => handleAddSectionItem('education')}
                  className={"mt-4 w-full py-2 px-4 rounded-lg font-semibold transition-all duration-300 " + themeClasses.buttonSecondary + " border"}
                >
                  <PlusIcon className="inline w-4 h-4 mr-2" /> Add Education
                </button>
              </div>

              {/* Skills Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 " + themeClasses.text}>Skills</h2>
                
                {/* Skills Display */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {currentResume.content.skills.map((skill, index) => (
                    <span 
                      key={index} 
                      className={
                        "inline-flex items-center px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 " + 
                        (isDark ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-blue-100 text-blue-800 hover:bg-blue-200')
                      }
                    >
                      {skill.skill}
                      <button
                        onClick={() => handleRemoveSectionItem('skills', index)}
                        className={
                          "ml-1 hover:text-opacity-75 transition-opacity duration-200 rounded-full p-0.5 " +
                          (isDark ? 'text-white hover:bg-blue-700' : 'text-blue-800 hover:bg-blue-300')
                        }
                        aria-label={`Remove skill ${skill.skill}`}
                        title={`Remove ${skill.skill}`}
                      >
                        <XIcon className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                  
                  {currentResume.content.skills.length === 0 && (
                    <p className={"text-sm italic " + (isDark ? 'text-gray-400' : 'text-gray-500')}>
                      No skills added yet. Add your first skill below.
                    </p>
                  )}
                </div>
                
                {/* Add New Skill */}
                <div className="flex gap-2">
                  <div className="flex-grow relative">
                    <input
                      ref={skillInputRef}
                      type="text"
                      placeholder="Add a new skill (e.g., JavaScript, Project Management)"
                      value={newSkillInput}
                      onChange={(e) => setNewSkillInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddSkill();
                        }
                        if (e.key === 'Escape') {
                          setNewSkillInput('');
                          e.target.blur();
                        }
                      }}
                      className={
                        "w-full p-3 rounded-lg text-sm border transition-colors duration-200 focus:outline-none focus:ring-2 " +
                        themeClasses.inputBg + " " + themeClasses.text + " " +
                        (isDark 
                          ? 'border-gray-600 focus:ring-blue-500 focus:border-blue-500' 
                          : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
                        )
                      }
                      maxLength={50}
                      disabled={isAddingSkill}
                    />
                    {newSkillInput.length > 40 && (
                      <span className={"absolute right-3 top-1/2 transform -translate-y-1/2 text-xs " + (isDark ? 'text-gray-400' : 'text-gray-500')}>
                        {50 - newSkillInput.length}
                      </span>
                    )}
                  </div>
                  
                  <button
                    onClick={handleAddSkill}
                    disabled={!newSkillInput.trim() || isAddingSkill}
                    className={
                      "p-3 rounded-lg border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 " +
                      (!newSkillInput.trim() || isAddingSkill
                        ? (isDark ? 'bg-gray-700 border-gray-600 text-gray-500 cursor-not-allowed' : 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed')
                        : themeClasses.buttonSecondary + " hover:scale-105 active:scale-95 " + (isDark ? 'focus:ring-blue-500' : 'focus:ring-blue-500'))
                    }
                    title={newSkillInput.trim() ? "Add skill" : "Enter a skill name first"}
                    aria-label="Add new skill"
                  >
                    {isAddingSkill ? (
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <PlusIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
                
                {/* Skill suggestions (optional) */}
                {showSuggestions && skillSuggestions.length > 0 && (
                  <div className={"mt-2 p-2 rounded-lg border " + (isDark ? 'bg-gray-800 border-gray-600' : 'bg-gray-50 border-gray-200')}>
                    <p className={"text-xs font-medium mb-2 " + (isDark ? 'text-gray-300' : 'text-gray-600')}>
                      Suggested skills:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {skillSuggestions.slice(0, 5).map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => {
                            setNewSkillInput(suggestion);
                            setShowSuggestions(false);
                            skillInputRef.current?.focus();
                          }}
                          className={
                            "px-2 py-1 text-xs rounded transition-colors duration-200 " +
                            (isDark 
                              ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            )
                          }
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Skills count and actions */}
                <div className={"flex justify-between items-center mt-3 pt-3 border-t " + (isDark ? 'border-gray-700' : 'border-gray-200')}>
                  <span className={"text-xs " + (isDark ? 'text-gray-400' : 'text-gray-500')}>
                    {currentResume.content.skills.length} skill{currentResume.content.skills.length !== 1 ? 's' : ''} added
                  </span>
                  
                  {currentResume.content.skills.length > 0 && (
                    <button
                      onClick={() => {
                        if (window.confirm('Are you sure you want to clear all skills?')) {
                          handleClearAllSkills();
                        }
                      }}
                      className={
                        "text-xs px-2 py-1 rounded transition-colors duration-200 " +
                        (isDark 
                          ? 'text-red-400 hover:bg-red-900/20' 
                          : 'text-red-600 hover:bg-red-100'
                        )
                      }
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </div>

{/* Certifications Card */}
<div className={`p-6 rounded-xl shadow-lg border transition-all duration-300 hover:shadow-xl ${themeClasses.cardBg}`}>
  <div className="flex items-center justify-between mb-6">
    <h2 className={`text-2xl font-semibold ${themeClasses.text}`}>
      <span className="flex items-center gap-2">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        Certifications
      </span>
    </h2>
    {currentResume.content.certifications?.length > 0 && (
      <span className={`text-sm px-2 py-1 rounded-full ${isDark ? 'bg-blue-900/20 text-blue-300' : 'bg-blue-100 text-blue-700'}`}>
        {currentResume.content.certifications.length}
      </span>
    )}
  </div>

  <div className="space-y-4 mb-6">
    {(currentResume.content.certifications || []).map((cert, index) => (
      <div 
        key={index} 
        className={`group relative p-4 rounded-lg border transition-all duration-300 hover:scale-[1.01] ${
          isDark 
            ? 'bg-gradient-to-r from-blue-900/10 to-purple-900/10 border-blue-900/20 hover:border-blue-800/40' 
            : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 hover:border-blue-300'
        }`}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Certification Name */}
          <div className="md:col-span-5">
            <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Certification Name
            </label>
            <input
              type="text"
              placeholder="e.g., AWS Certified Solutions Architect"
              value={cert.name || ''}
              onChange={e => handleContentChange('certifications', 'name', e.target.value, index)}
              className={`w-full p-2.5 rounded-md text-sm border transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                themeClasses.inputBg
              } ${themeClasses.text} ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Issuer */}
          <div className="md:col-span-4">
            <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Issuing Organization
            </label>
            <input
              type="text"
              placeholder="e.g., Amazon Web Services"
              value={cert.issuer || ''}
              onChange={e => handleContentChange('certifications', 'issuer', e.target.value, index)}
              className={`w-full p-2.5 rounded-md text-sm border transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                themeClasses.inputBg
              } ${themeClasses.text} ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Year */}
          <div className="md:col-span-2">
            <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
              Year
            </label>
            <input
              type="text"
              placeholder="2024"
              value={cert.year || ''}
              onChange={e => handleContentChange('certifications', 'year', e.target.value, index)}
              className={`w-full p-2.5 rounded-md text-sm border transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
                themeClasses.inputBg
              } ${themeClasses.text} ${
                isDark ? 'border-gray-700' : 'border-gray-300'
              }`}
            />
          </div>

          {/* Remove Button */}
          <div className="md:col-span-1 flex justify-center">
            <button
              onClick={() => handleRemoveSectionItem('certifications', index)}
              className={`p-2 rounded-lg text-sm font-medium transition-all duration-300 opacity-70 group-hover:opacity-100 hover:scale-110 ${
                isDark 
                  ? 'bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 border border-red-900/30' 
                  : 'bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200'
              }`}
              title="Remove Certification"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Optional: Add expiration date field */}
        <div className="mt-3 pt-3 border-t border-gray-200/50">
          <label className={`text-xs font-medium mb-1 block ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            Expiration Date (Optional)
          </label>
          <input
            type="text"
            placeholder="Never expires / MM/YYYY"
            value={cert.expiration || ''}
            onChange={e => handleContentChange('certifications', 'expiration', e.target.value, index)}
            className={`w-full md:w-48 p-2 rounded-md text-sm border transition-all duration-200 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 ${
              themeClasses.inputBg
            } ${themeClasses.text} ${
              isDark ? 'border-gray-700' : 'border-gray-300'
            }`}
          />
        </div>
      </div>
    ))}

    {/* Empty State */}
    {(!currentResume.content.certifications || currentResume.content.certifications.length === 0) && (
      <div className={`text-center py-12 rounded-lg border-2 border-dashed transition-all duration-300 ${
        isDark 
          ? 'border-gray-700 bg-gray-800/20' 
          : 'border-gray-300 bg-gray-50/50'
      }`}>
        <svg className={`w-12 h-12 mx-auto mb-4 ${isDark ? 'text-gray-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
        </svg>
        <p className={`text-sm font-medium mb-2 ${isDark ? 'text-gray-400' : 'text-gray-500'}`}>
          No certifications added yet
        </p>
        <p className={`text-xs ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
          Showcase your professional certifications and credentials
        </p>
      </div>
    )}
  </div>

  {/* Add Button */}
  <button
    onClick={() => handleAddSectionItem('certifications')}
    className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 border-2 border-dashed hover:border-solid group ${
      themeClasses.buttonSecondary
    } hover:scale-[1.02] hover:shadow-md`}
  >
    <span className="flex items-center justify-center gap-2">
      <PlusIcon className="w-5 h-5 transition-transform duration-300 group-hover:scale-110" />
      Add Certification
    </span>
  </button>
</div>
            </section>

            {/* AI Tools & Preview Column */}
            <section className="lg:col-span-1 space-y-6 flex flex-col">
              {/* AI Job Description Suggestions Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 flex items-center " + themeClasses.text}>
                  <LightbulbIcon className="mr-2" /> AI Job Description Suggestions
                </h2>
                <textarea
                  placeholder="Paste job description here for AI suggestions..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  rows="6"
                  className={"w-full p-3 mb-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                ></textarea>
                <button
                  onClick={handleGenerateAISuggestions}
                  className={"w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 shadow-md " + themeClasses.buttonPrimary}
                  disabled={aiLoading}
                >
                  {aiLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Generating...
                    </span>
                  ) : (
                    <span>Generate Suggestions</span>
                  )}
                </button>
                {aiSuggestions.length > 0 && (
                  <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100/50 border-gray-200'}`}>
                    <h3 className={`font-semibold mb-2 ${themeClasses.text}`}>Suggestions:</h3>
                    <p className={`text-xs mb-2 ${themeClasses.textSecondary}`}>Note: If any suggestions below are projects, these are recommended for you to complete first before adding them to your resume. Do not add projects you have not actually done.</p>
                    <ul className="list-disc list-inside text-sm space-y-1">
                      {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className={themeClasses.textSecondary}>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: suggestion.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            }}
                          />
                          <button
                            onClick={() => handleAddSuggestionToExperience(suggestion)}
                            className="ml-2 text-blue-500 hover:text-blue-400 text-xs font-semibold"
                          >
                            (Add to Experience)
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* AI Text Corrector Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 flex items-center " + themeClasses.text}>
                  <PenToolIcon className="mr-2" /> AI Text Corrector
                </h2>
                <textarea
                  placeholder="Paste text for grammar and style correction..."
                  value={textToCorrect}
                  onChange={(e) => setTextToCorrect(e.target.value)}
                  rows="4"
                  className={"w-full p-3 mb-3 rounded-lg text-sm " + themeClasses.inputBg + " " + themeClasses.text}
                ></textarea>
                <button
                  onClick={handleCorrectText}
                  className={"w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 shadow-md " + themeClasses.buttonPrimary}
                  disabled={correctionLoading}
                >
                  {correctionLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 0 1 8-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                      Correcting...
                    </span>
                  ) : (
                    <span>Correct Text</span>
                  )}
                </button>
                {correctedText && (
                  <div className={`mt-4 p-4 rounded-lg border ${isDark ? 'bg-gray-700/50 border-gray-600' : 'bg-gray-100/50 border-gray-200'}`}>
                    <h3 className={`font-semibold mb-2 ${themeClasses.text}`}>Corrected Text:</h3>
                    <p className={`${themeClasses.textSecondary} text-sm whitespace-pre-wrap`}>{correctedText}</p>
                  </div>
                               )}
              </div>
              {/* Template Selection Card */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 flex items-center " + themeClasses.text}>
                  {/* Inline SVG for layout template icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-layout-template mr-2"
                  >
                    <rect width="7" height="7" x="3" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="3" rx="1" />
                    <rect width="7" height="7" x="14" y="14" rx="1" />
                    <rect width="7" height="7" x="3" y="14" rx="1" />
                  </svg>
                  Resume Templates
                </h2>

                <p className=" text-gray-400 mb-4">Choose from various professional templates:</p>
                <button
                  onClick={() => setShowTemplateSelector(true)}
                  className={"w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 shadow-md flex items-center justify-center " + themeClasses.buttonPrimary}
                >
                  Choose Template
                </button>
                <p className="text-sm  text-gray-400 mt-3">
                  Selected Template: <span className="font-semibold">{currentResume.template}</span>
                </p>
              </div>

              {/* Export Options Card - Made functional */}
              <div className={"p-6 rounded-xl shadow-lg border " + themeClasses.cardBg}>
                <h2 className={"text-2xl font-semibold mb-4 flex items-center " + themeClasses.text}>
                  <DownloadIcon className="mr-2" /> Export Options
                </h2>
                <button
                  onClick={handleExportPDF}
                  className={"w-full py-3 px-6 rounded-lg font-semibold text-lg transition duration-300 shadow-md flex items-center justify-center " + themeClasses.buttonPrimary}
                >
                  <DownloadIcon /> <span className="ml-2">Download as PDF</span>
                </button>
                <p className={"text-sm " + themeClasses.textSecondary + " mt-2 text-center"}>DOCX export would require server-side processing or a more advanced library.</p>
              </div>
            </section>
          </div>
        ) : (
          // Placeholder message when no resume is selected
          <div className={"flex flex-col items-center justify-center h-full " + themeClasses.textSecondary + " min-h-[50vh]"}>
            <FileTextIcon className="w-24 h-24 mb-4 text-gray-400" />
            <p className="text-xl">Please select a resume from the sidebar or create a new one to start building!</p>
          </div>
        )}
      </main>

      {/* Resume Preview Area for Export - only rendered when exporting */}
      {previewVisible && currentResume && (
        <div style={{ position: 'absolute', top: '-9999px', left: '-9999px', zIndex: -1 }}>
          <div id="resume-preview-area" style={{ width: '794px', minHeight: '1123px', padding: '20px', background: '#fff', color: '#222' }}>
            {(() => {
              const TemplateComponent = templates[currentResume.template] || templates.Modern;
              return <TemplateComponent data={currentResume.content} isDark={false} selectedColor={currentResume.color || 'blue'} />;
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

// Wrap App with ThemeProvider
const AppWrapper = () => (
  <ThemeProvider>
    <App />
  </ThemeProvider>
);

export default AppWrapper;
