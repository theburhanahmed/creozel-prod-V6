import React, { useEffect, useState, Fragment } from 'react';
// ... existing code ...
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
import { ContentEngineOrb } from '../3d/ContentEngineOrb';
import { LayoutIcon, FileTextIcon, VideoIcon, ImageIcon, BookOpenIcon, MailIcon, PlusIcon, UsersIcon, SparklesIcon, ArrowRightIcon, CheckCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { toast } from 'sonner';
export const CreatePipeline = () => {
  // ... existing state and functions ...
  return <div className="space-y-6 relative max-w-screen-2xl mx-auto">
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
      <form className="space-y-6 w-full">
        {/* Progress indicator */}
        <div className="flex items-center justify-between px-2 w-full">
          <div className="hidden md:flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 overflow-x-auto flex-nowrap">
            {filteredTabs.map((tab, index) => <Fragment key={tab.id}>
                {index > 0 && <div className="w-4 h-px bg-gray-300 dark:bg-gray-600 flex-shrink-0"></div>}
                <div className={`flex items-center whitespace-nowrap flex-shrink-0 ${activeTab === tab.id ? 'text-indigo-600 dark:text-indigo-400 font-medium' : isStepCompleted(tab.id) ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                  {isStepCompleted(tab.id) && <CheckCircleIcon size={14} className="mr-1 text-emerald-500 flex-shrink-0" />}
                  {tab.label}
                </div>
              </Fragment>)}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
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
          <div className={`lg:col-span-${activeTab === 'content' && selectedContentFormat && isGenerated && showSmartOptimizer ? '3' : '4'} w-full min-w-0`}>
            <Card className="w-full">
              <div className="space-y-6 w-full">
                <Tabs tabs={filteredTabs} activeTab={activeTab} onChange={handleTabChange} variant="enclosed" />
                <div className="p-4 lg:p-6">
                  {activeTab === 'format' && <div className="space-y-6">
                      {/* Add 3D Orb to Format Selection */}
                      <div className="flex justify-center mb-6">
                        <ContentEngineOrb size={180} />
                      </div>
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
                          <Button variant="primary" rightIcon={<ArrowRightIcon size={16} />} onClick={handleSaveBasicInfo} className="bg-gradient-to-r from-[#3FE0A5] to-[#38B897] border-none">
                            Continue to Content
                          </Button>
                        </div>
                      </div>
                    </div>}
                  {/* Remaining tabs content would go here */}
                </div>
              </div>
            </Card>
          </div>
          {/* Smart Optimizer Sidebar - Only show in content tab when content is generated */}
          {activeTab === 'content' && selectedContentFormat && isGenerated && showSmartOptimizer && <div className="lg:col-span-1 w-full">
                <SmartOptimizerSidebar contentFormat={selectedContentFormat} onApplySuggestion={handleApplySuggestion} />
              </div>}
        </div>
      </form>
      {/* Content Ideas Modal */}
      {showContentIdeas && <SmartContentIdeas isOpen={showContentIdeas} onClose={() => setShowContentIdeas(false)} onSelectIdea={handleSelectIdea} />}
    </div>;
};