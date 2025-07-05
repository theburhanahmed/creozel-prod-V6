import React, { useState, lazy } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { MicIcon, XIcon, PlayIcon, PauseIcon, LoaderIcon, CheckCircleIcon, InfoIcon } from 'lucide-react';
interface VoiceTrainingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
}
export const VoiceTrainingModal = ({
  isOpen,
  onClose,
  onComplete
}: VoiceTrainingModalProps) => {
  const [step, setStep] = useState(1);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingProgress, setRecordingProgress] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [recordings, setRecordings] = useState<string[]>([]);
  const samplePhrases = ['The quick brown fox jumps over the lazy dog.', 'How much wood would a woodchuck chuck if a woodchuck could chuck wood?', 'She sells seashells by the seashore.', 'Peter Piper picked a peck of pickled peppers.', 'All I want is a proper cup of coffee made in a proper copper coffee pot.'];
  const handleStartRecording = () => {
    setIsRecording(true);
    // Simulate recording progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 5;
      setRecordingProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setIsRecording(false);
        setRecordings([...recordings, `recording-${recordings.length + 1}`]);
      }
    }, 200);
  };
  const handleFinishTraining = () => {
    setIsProcessing(true);
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setStep(3);
    }, 3000);
  };
  const handleComplete = () => {
    onComplete();
    onClose();
  };
  return <Modal isOpen={isOpen} onClose={onClose} title="Train Your AI Voice" size="md">
      <div className="space-y-6 py-2">
        {step === 1 && <>
            <div className="flex items-center gap-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-800/30">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-800/50 flex items-center justify-center text-blue-600 dark:text-blue-400 flex-shrink-0">
                <InfoIcon size={20} />
              </div>
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-1">
                  Train Your AI Voice Clone
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Record yourself reading the sample phrases below. The more you
                  record, the more accurate your voice clone will be.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Sample Phrases
              </h3>
              <div className="space-y-3">
                {samplePhrases.map((phrase, index) => <div key={index} className={`p-3 border rounded-lg flex items-center justify-between ${recordings.includes(`recording-${index + 1}`) ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800/30' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'}`}>
                    <p className="text-sm text-gray-800 dark:text-gray-200">
                      {phrase}
                    </p>
                    <div>
                      {recordings.includes(`recording-${index + 1}`) ? <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm" className="!p-1.5">
                            <PlayIcon size={14} />
                          </Button>
                          <CheckCircleIcon size={16} className="text-green-500" />
                        </div> : <Button variant={isRecording && recordingProgress < 100 ? 'danger' : 'primary'} size="sm" onClick={handleStartRecording} disabled={isRecording && recordingProgress < 100}>
                          {isRecording && recordingProgress < 100 ? <>
                              <span className="animate-pulse">
                                Recording...
                              </span>
                              <span className="ml-2">{recordingProgress}%</span>
                            </> : <>
                              <MicIcon size={14} className="mr-1" />
                              Record
                            </>}
                        </Button>}
                    </div>
                  </div>)}
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button variant="primary" onClick={() => setStep(2)} disabled={recordings.length < 3}>
                Next
              </Button>
            </div>
          </>}
        {step === 2 && <>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 mx-auto mb-4">
                <MicIcon size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Ready to Generate Your Voice
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                You've recorded {recordings.length} samples. Our AI will now
                process your voice to create a digital clone.
              </p>
              <div className="flex flex-col items-center gap-4">
                <div className="w-full max-w-sm bg-gray-100 dark:bg-gray-700 h-4 rounded-full overflow-hidden">
                  <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full" style={{
                width: `${recordings.length / 5 * 100}%`
              }}></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Voice quality:{' '}
                  {recordings.length < 3 ? 'Basic' : recordings.length < 5 ? 'Good' : 'Excellent'}
                </p>
              </div>
            </div>
            <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button variant="primary" onClick={handleFinishTraining} disabled={isProcessing}>
                {isProcessing ? <>
                    <LoaderIcon size={16} className="mr-2 animate-spin" />
                    Processing...
                  </> : 'Generate Voice'}
              </Button>
            </div>
          </>}
        {step === 3 && <>
            <div className="text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 mx-auto mb-4">
                <CheckCircleIcon size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Voice Clone Created Successfully!
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                Your voice is now ready to use in your videos. You can select it
                when creating content.
              </p>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white">
                      <MicIcon size={18} />
                    </div>
                    <div className="text-left">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        Your Voice
                      </h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Created just now
                      </p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="!p-1.5">
                    <PlayIcon size={14} />
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
              <Button variant="primary" onClick={handleComplete}>
                Start Using My Voice
              </Button>
            </div>
          </>}
      </div>
    </Modal>;
};