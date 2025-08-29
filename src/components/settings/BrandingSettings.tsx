import React, { useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { PaletteIcon, TypeIcon, UploadIcon, MessageSquareIcon, SaveIcon, TrashIcon, RefreshCwIcon, CheckIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ColorPicker } from './ColorPicker';
interface BrandingSettingsProps {
  brandSettings: BrandSettings;
  onSave: (settings: BrandSettings) => void;
}
export interface BrandSettings {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontPrimary: string;
  fontSecondary: string;
  voiceTone: string;
  logo?: string;
}
export const BrandingSettings = ({
  brandSettings,
  onSave
}: BrandingSettingsProps) => {
  const [settings, setSettings] = useState<BrandSettings>(brandSettings);
  const [logoPreview, setLogoPreview] = useState<string | undefined>(brandSettings.logo);
  const [previewStyle, setPreviewStyle] = useState('light');
  const fontOptions = [{
    value: 'sans-serif',
    label: 'Sans Serif'
  }, {
    value: 'serif',
    label: 'Serif'
  }, {
    value: 'monospace',
    label: 'Monospace'
  }, {
    value: 'display',
    label: 'Display'
  }, {
    value: 'handwriting',
    label: 'Handwriting'
  }];
  const voiceToneOptions = [{
    value: 'professional',
    label: 'Professional'
  }, {
    value: 'casual',
    label: 'Casual & Friendly'
  }, {
    value: 'authoritative',
    label: 'Authoritative'
  }, {
    value: 'enthusiastic',
    label: 'Enthusiastic'
  }, {
    value: 'educational',
    label: 'Educational'
  }, {
    value: 'inspirational',
    label: 'Inspirational'
  }];
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleColorChange = (color: string, type: 'primaryColor' | 'secondaryColor' | 'accentColor') => {
    setSettings(prev => ({
      ...prev,
      [type]: color
    }));
  };
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, this would upload to a server and get a URL back
      // For now, we'll use a local URL
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setLogoPreview(result);
        setSettings(prev => ({
          ...prev,
          logo: result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSave = () => {
    onSave(settings);
    toast.success('Brand settings saved', {
      description: 'Your brand settings have been updated and will be applied to new content.'
    });
  };
  const handleReset = () => {
    const defaultSettings = {
      primaryColor: '#4f46e5',
      secondaryColor: '#8b5cf6',
      accentColor: '#ec4899',
      fontPrimary: 'sans-serif',
      fontSecondary: 'sans-serif',
      voiceTone: 'professional',
      logo: undefined
    };
    setSettings(defaultSettings);
    setLogoPreview(undefined);
    toast.info('Brand settings reset to defaults');
  };
  return <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Logo Upload */}
          <Card className="overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <UploadIcon size={20} className="text-gray-500 dark:text-gray-400" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Logo
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 flex items-center justify-center overflow-hidden">
                  {logoPreview ? <img src={logoPreview} alt="Brand logo" className="max-w-full max-h-full object-contain" /> : <UploadIcon size={24} className="text-gray-400" />}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                    Upload your brand logo. Recommended size: 400x400px. PNG or
                    SVG with transparent background preferred.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="outline" className="relative">
                      <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handleLogoUpload} accept="image/*" />
                      <UploadIcon size={16} className="mr-2" />
                      Upload Logo
                    </Button>
                    {logoPreview && <Button variant="outline" className="border-red-200 hover:border-red-300 dark:border-red-800 dark:hover:border-red-700" onClick={() => {
                    setLogoPreview(undefined);
                    setSettings(prev => ({
                      ...prev,
                      logo: undefined
                    }));
                  }}>
                        <TrashIcon size={16} className="mr-2 text-red-500" />
                        Remove
                      </Button>}
                  </div>
                </div>
              </div>
            </div>
          </Card>
          {/* Colors */}
          <Card className="overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <PaletteIcon size={20} className="text-gray-500 dark:text-gray-400" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Brand Colors
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Color
                  </label>
                  <ColorPicker color={settings.primaryColor} onChange={color => handleColorChange(color, 'primaryColor')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Color
                  </label>
                  <ColorPicker color={settings.secondaryColor} onChange={color => handleColorChange(color, 'secondaryColor')} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Accent Color
                  </label>
                  <ColorPicker color={settings.accentColor} onChange={color => handleColorChange(color, 'accentColor')} />
                </div>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                These colors will be used throughout your content to maintain
                brand consistency.
              </p>
            </div>
          </Card>
          {/* Typography */}
          <Card className="overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <TypeIcon size={20} className="text-gray-500 dark:text-gray-400" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Typography
                </h3>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Primary Font
                  </label>
                  <select name="fontPrimary" value={settings.fontPrimary} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {fontOptions.map(option => <option key={option.value} value={option.value}>
                        {option.label}
                      </option>)}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Used for headings and titles
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Secondary Font
                  </label>
                  <select name="fontSecondary" value={settings.fontSecondary} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                    {fontOptions.map(option => <option key={option.value} value={option.value}>
                        {option.label}
                      </option>)}
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Used for body text and captions
                  </p>
                </div>
              </div>
            </div>
          </Card>
          {/* Voice Tone */}
          <Card className="overflow-hidden">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <MessageSquareIcon size={20} className="text-gray-500 dark:text-gray-400" />
                <h3 className="text-base font-medium text-gray-900 dark:text-white">
                  Voice Tone
                </h3>
              </div>
            </div>
            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Default Voice Tone for Content
              </label>
              <select name="voiceTone" value={settings.voiceTone} onChange={handleChange} className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white">
                {voiceToneOptions.map(option => <option key={option.value} value={option.value}>
                    {option.label}
                  </option>)}
              </select>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">
                This setting influences how AI-generated content will sound in
                terms of tone and style. You can always override this setting
                for individual content pieces.
              </p>
            </div>
          </Card>
        </div>
        {/* Preview Card */}
        <div className="space-y-6">
          <Card className="overflow-hidden sticky top-6">
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4 bg-gray-50 dark:bg-gray-800/50">
              <h3 className="text-base font-medium text-gray-900 dark:text-white">
                Brand Preview
              </h3>
            </div>
            <div className="p-6">
              <div className="flex justify-center mb-4">
                <div className="inline-flex rounded-md shadow-sm">
                  <button type="button" onClick={() => setPreviewStyle('light')} className={`px-4 py-2 text-sm font-medium rounded-l-md border ${previewStyle === 'light' ? 'bg-white border-gray-300 text-gray-700 z-10' : 'bg-gray-100 border-gray-300 text-gray-500'}`}>
                    Light
                  </button>
                  <button type="button" onClick={() => setPreviewStyle('dark')} className={`px-4 py-2 text-sm font-medium rounded-r-md border ${previewStyle === 'dark' ? 'bg-gray-800 border-gray-700 text-white z-10' : 'bg-gray-700 border-gray-700 text-gray-400'}`}>
                    Dark
                  </button>
                </div>
              </div>
              <div className={`rounded-lg overflow-hidden border ${previewStyle === 'light' ? 'bg-white border-gray-200' : 'bg-gray-900 border-gray-700'}`}>
                {/* Header with logo */}
                <div className="p-4 border-b" style={{
                borderColor: previewStyle === 'light' ? '#e5e7eb' : '#374151',
                background: `linear-gradient(to right, ${settings.primaryColor}, ${settings.secondaryColor})`
              }}>
                  <div className="flex justify-between items-center">
                    {logoPreview ? <div className="h-8 w-auto">
                        <img src={logoPreview} alt="Brand logo" className="h-full object-contain" />
                      </div> : <div className={`font-bold text-lg ${previewStyle === 'light' ? 'text-white' : 'text-white'}`} style={{
                    fontFamily: settings.fontPrimary
                  }}>
                        Your Brand
                      </div>}
                  </div>
                </div>
                {/* Content preview */}
                <div className="p-4">
                  <h4 className={`text-lg font-semibold mb-2 ${previewStyle === 'light' ? 'text-gray-900' : 'text-white'}`} style={{
                  fontFamily: settings.fontPrimary,
                  color: previewStyle === 'light' ? settings.primaryColor : settings.secondaryColor
                }}>
                    Sample Content Title
                  </h4>
                  <p className={`text-sm mb-3 ${previewStyle === 'light' ? 'text-gray-600' : 'text-gray-300'}`} style={{
                  fontFamily: settings.fontSecondary
                }}>
                    This is how your content will appear with your brand styling
                    applied.
                  </p>
                  <div className="text-xs px-2 py-1 inline-block rounded-full mb-3" style={{
                  backgroundColor: settings.accentColor,
                  color: '#ffffff',
                  fontFamily: settings.fontSecondary
                }}>
                    Sample Tag
                  </div>
                  <div className={`w-full h-24 rounded flex items-center justify-center mb-3 ${previewStyle === 'light' ? 'bg-gray-100' : 'bg-gray-800'}`}>
                    <span className={`text-sm ${previewStyle === 'light' ? 'text-gray-500' : 'text-gray-400'}`} style={{
                    fontFamily: settings.fontSecondary
                  }}>
                      Content Preview Area
                    </span>
                  </div>
                  <div className="text-sm rounded-full px-4 py-1.5 text-center font-medium" style={{
                  backgroundColor: settings.primaryColor,
                  color: '#ffffff',
                  fontFamily: settings.fontPrimary
                }}>
                    Call to Action
                  </div>
                </div>
              </div>
              <div className="mt-6 space-y-4">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  This preview shows how your brand elements will appear in
                  generated content.
                </p>
                <div className="flex justify-between">
                  <Button variant="outline" onClick={handleReset} leftIcon={<RefreshCwIcon size={16} />}>
                    Reset to Default
                  </Button>
                  <Button variant="primary" onClick={handleSave} leftIcon={<SaveIcon size={16} />}>
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>;
};
