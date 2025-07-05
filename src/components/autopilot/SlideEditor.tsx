import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { LayoutIcon, BookOpenIcon, ImageIcon, PlusIcon, XIcon, ChevronLeftIcon, ChevronRightIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon, CheckIcon, EyeIcon, GridIcon, Loader2Icon, GripVerticalIcon } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
interface Slide {
  id: string;
  headline: string;
  subtext: string;
  imageUrl: string;
}
interface SlideEditorProps {
  formatType: 'carousel' | 'story';
  initialSlides?: Slide[];
  onUpdate: (slides: Slide[]) => void;
  onPreview: () => void;
  onComplete: () => void;
}
export const SlideEditor: React.FC<SlideEditorProps> = ({
  formatType,
  initialSlides,
  onUpdate,
  onPreview,
  onComplete
}) => {
  // Default slides if none provided
  const defaultSlides = [{
    id: '1',
    headline: formatType === 'carousel' ? 'Introducing Our New Feature' : 'Start Your Story',
    subtext: 'This is the first slide of your content',
    imageUrl: 'https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }, {
    id: '2',
    headline: 'Key Benefits',
    subtext: 'Discover what makes our solution special',
    imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }, {
    id: '3',
    headline: 'How It Works',
    subtext: 'Simple and easy to use',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'
  }];
  // State
  const [slides, setSlides] = useState<Slide[]>(initialSlides || defaultSlides);
  const [activeSlideIndex, setActiveSlideIndex] = useState(0);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [previewSlideIndex, setPreviewSlideIndex] = useState(0);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const [isEditingSlide, setIsEditingSlide] = useState(false);
  // Stock images for selection
  const stockImages = ['https://images.unsplash.com/photo-1579546929662-711aa81148cf?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1573164713712-03790a178651?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1614728263952-84ea256f9679?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1580927752452-89d86da3fa0a?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3', 'https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3'];
  // Update parent component when slides change
  useEffect(() => {
    onUpdate(slides);
  }, [slides, onUpdate]);
  // Add a new slide
  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: `${Date.now()}`,
      headline: `Slide ${slides.length + 1}`,
      subtext: 'Add your content here',
      imageUrl: stockImages[Math.floor(Math.random() * stockImages.length)]
    };
    setSlides([...slides, newSlide]);
    setActiveSlideIndex(slides.length);
  };
  // Remove a slide
  const handleRemoveSlide = (index: number) => {
    if (slides.length <= 1) return;
    const newSlides = [...slides];
    newSlides.splice(index, 1);
    setSlides(newSlides);
    if (activeSlideIndex >= index && activeSlideIndex > 0) {
      setActiveSlideIndex(activeSlideIndex - 1);
    }
  };
  // Update slide content
  const handleUpdateSlide = (field: keyof Slide, value: string) => {
    const newSlides = [...slides];
    newSlides[activeSlideIndex] = {
      ...newSlides[activeSlideIndex],
      [field]: value
    };
    setSlides(newSlides);
  };
  // Generate AI image for slide
  const handleGenerateImage = () => {
    setIsGeneratingImage(true);
    // Simulate AI image generation
    setTimeout(() => {
      const randomImage = stockImages[Math.floor(Math.random() * stockImages.length)];
      handleUpdateSlide('imageUrl', randomImage);
      setIsGeneratingImage(false);
    }, 1500);
  };
  // Handle drag and drop reordering
  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    const newSlides = Array.from(slides);
    const [reorderedItem] = newSlides.splice(result.source.index, 1);
    newSlides.splice(result.destination.index, 0, reorderedItem);
    setSlides(newSlides);
    if (activeSlideIndex === result.source.index) {
      setActiveSlideIndex(result.destination.index);
    } else if (activeSlideIndex > result.source.index && activeSlideIndex <= result.destination.index) {
      setActiveSlideIndex(activeSlideIndex - 1);
    } else if (activeSlideIndex < result.source.index && activeSlideIndex >= result.destination.index) {
      setActiveSlideIndex(activeSlideIndex + 1);
    }
  };
  // Preview controls
  const handleStartPreview = () => {
    setIsPreviewMode(true);
    setPreviewSlideIndex(0);
  };
  const handleStopPreview = () => {
    setIsPreviewMode(false);
  };
  const handleNextPreviewSlide = () => {
    if (previewSlideIndex < slides.length - 1) {
      setPreviewSlideIndex(previewSlideIndex + 1);
    } else {
      setIsPreviewMode(false);
    }
  };
  const handlePrevPreviewSlide = () => {
    if (previewSlideIndex > 0) {
      setPreviewSlideIndex(previewSlideIndex - 1);
    }
  };
  // Select stock image
  const handleSelectStockImage = (url: string) => {
    handleUpdateSlide('imageUrl', url);
    setIsEditingSlide(false);
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white">
            {formatType === 'carousel' ? <LayoutIcon size={16} /> : <BookOpenIcon size={16} />}
          </div>
          <h3 className="text-lg font-medium text-white">
            {formatType === 'carousel' ? 'Carousel' : 'Story'} Slide Editor
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" leftIcon={<EyeIcon size={14} />} onClick={handleStartPreview} className="border-gray-700 hover:bg-gray-800 text-gray-300">
            Preview
          </Button>
          <Button variant="primary" size="sm" leftIcon={<CheckIcon size={14} />} onClick={onComplete} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700">
            Complete
          </Button>
        </div>
      </div>
      {isPreviewMode ? <div className="relative rounded-lg border border-gray-700 overflow-hidden bg-[#1A2234]">
          <div className="relative aspect-[4/5] max-h-[500px] bg-gray-800 overflow-hidden">
            <img src={slides[previewSlideIndex].imageUrl} alt={slides[previewSlideIndex].headline} className="w-full h-full object-cover" />
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white font-medium text-xl mb-1">
                {slides[previewSlideIndex].headline}
              </h3>
              <p className="text-white/80 text-sm">
                {slides[previewSlideIndex].subtext}
              </p>
            </div>
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <div className="flex gap-1">
                {slides.map((_, i) => <div key={i} className={`h-1 rounded-full transition-all ${i === previewSlideIndex ? 'bg-green-500 w-6' : 'bg-white/40 w-4'}`} />)}
              </div>
            </div>
            {/* Navigation arrows */}
            <button className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors" onClick={handlePrevPreviewSlide} disabled={previewSlideIndex === 0}>
              <ChevronLeftIcon size={20} />
            </button>
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors" onClick={handleNextPreviewSlide}>
              <ChevronRightIcon size={20} />
            </button>
          </div>
          <div className="bg-[#1A2234] p-4 border-t border-gray-700">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-sm">
                Slide {previewSlideIndex + 1} of {slides.length}
              </span>
              <Button variant="outline" size="sm" onClick={handleStopPreview} className="border-gray-700 hover:bg-gray-800 text-gray-300">
                Exit Preview
              </Button>
            </div>
            {/* Horizontal preview scroll */}
            <div className="mt-4 overflow-x-auto pb-4 hide-scrollbar">
              <div className="flex gap-4">
                {slides.map((slide, index) => <div key={slide.id} className={`flex-shrink-0 w-24 h-36 rounded-md overflow-hidden border-2 transition-all cursor-pointer ${previewSlideIndex === index ? 'border-green-500 shadow-md' : 'border-transparent'}`} onClick={() => setPreviewSlideIndex(index)}>
                    <div className="relative w-full h-full">
                      <img src={slide.imageUrl} alt={slide.headline} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <span className="text-white text-lg font-bold">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                  </div>)}
              </div>
            </div>
          </div>
        </div> : <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Slide List */}
          <div className="lg:col-span-1">
            <Card className="h-full bg-[#1A2234] border-gray-700">
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h4 className="font-medium text-white">
                  Slides ({slides.length})
                </h4>
                <Button variant="outline" size="sm" leftIcon={<PlusIcon size={14} />} onClick={handleAddSlide} className="border-gray-700 hover:bg-gray-800 text-gray-300">
                  Add Slide
                </Button>
              </div>
              <div className="p-2 overflow-y-auto max-h-[500px]">
                <DragDropContext onDragEnd={handleDragEnd}>
                  <Droppable droppableId="slides">
                    {provided => <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                        {slides.map((slide, index) => <Draggable key={slide.id} draggableId={slide.id} index={index}>
                            {provided => <div ref={provided.innerRef} {...provided.draggableProps} className={`flex items-center p-2 rounded-lg border ${activeSlideIndex === index ? 'border-green-500 bg-green-900/20' : 'border-gray-700 hover:bg-gray-800/50'} cursor-pointer`} onClick={() => setActiveSlideIndex(index)}>
                                <div {...provided.dragHandleProps} className="mr-2 text-gray-400 hover:text-gray-300">
                                  <GripVerticalIcon size={16} />
                                </div>
                                <div className="h-12 w-12 rounded-md overflow-hidden flex-shrink-0 mr-3">
                                  <img src={slide.imageUrl} alt={slide.headline} className="h-full w-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h5 className="text-sm font-medium text-white truncate">
                                    {slide.headline || `Slide ${index + 1}`}
                                  </h5>
                                  <p className="text-xs text-gray-400 truncate">
                                    {slide.subtext || 'No description'}
                                  </p>
                                </div>
                                <button onClick={e => {
                        e.stopPropagation();
                        handleRemoveSlide(index);
                      }} className="ml-2 text-gray-400 hover:text-red-500" disabled={slides.length <= 1}>
                                  <XIcon size={16} />
                                </button>
                              </div>}
                          </Draggable>)}
                        {provided.placeholder}
                      </div>}
                  </Droppable>
                </DragDropContext>
              </div>
              <div className="p-4 border-t border-gray-700">
                <Button variant="primary" size="sm" className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" leftIcon={<EyeIcon size={14} />} onClick={handleStartPreview}>
                  Preview All Slides
                </Button>
              </div>
            </Card>
          </div>
          {/* Slide Editor */}
          <div className="lg:col-span-2">
            <Card className="h-full bg-[#1A2234] border-gray-700">
              <div className="p-4 border-b border-gray-700">
                <h4 className="font-medium text-white">
                  Editing Slide {activeSlideIndex + 1}
                </h4>
              </div>
              <div className="p-4 space-y-4">
                {/* Headline input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Headline
                  </label>
                  <input type="text" value={slides[activeSlideIndex].headline} onChange={e => handleUpdateSlide('headline', e.target.value)} placeholder="Enter slide headline" className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:border-green-500 focus:ring-green-500/20" />
                </div>
                {/* Subtext input */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Subtext
                  </label>
                  <textarea value={slides[activeSlideIndex].subtext} onChange={e => handleUpdateSlide('subtext', e.target.value)} placeholder="Enter slide description" rows={3} className="w-full px-3 py-2 border border-gray-600 rounded-md bg-gray-800 text-white focus:border-green-500 focus:ring-green-500/20" />
                </div>
                {/* Image selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">
                    Slide Image
                  </label>
                  <div className="relative aspect-[3/2] bg-gray-800 rounded-lg overflow-hidden mb-3">
                    <img src={slides[activeSlideIndex].imageUrl} alt={slides[activeSlideIndex].headline} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="outline" size="sm" className="bg-white/80 hover:bg-white text-gray-800" onClick={() => setIsEditingSlide(true)}>
                        Change Image
                      </Button>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" leftIcon={<ImageIcon size={14} />} onClick={() => setIsEditingSlide(true)} className="border-gray-700 hover:bg-gray-800 text-gray-300">
                      Select Image
                    </Button>
                    <Button variant="outline" size="sm" leftIcon={isGeneratingImage ? <Loader2Icon className="animate-spin" size={14} /> : <SparklesIcon size={14} />} onClick={handleGenerateImage} disabled={isGeneratingImage} className="border-gray-700 hover:bg-gray-800 text-gray-300">
                      {isGeneratingImage ? 'Generating...' : 'Generate AI Image'}
                    </Button>
                  </div>
                </div>
                {/* Stock image selector */}
                {isEditingSlide && <div className="mt-4 border border-gray-700 rounded-lg p-3 bg-gray-800/50">
                    <div className="flex justify-between items-center mb-3">
                      <h5 className="font-medium text-white">
                        Select an Image
                      </h5>
                      <button onClick={() => setIsEditingSlide(false)} className="text-gray-400 hover:text-gray-300">
                        <XIcon size={16} />
                      </button>
                    </div>
                    <div className="grid grid-cols-3 gap-2 max-h-[200px] overflow-y-auto">
                      {stockImages.map((url, index) => <div key={index} className="aspect-[3/2] rounded-md overflow-hidden cursor-pointer hover:ring-2 hover:ring-green-500 transition-all" onClick={() => handleSelectStockImage(url)}>
                          <img src={url} alt={`Stock image ${index + 1}`} className="w-full h-full object-cover" />
                        </div>)}
                    </div>
                  </div>}
              </div>
            </Card>
          </div>
        </div>}
    </div>;
};