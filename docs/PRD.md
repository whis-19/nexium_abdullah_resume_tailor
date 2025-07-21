# Product Requirements Document (PRD)

## Product Overview
The AI-powered Resume Tailor is a web application that enables users to generate tailored resumes for specific job descriptions using AI. Users can securely log in, input their skills and experience, and receive a downloadable, AI-generated resume. The app features a dashboard for managing saved resumes and supports fast, secure, and responsive interactions.

---

## Core Features

1. **Magic Link Email Authentication**
   - Users log in via a secure magic link sent to their email.
   - No password required for ease of use and security.

2. **User Input Form**
   - Collects user skills, experience, and the target job description.
   - Validates input for completeness and correctness.

3. **AI-Generated Tailored Resume**
   - Uses AI to generate a resume tailored to the provided job description.
   - Allows users to preview and edit the generated resume before saving.

4. **Downloadable PDF**
   - Users can download the tailored resume as a PDF.
   - Option to save resumes to their dashboard for future access.

5. **User Dashboard**
   - Displays history of saved resumes.
   - Provides access to the input form and resume previews.
   - Allows deletion and management of saved resumes.

---

## User Flow

1. **Landing Page**
   - Clear value proposition and CTA for email login.
2. **Login**
   - User enters email and receives a magic link.
   - On click, user is authenticated and redirected to dashboard.
3. **Dashboard**
   - Shows list of saved resumes and option to create a new one.
4. **Input Form**
   - User enters skills, experience, and job description.
   - Form validation and error handling for invalid/empty input.
5. **Resume Preview**
   - AI generates tailored resume.
   - User can edit, save, or download as PDF.
   - Error handling for AI failures or PDF generation issues.
6. **Save/Download**
   - Resume is saved to dashboard and/or downloaded as PDF.

---

## Non-Functional Requirements

- **Secure Authentication**: Magic link system with email verification, secure session management, and protection against unauthorized access.
- **Responsive UI**: Fully responsive design for desktop, tablet, and mobile devices.
- **Fast AI Processing**: AI resume generation should complete within a few seconds for a smooth user experience.
- **Accessibility**: Meets WCAG 2.1 AA standards.
- **Data Privacy**: User data is encrypted in transit and at rest; complies with GDPR.
- **Error Handling**: Clear, user-friendly error messages for all failure states (invalid input, failed login, AI errors, etc.).

---

## Error States

- **Invalid Input**: User submits incomplete or invalid form data.
- **Failed Login**: Email not found, expired/invalid magic link.
- **AI Generation Failure**: AI service unavailable or returns an error.
- **PDF Generation Failure**: Resume cannot be exported as PDF.
- **Network Issues**: Loss of connectivity or server errors.

---

## Success Metrics

- User sign-up and retention rates.
- Number of resumes generated and downloaded.
- Average AI processing time.
- User satisfaction (feedback, NPS).

---

## Future Enhancements

- Support for multiple resume templates.
- Integration with LinkedIn for profile import.
- Multi-language support.
- Analytics dashboard for users. 