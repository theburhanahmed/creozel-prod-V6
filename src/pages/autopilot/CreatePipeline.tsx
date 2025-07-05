import React, { useEffect, useState, Fragment } from 'react';
import { FormatSpecificEditor } from '../../components/autopilot/FormatSpecificEditor';
import { GeneratedOutputPreview } from '../../components/autopilot/GeneratedOutputPreview';
import { ContentFormatSelector } from '../../components/autopilot/ContentFormatSelector';
import { SmartOptimizerSidebar } from '../../components/autopilot/SmartOptimizerSidebar';
import { PlatformScheduler } from '../../components/autopilot/PlatformScheduler';
import { SlideEditor } from '../../components/autopilot/SlideEditor';
import { Card } from '../../components/ui/Card';
import { Tabs } from '../../components/ui/Tabs';
import { Button } from '../../components/ui/Button';
import { SmartContentIdeas } from '../../components/autopilot/SmartContentIdeas';
import { LayoutIcon, FileTextIcon, VideoIcon, ImageIcon, BookOpenIcon, MailIcon, PlusIcon, UsersIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
export const CreatePipeline = () => {
  // Add necessary state variables
  const [activeTab, setActiveTab] = useState('format');
  const [selectedContentFormat, setSelectedContentFormat] = useState('');
  const [showContentIdeas, setShowContentIdeas] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [showSmartOptimizer, setShowSmartOptimizer] = useState(true);
  const [showSlideEditor, setShowSlideEditor] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    content: '',
    hashtags: [],
    caption: '',
    backgroundMusic: null,
    thumbnail: '',
    slides: []
    // Format-specific fields will be added dynamically
  });
  const [scheduleData, setScheduleData] = useState(null);
  const [collaborators, setCollaborators] = useState([]);
  const [isFormLoaded, setIsFormLoaded] = useState(false);
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  // Ensure the form loads properly
  useEffect(() => {
    setIsFormLoaded(true);
  }, []);
  // Effect to reset generation state when format changes
  useEffect(() => {
    if (selectedContentFormat) {
      setIsGenerated(false);
      setShowSlideEditor(false);
    }
  }, [selectedContentFormat]);
  // Define tabs for the component
  const tabs = [{
    id: 'format',
    label: 'Content Format'
  }, {
    id: 'basic',
    label: 'Basic Information'
  }, {
    id: 'content',
    label: 'Content'
  }, {
    id: 'slides',
    label: 'Slide Editor'
  }, {
    id: 'platforms',
    label: 'Platforms'
  }, {
    id: 'schedule',
    label: 'Schedule'
  }, {
    id: 'monetization',
    label: 'Monetization'
  }, {
    id: 'advanced',
    label: 'Advanced'
  }];
  // Content format definitions with icons
  const contentFormats = [{
    id: 'short-video',
    name: 'Short Video',
    icon: <VideoIcon size={24} />,
    description: 'Create engaging short-form videos for social media',
    platforms: ['TikTok', 'Instagram Reels', 'YouTube Shorts'],
    color: 'from-orange-500 to-amber-500'
  }, {
    id: 'long-video',
    name: 'Long-form Video',
    icon: <VideoIcon size={24} />,
    description: 'Create in-depth video content',
    platforms: ['YouTube', 'Vimeo'],
    color: 'from-red-500 to-rose-500'
  }, {
    id: 'image-post',
    name: 'Image Post',
    icon: <ImageIcon size={24} />,
    description: 'Design eye-catching social media images',
    platforms: ['Instagram', 'Pinterest', 'Twitter'],
    color: 'from-purple-500 to-pink-500'
  }, {
    id: 'carousel',
    name: 'Carousel',
    icon: <LayoutIcon size={24} />,
    description: 'Create swipeable multi-image posts',
    platforms: ['Instagram', 'LinkedIn'],
    color: 'from-blue-500 to-indigo-500'
  }, {
    id: 'story',
    name: 'Story',
    icon: <BookOpenIcon size={24} />,
    description: 'Design engaging story content',
    platforms: ['Instagram', 'Facebook'],
    color: 'from-indigo-500 to-violet-500'
  }, {
    id: 'blog-post',
    name: 'Blog Post',
    icon: <FileTextIcon size={24} />,
    description: 'Write SEO-optimized blog content',
    platforms: ['Medium', 'WordPress'],
    color: 'from-emerald-500 to-teal-500'
  }, {
    id: 'email-newsletter',
    name: 'Email Newsletter',
    icon: <MailIcon size={24} />,
    description: 'Create engaging email campaigns',
    platforms: ['Email'],
    color: 'from-cyan-500 to-blue-500'
  }];
  // Handle format selection
  const handleFormatSelect = (formatId: string) => {
    setSelectedContentFormat(formatId);
    setActiveTab('basic'); // Move to basic info after format selection
    setCompletedSteps(prev => [...prev, 'format']);
    toast.success('Format selected', {
      description: `Selected ${contentFormats.find(f => f.id === formatId)?.name}`
    });
  };
  // Handle format-specific data updates
  const handleFormatDataUpdate = (data: any) => {
    setFormData(prev => ({
      ...prev,
      ...data
    }));
  };
  // Handle content generation
  const handleGenerateContent = () => {
    if (!selectedContentFormat) {
      toast.error('Please select a content format first');
      return;
    }
    setIsGenerating(true);
    // Simulate AI content generation
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      setCompletedSteps(prev => [...prev, 'content']);
      toast.success('Content generated successfully', {
        description: 'Your content has been created based on your inputs.'
      });
      // For carousel and story formats, show the slide editor next
      if (['carousel', 'story'].includes(selectedContentFormat)) {
        setShowSlideEditor(true);
      }
    }, 2000);
  };
  // Handle selecting content ideas
  const handleSelectIdea = (idea: any) => {
    setShowContentIdeas(false);
    setFormData(prev => ({
      ...prev,
      title: idea.title || prev.title,
      description: idea.description || prev.description
    }));
    toast.success('Content idea selected', {
      description: 'The selected idea has been added to your pipeline'
    });
  };
  // Preview handlers
  const handleEditContent = () => {
    setIsGenerated(false);
    toast.info('Editing content', {
      description: 'Opening content editor for modifications'
    });
  };
  const handleRegenerateContent = () => {
    setIsGenerating(true);
    // Simulate regeneration
    setTimeout(() => {
      setIsGenerating(false);
      setIsGenerated(true);
      toast.success('Content regenerated', {
        description: 'Your content has been updated with new variations'
      });
    }, 1500);
  };
  const handleScheduleContent = () => {
    // For carousel and story, show slide editor first
    if (['carousel', 'story'].includes(selectedContentFormat) && !completedSteps.includes('slides')) {
      setActiveTab('slides');
      setShowSlideEditor(true);
      toast.info('Edit your slides', {
        description: 'Configure each slide before scheduling'
      });
    } else {
      setActiveTab('schedule');
      toast.success('Proceeding to schedule', {
        description: 'Configure when and where to publish your content'
      });
    }
  };
  // Handle scheduling
  const handleSchedule = (data: any) => {
    setScheduleData(data);
    setCompletedSteps(prev => [...prev, 'schedule']);
    toast.success('Content scheduled successfully', {
      description: data.mode === 'auto' ? 'Your content will be automatically posted according to your schedule' : 'Your content has been added to your publishing schedule'
    });
    // Move to next tab
    setActiveTab('monetization');
  };
  // Handle saving basic info
  const handleSaveBasicInfo = () => {
    if (!formData.title || !formData.description) {
      toast.error('Please complete all required fields', {
        description: 'Title and description are required'
      });
      return;
    }
    setCompletedSteps(prev => [...prev, 'basic']);
    setActiveTab('content');
    toast.success('Basic information saved', {
      description: 'Your pipeline information has been saved'
    });
  };
  // Handle slide editor updates
  const handleSlideUpdate = (slides: any[]) => {
    setFormData(prev => ({
      ...prev,
      slides
    }));
  };
  // Handle completing slide editing
  const handleSlideEditComplete = () => {
    setCompletedSteps(prev => [...prev, 'slides']);
    setActiveTab('platforms');
    toast.success('Slides saved successfully', {
      description: 'Your slides have been configured and are ready to publish'
    });
  };
  // Handle final pipeline creation
  const handleCreatePipeline = () => {
    toast.success('Pipeline created successfully!', {
      description: 'Your content pipeline is now set up and ready to go'
    });
    // In a real app, this would navigate to the pipeline dashboard
    setTimeout(() => {
      window.location.href = '/autopilot';
    }, 1500);
  };
  // Handle applying AI suggestions from Smart Optimizer
  const handleApplySuggestion = (type: string, value: any) => {
    let message = '';
    switch (type) {
      case 'title':
        setFormData(prev => ({
          ...prev,
          title: value
        }));
        message = 'Optimized title applied';
        break;
      case 'hashtags':
        setFormData(prev => ({
          ...prev,
          hashtags: value
        }));
        message = 'Trending hashtags applied';
        break;
      case 'caption':
        setFormData(prev => ({
          ...prev,
          caption: value
        }));
        message = 'Viral caption applied';
        break;
      case 'music':
        setFormData(prev => ({
          ...prev,
          backgroundMusic: value
        }));
        message = `Background track "${value.name}" applied`;
        break;
      case 'thumbnail':
        setFormData(prev => ({
          ...prev,
          thumbnail: value
        }));
        message = 'AI-generated thumbnail applied';
        break;
      case 'generateThumbnail':
        message = 'Generating more thumbnail options';
        break;
    }
    toast.success('Smart optimization applied', {
      description: message
    });
  };
  // Handle tab changes with validation
  const handleTabChange = (tabId: string) => {
    // Validate before allowing certain tab changes
    if (tabId === 'content' && !selectedContentFormat) {
      toast.error('Please select a content format first', {
        description: 'Go to the Content Format tab to select a format'
      });
      return;
    }
    if (tabId === 'content' && (!formData.title || !formData.description)) {
      toast.error('Please complete the basic information first', {
        description: 'Title and description are required'
      });
      return;
    }
    if (tabId === 'slides' && !isGenerated) {
      toast.error('Please generate content first', {
        description: 'Generate content before editing slides'
      });
      return;
    }
    if (tabId === 'slides' && !['carousel', 'story'].includes(selectedContentFormat)) {
      toast.error('Slide editor is only for carousel and story formats', {
        description: 'This tab is not applicable to your selected format'
      });
      return;
    }
    if (tabId === 'platforms' && !isGenerated) {
      toast.error('Please generate content first', {
        description: 'Generate content before configuring platforms'
      });
      return;
    }
    if (tabId === 'platforms' && ['carousel', 'story'].includes(selectedContentFormat) && !completedSteps.includes('slides')) {
      toast.error('Please complete slide editing first', {
        description: 'Configure your slides before setting up platforms'
      });
      return;
    }
    if (tabId === 'schedule' && !completedSteps.includes('content')) {
      toast.error('Please complete content creation first', {
        description: 'Generate and optimize your content before scheduling'
      });
      return;
    }
    setActiveTab(tabId);
  };
  // Check if a step is completed
  const isStepCompleted = (stepId: string) => {
    return completedSteps.includes(stepId);
  };
  // Check if the slides tab should be shown
  const shouldShowSlidesTab = ['carousel', 'story'].includes(selectedContentFormat);
  // Filter tabs based on content format
  const filteredTabs = tabs.filter(tab => {
    if (tab.id === 'slides') {
      return shouldShowSlidesTab;
    }
    return true;
  });
  if (!isFormLoaded) {
    return <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>;
  }
  return <div className="space-y-6 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create Content Pipeline
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Select a format and customize your content pipeline
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" leftIcon={<PlusIcon size={16} />} onClick={() => setShowContentIdeas(true)}>
            Content Ideas
          </Button>
          <Button variant="outline" leftIcon={<UsersIcon size={16} />} onClick={() => setShowInviteModal(true)}>
            Invite Collaborators
          </Button>
          {activeTab === 'content' && selectedContentFormat && isGenerated && <Button variant={showSmartOptimizer ? 'primary' : 'outline'} leftIcon={<SparklesIcon size={16} />} onClick={() => setShowSmartOptimizer(!showSmartOptimizer)}>
              Smart Optimizer
            </Button>}
        </div>
      </div>
      <form className="space-y-6">
        {/* Progress indicator */}
        <div className="flex items-center justify-between px-2">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400">
            {filteredTabs.map((tab, index) => <Fragment key={tab.id}>
                {index > 0 && <div className="w-4 h-px bg-gray-300 dark:bg-gray-600"></div>}
                <div className={`flex items-center ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400 font-medium' : isStepCompleted(tab.id) ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                  {isStepCompleted(tab.id) && <CheckCircleIcon size={14} className="mr-1 text-emerald-500" />}
                  {tab.label}
                </div>
              </Fragment>)}
          </div>
          <div className="flex items-center gap-2">
            {activeTab !== 'format' && <Button variant="outline" size="sm" leftIcon={<ArrowLeftIcon size={14} />} onClick={() => {
            const currentIndex = filteredTabs.findIndex(tab => tab.id === activeTab);
            if (currentIndex > 0) {
              setActiveTab(filteredTabs[currentIndex - 1].id);
            }
          }}>
                Previous
              </Button>}
            {activeTab !== filteredTabs[filteredTabs.length - 1].id && activeTab !== 'content' && activeTab !== 'slides' && <Button variant="outline" size="sm" rightIcon={<ArrowRightIcon size={14} />} onClick={() => {
            const currentIndex = filteredTabs.findIndex(tab => tab.id === activeTab);
            if (currentIndex < filteredTabs.length - 1) {
              handleTabChange(filteredTabs[currentIndex + 1].id);
            }
          }}>
                  Next
                </Button>}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className={`lg:col-span-${activeTab === 'content' && selectedContentFormat && isGenerated && showSmartOptimizer ? '3' : '4'}`}>
            <Card>
              <div className="space-y-6">
                <Tabs tabs={filteredTabs} activeTab={activeTab} onChange={handleTabChange} variant="enclosed" />
                <div className="p-4">
                  {activeTab === 'format' && <div className="space-y-6">
                      <ContentFormatSelector formats={contentFormats} selectedFormat={selectedContentFormat} onSelectFormat={handleFormatSelect} />
                    </div>}
                  {activeTab === 'basic' && <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Pipeline Name
                          </label>
                          <input type="text" value={formData.title} onChange={e => setFormData({
                        ...formData,
                        title: e.target.value
                      })} placeholder="Enter pipeline name..." className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description
                          </label>
                          <textarea value={formData.description} onChange={e => setFormData({
                        ...formData,
                        description: e.target.value
                      })} placeholder="Describe the purpose of this content pipeline..." rows={3} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" />
                        </div>
                        <div className="flex justify-end">
                          <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />} onClick={handleSaveBasicInfo}>
                            Continue to Content
                          </Button>
                        </div>
                      </div>
                    </div>}
                  {activeTab === 'content' && <div className="space-y-8">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        {selectedContentFormat ? `${contentFormats.find(f => f.id === selectedContentFormat)?.name} Content Settings` : 'Content Settings'}
                      </h3>
                      {selectedContentFormat ? <>
                          {!isGenerated ? <>
                              <FormatSpecificEditor format={selectedContentFormat} onUpdate={handleFormatDataUpdate} />
                              <div className="flex justify-center mt-8">
                                <Button variant="primary" size="lg" leftIcon={<SparklesIcon size={18} />} onClick={handleGenerateContent} disabled={isGenerating} className="px-8">
                                  {isGenerating ? <>
                                      <div className="mr-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                                      Generating...
                                    </> : 'Generate Content'}
                                </Button>
                              </div>
                            </> : <div className="mt-2">
                              <GeneratedOutputPreview format={selectedContentFormat} onEdit={handleEditContent} onRegenerate={handleRegenerateContent} onSchedule={handleScheduleContent} />
                            </div>}
                        </> : <div className="flex flex-col items-center justify-center py-10 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-700">
                          <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-4">
                            <LayoutIcon size={32} />
                          </div>
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                            Select a Content Format
                          </h3>
                          <p className="text-gray-500 dark:text-gray-400 text-center max-w-md mb-6">
                            Please go to the Content Format tab first and select
                            a format to see format-specific settings.
                          </p>
                          <Button variant="primary" onClick={() => setActiveTab('format')}>
                            Select Content Format
                          </Button>
                        </div>}
                    </div>}
                  {activeTab === 'slides' && <SlideEditor formatType={selectedContentFormat as 'carousel' | 'story'} initialSlides={formData.slides.length > 0 ? formData.slides : undefined} onUpdate={handleSlideUpdate} onPreview={() => {}} onComplete={handleSlideEditComplete} />}
                  {activeTab === 'platforms' && <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Publishing Platforms
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Select where you want to publish your content. You can
                        select multiple platforms.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Platform selection will be implemented here */}
                        <div className="p-6 border border-dashed border-gray-300 dark:border-gray-700 rounded-lg flex items-center justify-center">
                          <p className="text-gray-500 dark:text-gray-400 text-center">
                            Platform selection options will appear here
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />} onClick={() => setActiveTab('schedule')}>
                          Continue to Schedule
                        </Button>
                      </div>
                    </div>}
                  {activeTab === 'schedule' && <PlatformScheduler onSchedule={handleSchedule} contentTitle={formData.title} contentType={selectedContentFormat} />}
                  {activeTab === 'monetization' && <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Monetization Options
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Configure how you want to monetize this content
                        pipeline.
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <circle cx="12" cy="12" r="10" />
                              <path d="M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8" />
                              <path d="M12 18V6" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            Affiliate Links
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Include affiliate product links in your content
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9m16 0H4m16 0 1.28 2.55a1 1 0 0 1-.9 1.45H3.62a1 1 0 0 1-.9-1.45L4 16" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            Sponsored Content
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Mark content as sponsored or brand partnerships
                          </p>
                        </div>
                        <div className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-indigo-500 hover:shadow-md transition-all cursor-pointer">
                          <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-3">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M12 2v20" />
                              <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                            </svg>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-white mb-1">
                            Digital Products
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Promote and sell your digital products
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />} onClick={() => setActiveTab('advanced')}>
                          Continue to Advanced Settings
                        </Button>
                      </div>
                    </div>}
                  {activeTab === 'advanced' && <div className="space-y-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Advanced Settings
                      </h3>
                      <p className="text-gray-500 dark:text-gray-400 mb-6">
                        Configure advanced options for your content pipeline.
                      </p>
                      <div className="space-y-6">
                        <div>
                          <label className="flex items-center justify-between text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            <span>AI Content Enhancement</span>
                            <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">
                              Recommended
                            </span>
                          </label>
                          <div className="flex items-center">
                            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-indigo-600">
                              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
                            </button>
                            <span className="ml-3 text-sm text-gray-600 dark:text-gray-400">
                              Automatically improve content quality with AI
                            </span>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Content Recycling
                          </label>
                          <select className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white" defaultValue="repurpose">
                            <option value="none">Don't recycle content</option>
                            <option value="repurpose">
                              Repurpose for other platforms
                            </option>
                            <option value="refresh">
                              Refresh and repost periodically
                            </option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Performance Tracking
                          </label>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Track engagement metrics
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Audience growth tracking
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" defaultChecked />
                              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Conversion tracking
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                              <label className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                Competitor benchmarking
                              </label>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
                        <Button variant="primary" size="lg" onClick={handleCreatePipeline}>
                          Create Pipeline
                        </Button>
                      </div>
                    </div>}
                </div>
              </div>
            </Card>
          </div>
          {/* Smart Optimizer Sidebar - Only show in content tab when content is generated */}
          {activeTab === 'content' && selectedContentFormat && isGenerated && showSmartOptimizer && <div className="lg:col-span-1">
                <SmartOptimizerSidebar contentFormat={selectedContentFormat} onApplySuggestion={handleApplySuggestion} />
              </div>}
        </div>
      </form>
      {/* Content Ideas Modal */}
      {showContentIdeas && <SmartContentIdeas isOpen={showContentIdeas} onClose={() => setShowContentIdeas(false)} onSelectIdea={handleSelectIdea} />}
    </div>;
};