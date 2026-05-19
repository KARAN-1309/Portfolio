import { useState } from 'react';
import LoadingScreen from './LoadingScreen';
import Navbar from './Navbar';
import HeroSection from './HeroSection';
import EducationSection from './EducationSection';
import SkillsSection from './SkillsSection';
import ProjectsSection from './ProjectsSection';
import AchievementsSection from './AchievementsSection';
import ContactSection from './ContactSection';
// Note: Ensure ChatbotWidget is actually in a 'components' folder, 
// or change this to './ChatbotWidget' if it is in the same folder as App.jsx
import ChatbotWidget from './ChatbotWidget'; 
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [assetsReady, setAssetsReady] = useState(false);

  return (
    <>
      {/* Global noise texture overlay for depth (defined in App.css) */}
      <div className="noise-overlay" />

      {/* Loading Screen overlays everything until both the timer and asset preload complete */}
      {isLoading && (
        <LoadingScreen
          assetsReady={assetsReady}
          onDone={() => setIsLoading(false)}
        />
      )}

      {/* Main Application Wrapper (Forced Dark/Cyberpunk Theme) */}
      <div>
        
        {/* Render Navbar (No props needed anymore) */}
        <Navbar />

        <main>
          <HeroSection onAssetsReady={() => setAssetsReady(true)} />
          
          <div className="section-divider" />
          
          <EducationSection />
          
          <div className="section-divider" />
          
          <SkillsSection />
          
          <div className="section-divider" />
          
          <ProjectsSection />
          
          <div className="section-divider" />
          
          <AchievementsSection />
          
          <div className="section-divider" />
          
          <ContactSection />
        </main>

        {/* The K-1 Chatbot Widget is now rendered at the root level */}
        <ChatbotWidget />
        
      </div>
    </>
  );
}