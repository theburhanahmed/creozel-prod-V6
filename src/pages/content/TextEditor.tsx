import React, { useState } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { CopyIcon, EditIcon, SendIcon, ArrowRightIcon, CheckIcon, SparklesIcon, VideoIcon, RefreshCwIcon, ChevronLeftIcon, FileTextIcon, ImageIcon, MicIcon } from 'lucide-react';
import { toast } from 'sonner';
import { ContentLayout } from '../../components/layout/ContentLayout';
import { Link } from 'react-router-dom';
import { CardMenu } from '../../components/ui/Card';
export const TextEditor = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentType, setContentType] = useState('caption');
  const [prompt, setPrompt] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [showEditView, setShowEditView] = useState(false);
  const [editableText, setEditableText] = useState('');
  const contentTypes = [{
    value: 'caption',
    label: 'Social Media Caption'
  }, {
    value: 'tweet',
    label: 'Tweet / X Post'
  }, {
    value: 'blog',
    label: 'Blog Post Introduction'
  }, {
    value: 'script',
    label: 'Video Script'
  }, {
    value: 'email',
    label: 'Email Newsletter'
  }, {
    value: 'product',
    label: 'Product Description'
  }];
  const placeholders = {
    caption: "Describe what you want in your caption, e.g., 'Professional photo of our new office space with team members collaborating'",
    tweet: "Describe your tweet content, e.g., 'Announcement about our upcoming product launch with key features'",
    blog: "Describe your blog topic, e.g., 'Introduction to artificial intelligence for beginners, covering basic concepts'",
    script: "Describe your video content, e.g., 'A 2-minute explainer video about our company's mission and values'",
    email: "Describe your email content, e.g., 'Monthly newsletter highlighting our top 3 achievements and upcoming events'",
    product: "Describe your product, e.g., 'Wireless noise-cancelling headphones with 20-hour battery life and premium sound quality'"
  };
  const handleGenerate = () => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt first');
      return;
    }
    setIsGenerating(true);
    // Simulate API call for text generation
    setTimeout(() => {
      let result = '';
      switch (contentType) {
        case 'caption':
          result = `✨ Collaboration at its finest! Our team hard at work in our newly designed office space. The perfect blend of creativity and productivity.\n\nWe believe that great environments foster great ideas. That's why we've invested in creating a space where innovation can thrive.\n\n#TeamWork #OfficeLife #Collaboration #WorkCulture #Innovation`;
          break;
        case 'tweet':
          result = `🚀 Exciting news! We're launching our new product next week with game-changing features you've been asking for. Stay tuned for the big reveal on Tuesday! #ComingSoon #Innovation`;
          break;
        case 'blog':
          result = `# Understanding Artificial Intelligence: A Beginner's Guide\n\nArtificial Intelligence (AI) has become one of the most transformative technologies of the 21st century. Yet, for many, it remains a complex and sometimes intimidating concept.\n\nIn this introductory guide, we'll demystify AI by breaking down its core principles, exploring its real-world applications, and addressing common misconceptions. Whether you're a curious novice or someone looking to refresh your understanding, this article will provide you with a solid foundation in AI concepts without overwhelming technical jargon.\n\n## What is Artificial Intelligence?\n\nAt its most basic level, Artificial Intelligence refers to computer systems designed to perform tasks that typically require human intelligence. These tasks include learning from experience, recognizing patterns, understanding language, making decisions, and solving problems.`;
          break;
        case 'script':
          result = `[OPENING SHOT: Company logo fades in with soft music]\n\nVOICEOVER: At [Company Name], we believe in making a difference.\n\n[TRANSITION: Montage of team members collaborating]\n\nVOICEOVER: Our mission is simple but powerful: to create solutions that transform how people work and live.\n\n[SHOT: Close-up of product being used]\n\nVOICEOVER: For over 10 years, we've been driven by innovation, integrity, and a commitment to excellence.\n\n[TRANSITION: Customer testimonials]\n\nCUSTOMER 1: "They didn't just provide a product, they provided a solution that changed how we operate."\n\nCUSTOMER 2: "The support team is incredible. They're always there when you need them."\n\n[CLOSING SHOT: Team gathered together]\n\nVOICEOVER: Join us in our journey to build a better future, together.\n\n[CALL TO ACTION]\n\nVOICEOVER: Visit our website today to learn more about our services.\n\n[LOGO: Company logo with website address]`;
          break;
        case 'email':
          result = `Subject: Monthly Highlights: Celebrating Our Achievements & Looking Ahead\n\nDear {{first_name}},\n\nI hope this newsletter finds you well. We've had an incredible month at [Company Name], and we're excited to share our journey with you.\n\n## Our Top Achievements This Month\n\n1. **Product Launch Success** - Our new platform saw over 10,000 sign-ups in the first week, exceeding our projections by 40%.\n\n2. **Industry Recognition** - We're honored to have been nominated for the "Innovation of the Year" award by [Industry Publication].\n\n3. **Community Impact** - Our team volunteered 100+ hours for local environmental cleanup initiatives, reinforcing our commitment to sustainability.\n\n## What's Coming Up\n\n- **Webinar Series** - Join us next Thursday at 2 PM EST for an exclusive webinar on industry trends with special guest experts.\n\n- **Customer Appreciation Week** - Starting October 15th, enjoy special offers and resources as our way of saying "thank you."\n\n- **New Feature Preview** - We're giving select subscribers early access to our upcoming features. Reply to this email if you'd like to participate!\n\nWe're grateful for your continued support and look forward to sharing more innovations with you.\n\nWarm regards,\n\n[Your Name]\n[Your Position]\n[Company Name]`;
          break;
        case 'product':
          result = `# Premium Wireless Noise-Cancelling Headphones\n\n**Experience sound like never before with our most advanced headphones yet.**\n\nImmerse yourself in crystal-clear audio with our state-of-the-art wireless noise-cancelling headphones. Engineered for the discerning listener, these premium headphones combine cutting-edge technology with exceptional comfort for an unparalleled listening experience.\n\n## Key Features:\n\n- **Industry-Leading Noise Cancellation**: Our proprietary technology blocks out 99.8% of ambient noise, allowing you to focus on what matters – your music, calls, or podcasts.\n\n- **Exceptional Battery Life**: Enjoy up to 20 hours of continuous playback on a single charge, with quick-charge capability providing 3 hours of use from just 15 minutes of charging.\n\n- **Studio-Quality Sound**: Custom-tuned 40mm drivers deliver rich, balanced audio across all frequencies, ensuring you hear every detail exactly as the artist intended.\n\n- **Premium Comfort**: Memory foam ear cushions wrapped in soft protein leather provide all-day comfort, while the adjustable stainless steel headband ensures a perfect fit for any head size.\n\n- **Intuitive Touch Controls**: Easily manage your music, calls, and voice assistant with simple touch gestures on the ear cup.\n\n- **Multipoint Connection**: Seamlessly switch between two connected devices, perfect for transitioning between work and entertainment.\n\nAvailable in Midnight Black, Platinum Silver, and Navy Blue.`;
          break;
        default:
          result = 'Generated text will appear here.';
      }
      setGeneratedText(result);
      setEditableText(result);
      setIsGenerating(false);
    }, 2000);
  };
  const handleCopy = () => {
    navigator.clipboard.writeText(generatedText);
    setCopied(true);
    toast.success('Text copied to clipboard');
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  const handleEdit = () => {
    setShowEditView(true);
  };
  const handleSaveEdit = () => {
    setGeneratedText(editableText);
    setShowEditView(false);
    toast.success('Changes saved');
  };
  const handleSendToVideo = () => {
    toast.success('Text sent to Video Tool', {
      description: 'Your generated content is now available in the Video Generator'
    });
  };
  const handleRegenerateText = () => {
    setIsGenerating(true);
    // Simulate API call for text regeneration
    setTimeout(() => {
      // For demonstration purposes, we'll just modify the existing text slightly
      setGeneratedText(generatedText + '\n\n[This is a regenerated version with some variations]');
      setEditableText(generatedText + '\n\n[This is a regenerated version with some variations]');
      setIsGenerating(false);
      toast.success('Text regenerated with new variations');
    }, 1500);
  };
  return <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <Link to="/" className="inline-flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200 mb-2">
            <ChevronLeftIcon size={16} />
            <span>Back to Dashboard</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Text Generator
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Create professional text content for various purposes
          </p>
        </div>
      </div>
      {/* Content Type Navigation */}
      <div className="flex justify-center mb-6">
        <CardMenu items={[{
        icon: <FileTextIcon size={16} />,
        title: 'Text',
        href: '/content/text'
      }, {
        icon: <ImageIcon size={16} />,
        title: 'Image',
        href: '/content/image'
      }, {
        icon: <VideoIcon size={16} />,
        title: 'Video',
        href: '/content/video'
      }, {
        icon: <MicIcon size={16} />,
        title: 'Audio',
        href: '/content/audio'
      }]} className="shadow-md" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Input Card */}
        <Card className="h-fit">
          <div className="p-6 space-y-6">
            {/* Content Type Selection */}
            <div>
              <label htmlFor="content-type" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Content Type
              </label>
              <select id="content-type" value={contentType} onChange={e => setContentType(e.target.value)} className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500">
                {contentTypes.map(type => <option key={type.value} value={type.value}>
                    {type.label}
                  </option>)}
              </select>
            </div>
            {/* Prompt Input */}
            <div>
              <label htmlFor="prompt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                What would you like to create?
              </label>
              <textarea id="prompt" value={prompt} onChange={e => setPrompt(e.target.value)} placeholder={placeholders[contentType]} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500" rows={4} />
            </div>
            {/* Generate Button */}
            <Button variant="primary" size="lg" leftIcon={<SparklesIcon size={18} />} onClick={handleGenerate} disabled={isGenerating || !prompt.trim()} className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
              {isGenerating ? <>
                  <div className="mr-2 animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Generating...
                </> : 'Generate Text'}
            </Button>
          </div>
        </Card>
        {/* Output Card */}
        <div className="space-y-6">
          {generatedText && !showEditView ? <Card className="h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center">
                  <SparklesIcon size={16} className="text-green-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Generated{' '}
                    {contentTypes.find(t => t.value === contentType)?.label}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" leftIcon={<RefreshCwIcon size={14} />} onClick={handleRegenerateText} disabled={isGenerating}>
                    Regenerate
                  </Button>
                  <Button variant="ghost" size="sm" leftIcon={copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />} onClick={handleCopy}>
                    {copied ? 'Copied' : 'Copy'}
                  </Button>
                  <Button variant="ghost" size="sm" leftIcon={<EditIcon size={14} />} onClick={handleEdit}>
                    Edit
                  </Button>
                  <Button variant="outline" size="sm" leftIcon={<VideoIcon size={14} />} onClick={handleSendToVideo}>
                    Send to Video
                  </Button>
                </div>
              </div>
              <div className="p-6 max-h-[500px] overflow-y-auto bg-white dark:bg-[#1A2234]">
                <div className="prose dark:prose-invert prose-sm max-w-none">
                  {contentType === 'blog' || contentType === 'script' || contentType === 'product' || contentType === 'email' ? generatedText.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('# ')) {
                  return <h1 key={index} className="text-2xl font-bold mt-0 mb-4 text-gray-900 dark:text-white">
                              {paragraph.replace('# ', '')}
                            </h1>;
                } else if (paragraph.startsWith('## ')) {
                  return <h2 key={index} className="text-xl font-bold mt-6 mb-4 text-gray-900 dark:text-white">
                              {paragraph.replace('## ', '')}
                            </h2>;
                } else if (paragraph.startsWith('- ')) {
                  return <ul key={index} className="list-disc pl-5 my-4 text-gray-700 dark:text-gray-300">
                              {paragraph.split('\n- ').map((item, i) => <li key={i}>{item.replace('- ', '')}</li>)}
                            </ul>;
                } else if (paragraph.includes('**')) {
                  return <p key={index} className="my-4 text-gray-700 dark:text-gray-300">
                              {paragraph.split('**').map((part, i) => i % 2 === 0 ? part : <strong key={i}>{part}</strong>)}
                            </p>;
                } else {
                  return <p key={index} className="my-4 text-gray-700 dark:text-gray-300">
                              {paragraph}
                            </p>;
                }
              }) : generatedText.split('\n').map((line, index) => <p key={index} className={`${line.startsWith('#') ? 'font-bold' : ''} text-gray-700 dark:text-gray-300`}>
                          {line}
                        </p>)}
                </div>
              </div>
            </Card> : showEditView ? <Card className="h-full">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between">
                <div className="flex items-center">
                  <EditIcon size={16} className="text-green-500 mr-2" />
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    Edit Text
                  </h3>
                </div>
              </div>
              <div className="p-6">
                <textarea value={editableText} onChange={e => setEditableText(e.target.value)} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-green-500 focus:border-green-500" rows={12} />
                <div className="flex justify-end mt-4 gap-2">
                  <Button variant="outline" onClick={() => setShowEditView(false)} className="border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300">
                    Cancel
                  </Button>
                  <Button variant="primary" onClick={handleSaveEdit} leftIcon={<CheckIcon size={14} />} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
                    Save Changes
                  </Button>
                </div>
              </div>
            </Card> : <Card className="h-full flex items-center justify-center p-6">
              <div className="text-center">
                <SparklesIcon size={48} className="mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">
                  Your generated text will appear here
                </p>
              </div>
            </Card>}
        </div>
      </div>
    </div>;
};