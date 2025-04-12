
import React, { useState } from 'react';
import { AlertTriangle, Check } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CustomButton from './ui/CustomButton';
import { Input } from './ui/input';
import { supabase } from '@/integrations/supabase/client';
import PinInput from './ui/PinInput';
import { SecurityQuestion, ResetPinRequest } from '@/types/password-manager';

interface ForgotPinProps {
  onBack: () => void;
  onPinReset: () => void;
}

const SECURITY_QUESTIONS = [
  "What was your childhood nickname?",
  "What is the name of your first pet?",
  "In what city were you born?",
  "What is your mother's maiden name?",
  "What was your favorite food as a child?",
  "What was the name of your elementary school?"
];

const ForgotPin: React.FC<ForgotPinProps> = ({ onBack, onPinReset }) => {
  const [email, setEmail] = useState('');
  const [step, setStep] = useState(1);
  const [selectedQuestions, setSelectedQuestions] = useState<[string, string]>(["", ""]);
  const [answers, setAnswers] = useState<[string, string]>(["", ""]);
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // In a real app, this would check if the email exists in the auth system
      // For demo, we'll just proceed to the next step
      setTimeout(() => {
        setStep(2);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error verifying email. Please try again.');
      setLoading(false);
    }
  };

  const handleQuestionSelection = (index: number, value: string) => {
    const newQuestions = [...selectedQuestions] as [string, string];
    newQuestions[index] = value;
    setSelectedQuestions(newQuestions);
  };

  const handleAnswerChange = (index: number, value: string) => {
    const newAnswers = [...answers] as [string, string];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  };

  const handleQuestionsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!selectedQuestions[0] || !selectedQuestions[1] || !answers[0] || !answers[1]) {
      setError('Please select both questions and provide answers.');
      setLoading(false);
      return;
    }

    try {
      // In a real app, this would register the security questions in the database
      setTimeout(() => {
        setStep(3);
        setLoading(false);
      }, 1000);
    } catch (err) {
      setError('Error setting security questions. Please try again.');
      setLoading(false);
    }
  };

  const handlePinComplete = (enteredPin: string) => {
    setNewPin(enteredPin);
  };

  const handleConfirmPinComplete = (enteredPin: string) => {
    setConfirmPin(enteredPin);
    
    if (newPin !== enteredPin) {
      setError('PINs do not match. Please try again.');
      return;
    }
    
    handleResetPin();
  };

  const handleResetPin = async () => {
    setLoading(true);
    setError('');

    try {
      // In a real app with Supabase, this would update the PIN in the database
      localStorage.setItem('subhpass_pin', newPin);
      
      toast({
        title: "PIN reset successful",
        description: "Your PIN has been updated.",
        duration: 3000,
      });
      
      setLoading(false);
      onPinReset();
    } catch (err) {
      setError('Error resetting PIN. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 w-full max-w-md">
      <button 
        onClick={onBack}
        className="flex items-center text-sm text-muted-foreground hover:text-foreground mb-4"
      >
        ← Back to login
      </button>
      
      <div className="cyber-box text-center p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyber-purple/5 blur-xl -z-1"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyber-blue/5 blur-xl -z-1"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        
        <h2 className="text-xl font-future text-cyber-purple-light mb-6">
          Reset Your PIN
        </h2>
        
        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter your email address to begin the PIN reset process.
            </p>
            
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="cyber-input"
                required
              />
            </div>
            
            <CustomButton type="submit" disabled={loading} className="w-full mt-4">
              {loading ? 'Verifying...' : 'Continue'}
            </CustomButton>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleQuestionsSubmit} className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Set up security questions for PIN recovery.
            </p>
            
            {[0, 1].map((index) => (
              <div key={index} className="space-y-1">
                <label className="text-sm font-medium">
                  Security Question {index + 1}
                </label>
                <select
                  value={selectedQuestions[index]}
                  onChange={(e) => handleQuestionSelection(index, e.target.value)}
                  className="cyber-input w-full"
                  required
                >
                  <option value="">Select a question</option>
                  {SECURITY_QUESTIONS.filter(q => 
                    !selectedQuestions.includes(q) || selectedQuestions[index] === q
                  ).map((q, i) => (
                    <option key={i} value={q}>
                      {q}
                    </option>
                  ))}
                </select>
                
                <div className="mt-2">
                  <label className="text-sm font-medium">
                    Answer
                  </label>
                  <Input
                    value={answers[index]}
                    onChange={(e) => handleAnswerChange(index, e.target.value)}
                    className="cyber-input"
                    required
                  />
                </div>
              </div>
            ))}
            
            <CustomButton type="submit" disabled={loading} className="w-full mt-4">
              {loading ? 'Saving...' : 'Continue'}
            </CustomButton>
          </form>
        )}
        
        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create a new 3-digit PIN.
            </p>
            
            {!newPin ? (
              <>
                <p className="text-sm mb-2">Enter your new PIN:</p>
                <PinInput onComplete={handlePinComplete} className="mb-4" />
              </>
            ) : (
              <>
                <p className="text-sm mb-2">Confirm your new PIN:</p>
                <PinInput onComplete={handleConfirmPinComplete} className="mb-4" />
              </>
            )}
            
            {loading && (
              <div className="flex justify-center mt-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyber-purple"></div>
              </div>
            )}
          </div>
        )}
        
        {error && (
          <div className="flex items-center justify-center text-destructive gap-2 mt-4 bg-destructive/10 p-2 rounded animate-pulse">
            <AlertTriangle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPin;
