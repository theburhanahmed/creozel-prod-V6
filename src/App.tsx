import React, { useCallback, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Topbar } from './components/layout/Topbar';
import { Sidebar } from './components/layout/Sidebar';
import { Dashboard } from './components/dashboard/Dashboard';
import { TextEditor } from './pages/content/TextEditor';
import { ImageEditor } from './pages/content/ImageEditor';
import { AudioEditor } from './pages/content/AudioEditor';
import { VideoEditor } from './pages/content/VideoEditor';
import { SocialMedia } from './pages/SocialMedia';
import { Analytics } from './pages/Analytics';
import { Calendar } from './pages/Calendar';
import { Messages } from './pages/Messages';
import { Team } from './pages/Team';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { Toaster } from 'sonner';
import { MenuButton } from './components/layout/MenuButton';
import { AutopilotDashboard } from './pages/autopilot/AutopilotDashboard';
import { CreatePipeline } from './pages/autopilot/CreatePipeline';
import { VideoGenerator } from './pages/autopilot/VideoGenerator';
import { CustomTemplates } from './pages/autopilot/CustomTemplates';
import { PostScheduler } from './pages/autopilot/PostScheduler';
import { MediaLibrary } from './pages/autopilot/MediaLibrary';
import { EngagementAnalytics } from './pages/autopilot/EngagementAnalytics';
import { Login } from './pages/auth/Login';
import { AuthGuard } from './components/auth/AuthGuard';
import { SocialAccounts } from './pages/SocialAccounts';
import { MediaGallery } from './pages/MediaGallery';
import { AffiliatePage } from './pages/affiliate/AffiliatePage';
import { HomeIcon, BarChart2Icon, CalendarIcon, MessageSquareIcon, UsersIcon, PenToolIcon, RocketIcon, GlobeIcon, DollarSignIcon, FileTextIcon, ImageIcon, VideoIcon, MicIcon } from 'lucide-react';
import { Card, CardMenu } from './components/ui/Card';
import { UsageHistory } from './pages/credits/UsageHistory';
import { AddCredits } from './pages/credits/AddCredits';
import { TransactionHistory } from './pages/credits/TransactionHistory';
export function App() {
  // Theme handling - always dark mode to match the design
  const [isDarkMode, setIsDarkMode] = useState(true);
  // Sidebar state
  const [showMenu, setShowMenu] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);
  // Toggle theme function
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prevMode => {
      const newMode = !prevMode;
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return newMode;
    });
  }, []);
  // Apply theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);
  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setIsMobileView(width < 1024);
      if (width >= 1024) {
        setShowMenu(false);
      }
    };
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  // Handle click outside sidebar on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const menuButton = document.getElementById('menu-button');
      if (!menuButton) return;
      const clickedElement = event.target as Node;
      if (!menuButton.contains(clickedElement)) {
        setShowMenu(false);
      }
    };
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);
  // Handle admin redirection
  useEffect(() => {
    const handleAdminRedirect = () => {
      const user = localStorage.getItem('user');
      if (user) {
        const userData = JSON.parse(user);
        if (userData.isAdmin) {
          // Admin users are handled by the AuthGuard component
          console.log('Admin user detected');
        }
      }
    };
    handleAdminRedirect();
  }, []);
  return <BrowserRouter>
      <div className={`relative min-h-screen w-full bg-gray-50 dark:bg-[#0A0E14] transition-colors duration-300`}>
        <Routes>
          {/* Public auth routes */}
          <Route path="/auth/login" element={<Login />} />
          {/* Protected app routes */}
          <Route path="/*" element={<AuthGuard>
                <div className="flex min-h-screen w-full">
                  {/* Sidebar */}
                  <Sidebar id="sidebar" isVisible={true} onClose={() => {}} isDarkMode={isDarkMode} />
                  {/* Main content - Adjust margin to account for collapsed sidebar */}
                  <div className="flex-1 flex flex-col min-w-0 w-full ml-20 transition-all duration-300">
                    <Topbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} toggleMenu={() => setShowMenu(!showMenu)} isMobile={isMobileView} />
                    {/* Add CardMenu here */}
                    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
                      {location.pathname === '/' && <CardMenu items={[{
                  icon: <HomeIcon />,
                  title: 'Home',
                  href: '/'
                }, {
                  icon: <PenToolIcon />,
                  title: 'Content',
                  href: '/content'
                }, {
                  icon: <RocketIcon />,
                  title: 'Autopilot',
                  href: '/autopilot'
                }, {
                  icon: <BarChart2Icon />,
                  title: 'Analytics',
                  href: '/analytics'
                }, {
                  icon: <MessageSquareIcon />,
                  title: 'Messages',
                  href: '/messages'
                }]} />}
                      {location.pathname.startsWith('/content') && <CardMenu items={[{
                  icon: <FileTextIcon />,
                  title: 'Text',
                  href: '/content/text'
                }, {
                  icon: <ImageIcon />,
                  title: 'Image',
                  href: '/content/image'
                }, {
                  icon: <VideoIcon />,
                  title: 'Video',
                  href: '/content/video'
                }, {
                  icon: <MicIcon />,
                  title: 'Audio',
                  href: '/content/audio'
                }]} />}
                    </div>
                    {/* Add Affiliate Button - Updated positioning */}
                    <div className="fixed bottom-6 left-5 z-50">
                      <Link to="/affiliate">
                        <CardMenu items={[{
                    icon: <DollarSignIcon size={18} />,
                    title: 'Affiliate',
                    href: '/affiliate'
                  }]} className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 transition-all duration-300 animate-pulse-slow border-amber-500/20 hover:scale-110 hover:shadow-lg" />
                      </Link>
                    </div>
                    <main className="flex-1 w-full px-4 py-4 md:py-6 max-w-screen-2xl bg-gray-50 dark:bg-[#0A0E14] transition-colors duration-300 mt-16">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/content" element={<Navigate to="/content/text" replace />} />
                        <Route path="/content/text" element={<TextEditor />} />
                        <Route path="/content/image" element={<ImageEditor />} />
                        <Route path="/content/audio" element={<AudioEditor />} />
                        <Route path="/content/video" element={<VideoEditor />} />
                        {/* Autopilot Pipelines Routes */}
                        <Route path="/autopilot" element={<AutopilotDashboard />} />
                        <Route path="/autopilot/create" element={<CreatePipeline />} />
                        <Route path="/autopilot/video-generator" element={<VideoGenerator />} />
                        <Route path="/autopilot/templates" element={<CustomTemplates />} />
                        <Route path="/autopilot/scheduler" element={<PostScheduler />} />
                        <Route path="/autopilot/media" element={<MediaLibrary />} />
                        <Route path="/autopilot/analytics" element={<EngagementAnalytics />} />
                        {/* Credits Routes */}
                        <Route path="/credits/usage" element={<UsageHistory />} />
                        <Route path="/credits/add" element={<AddCredits />} />
                        <Route path="/credits/transactions" element={<TransactionHistory />} />
                        {/* Media Gallery */}
                        <Route path="/media" element={<MediaGallery />} />
                        {/* Customer-facing routes */}
                        <Route path="/social" element={<SocialMedia />} />
                        <Route path="/analytics" element={<Analytics />} />
                        <Route path="/calendar" element={<Calendar />} />
                        <Route path="/messages" element={<Messages />} />
                        <Route path="/team" element={<Team />} />
                        <Route path="/affiliate" element={<AffiliatePage />} />
                        <Route path="/affiliate" element={<Settings defaultTab="affiliate" />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/help" element={<Help />} />
                        <Route path="/social-accounts" element={<SocialAccounts />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                      </Routes>
                    </main>
                  </div>
                </div>
              </AuthGuard>} />
        </Routes>
        <Toaster position="top-right" theme={isDarkMode ? 'dark' : 'light'} toastOptions={{
        style: {
          background: isDarkMode ? '#1A2234' : '#FFFFFF',
          border: isDarkMode ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(0,0,0,0.1)',
          borderRadius: '0.75rem',
          padding: '1rem',
          color: isDarkMode ? '#F3F4F6' : '#1F2937',
          boxShadow: isDarkMode ? '0 10px 15px -3px rgba(0, 0, 0, 0.3), 0 4px 6px -2px rgba(0, 0, 0, 0.2)' : '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)'
        }
      }} />
      </div>
    </BrowserRouter>;
}