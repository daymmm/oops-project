import React, { useState, useEffect } from 'react';
import { Shield, AlertTriangle, Key, Lock, KeyRound } from 'lucide-react';
import CustomButton from './ui/CustomButton';
import PinInput from './ui/PinInput';
import { useToast } from "@/components/ui/use-toast";
import ForgotPin from './ForgotPin';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isSetup, setIsSetup] = useState(true);
  const [isChangingPin, setIsChangingPin] = useState(false);
  const [isForgotPin, setIsForgotPin] = useState(false);
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentPin, setCurrentPin] = useState('');
  const [error, setError] = useState('');
  const [inactivityTimer, setInactivityTimer] = useState<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Check if PIN exists in localStorage
    const storedPin = localStorage.getItem('subhpass_pin');
    
    // If no PIN is set, set default to "123"
    if (!storedPin) {
      localStorage.setItem('subhpass_pin', '123');
      setIsSetup(false);
    } else {
      setIsSetup(!storedPin);
    }
  }, []);

  const handlePinComplete = (enteredPin: string) => {
    if (isChangingPin) {
      // Verify current PIN first
      const storedPin = localStorage.getItem('subhpass_pin');
      
      if (!currentPin) {
        setCurrentPin(enteredPin);
        
        if (enteredPin === storedPin) {
          toast({
            title: "Current PIN verified",
            description: "Please enter your new PIN",
            duration: 3000,
          });
        } else {
          setError('Incorrect current PIN. Please try again.');
          setTimeout(() => setError(''), 3000);
          setCurrentPin('');
        }
      } else if (!pin) {
        // Storing new PIN
        setPin(enteredPin);
        toast({
          title: "New PIN entered",
          description: "Please confirm your new PIN",
          duration: 3000,
        });
      }
    } else if (!isSetup) {
      // Validate against stored PIN
      const storedPin = localStorage.getItem('subhpass_pin');
      if (enteredPin === storedPin) {
        toast({
          title: "Login successful",
          description: "Welcome to SubhPass!",
          duration: 3000,
        });
        
        // Set session
        sessionStorage.setItem('subhpass_auth', 'true');
        
        // Set inactivity timer - logout after 5 minutes
        const timer = setTimeout(() => {
          sessionStorage.removeItem('subhpass_auth');
          window.location.reload();
        }, 5 * 60 * 1000); // 5 minutes
        
        setInactivityTimer(timer);
        
        onLogin();
      } else {
        setError('Incorrect PIN. Please try again.');
        setTimeout(() => setError(''), 3000);
      }
    } else {
      // First PIN for setup
      setPin(enteredPin);
    }
  };

  const handleConfirmPinComplete = (enteredConfirmPin: string) => {
    setConfirmPin(enteredConfirmPin);
    
    if (isChangingPin) {
      if (pin === enteredConfirmPin) {
        // Store new PIN in localStorage
        localStorage.setItem('subhpass_pin', pin);
        
        toast({
          title: "PIN changed successfully",
          description: "Your PIN has been updated.",
          duration: 3000,
        });
        
        setIsChangingPin(false);
        setPin('');
        setConfirmPin('');
        setCurrentPin('');
      } else {
        setError('PINs do not match. Please try again.');
        setTimeout(() => setError(''), 3000);
        setPin('');
        setConfirmPin('');
      }
    } else if (isSetup) {
      if (pin === enteredConfirmPin) {
        // Store PIN in localStorage
        localStorage.setItem('subhpass_pin', pin);
        
        toast({
          title: "PIN created successfully",
          description: "You can now use this PIN to access your passwords.",
          duration: 3000,
        });
        
        // Set session
        sessionStorage.setItem('subhpass_auth', 'true');
        
        onLogin();
      } else {
        setError('PINs do not match. Please try again.');
        setTimeout(() => setError(''), 3000);
        setPin('');
        setConfirmPin('');
      }
    }
  };

  const handleStartPinChange = () => {
    setIsChangingPin(true);
    setPin('');
    setConfirmPin('');
    setCurrentPin('');
  };

  const handleCancelPinChange = () => {
    setIsChangingPin(false);
    setPin('');
    setConfirmPin('');
    setCurrentPin('');
  };

  const handleForgotPin = () => {
    setIsForgotPin(true);
  };

  const handleBackFromForgot = () => {
    setIsForgotPin(false);
  };

  const handlePinReset = () => {
    setIsForgotPin(false);
    toast({
      title: "PIN Reset Complete",
      description: "Your PIN has been successfully reset.",
      duration: 3000,
    });
  };

  useEffect(() => {
    // Reset inactivity timer when user interacts with the page
    const resetTimer = () => {
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
        
        // Set a new timer
        const newTimer = setTimeout(() => {
          sessionStorage.removeItem('subhpass_auth');
          window.location.reload();
        }, 5 * 60 * 1000); // 5 minutes
        
        setInactivityTimer(newTimer);
      }
    };
    
    // Add event listeners for user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    
    return () => {
      // Cleanup event listeners
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
      
      // Clear timer on component unmount
      if (inactivityTimer) {
        clearTimeout(inactivityTimer);
      }
    };
  }, [inactivityTimer]);

  // Show the forgot PIN screen if user clicked "Forgot PIN"
  if (isForgotPin) {
    return <ForgotPin onBack={handleBackFromForgot} onPinReset={handlePinReset} />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-4">
      <div className="text-center mb-8">
        <div className="flex justify-center mb-4 relative">
          <Shield className="w-16 h-16 text-cyber-purple animate-glow" />
          <div className="absolute inset-0 bg-cyber-grid opacity-10"></div>
        </div>
        <h1 className="text-4xl font-future glow-text mb-2">SubhPass</h1>
        <p className="text-muted-foreground">Your personal password vault</p>
      </div>

      <div className="cyber-box text-center p-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-cyber-purple/5 blur-xl -z-1"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full bg-cyber-blue/5 blur-xl -z-1"></div>
        <div className="absolute inset-0 bg-cyber-grid opacity-5"></div>
        
        {isChangingPin ? (
          <h2 className="text-xl font-future text-cyber-purple-light mb-6 animate-pulse">
            Change Your PIN
          </h2>
        ) : (
          <h2 className="text-xl font-future text-cyber-purple-light mb-6">
            {isSetup ? 'Create Your PIN' : 'Enter Your PIN'}
          </h2>
        )}

        {isChangingPin && !currentPin && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter your current PIN:
            </p>
            <PinInput onComplete={handlePinComplete} className="mb-4" />
            <div className="flex gap-2 justify-center mt-6">
              <CustomButton variant="secondary" onClick={handleCancelPinChange}>
                Cancel
              </CustomButton>
            </div>
          </div>
        )}

        {isChangingPin && currentPin && !pin && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create a new 3-digit PIN:
            </p>
            <PinInput onComplete={handlePinComplete} className="mb-4" />
          </div>
        )}

        {isChangingPin && currentPin && pin && !confirmPin && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Confirm your new PIN:
            </p>
            <PinInput onComplete={handleConfirmPinComplete} className="mb-4" />
          </div>
        )}

        {!isChangingPin && isSetup && !pin && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Create a 3-digit PIN to secure your passwords.
            </p>
            <PinInput onComplete={handlePinComplete} className="mb-4" />
          </div>
        )}

        {!isChangingPin && isSetup && pin && !confirmPin && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Confirm your PIN to continue.
            </p>
            <PinInput onComplete={handleConfirmPinComplete} className="mb-4" />
          </div>
        )}

        {!isChangingPin && !isSetup && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground mb-4">
              Enter your PIN to access your passwords.
            </p>
            <PinInput onComplete={handlePinComplete} className="mb-4" />
            
            <div className="mt-6 flex flex-col gap-3">
              <CustomButton 
                variant="secondary" 
                onClick={handleStartPinChange}
                className="flex items-center gap-2 mx-auto"
              >
                <Key size={16} />
                Change PIN
              </CustomButton>
              
              <button 
                onClick={handleForgotPin}
                className="text-sm text-muted-foreground hover:text-cyber-purple transition-colors flex items-center gap-1 justify-center"
              >
                <KeyRound size={14} />
                Forgot PIN?
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center justify-center text-destructive gap-2 mt-4 bg-destructive/10 p-2 rounded animate-pulse">
            <AlertTriangle size={18} />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <div className="mt-6 text-xs text-muted-foreground">
          <p>For your security, you will be automatically logged out after 5 minutes of inactivity.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
