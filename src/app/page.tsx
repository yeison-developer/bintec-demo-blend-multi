'use client';

import { useState, useEffect } from 'react';
import '../amplify-config'; // Configure Amplify
import Registration from '../components/Registration';
import InitialQuestion from '../components/InitialQuestion';
import AgentOrchestration from '../components/AgentOrchestration';
import ConsolidatedDashboard from '../components/ConsolidatedDashboard';
import ResultsGeneration from '../components/ResultsGeneration';
import EmailMockup from '../components/EmailMockup';

export default function Home() {
  const [step, setStep] = useState(0);
  const [userData, setUserData] = useState({ name: '', email: '', position: '' });
  const [question, setQuestion] = useState('');
  const [analysisResult, setAnalysisResult] = useState(null);

  // Load from localStorage on mount
  useEffect(() => {
    const savedUserData = localStorage.getItem('userData');
    const savedQuestion = localStorage.getItem('question');
    const savedStep = localStorage.getItem('step');
    if (savedUserData) setUserData(JSON.parse(savedUserData));
    if (savedQuestion) setQuestion(savedQuestion);
    if (savedStep) setStep(parseInt(savedStep));
  }, []);

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);

  useEffect(() => {
    localStorage.setItem('question', question);
  }, [question]);

  useEffect(() => {
    localStorage.setItem('step', step.toString());
  }, [step]);

  const nextStep = () => setStep(step + 1);
  const goToRegistration = () => setStep(0);

  const screens = [
    <Registration key="reg" userData={userData} setUserData={setUserData} nextStep={nextStep} />,
    <InitialQuestion key="question" question={question} setQuestion={setQuestion} nextStep={nextStep} />,
    <AgentOrchestration key="orchestration" userData={userData} question={question} setAnalysisResult={setAnalysisResult} nextStep={nextStep} />,
    <ConsolidatedDashboard key="dashboard" analysisResult={analysisResult} nextStep={nextStep} />,
    <ResultsGeneration key="results" userData={userData} question={question} nextStep={nextStep} />,
    <EmailMockup key="email" userData={userData} goToRegistration={goToRegistration} />
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 flex items-center justify-center p-4">
      {screens[step]}
    </div>
  );
}
