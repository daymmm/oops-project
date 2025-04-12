
import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff, Shield, AlertTriangle, Save, Check } from 'lucide-react';
import CustomButton from './ui/CustomButton';
import { Switch } from './ui/switch';
import { useToast } from "@/components/ui/use-toast";
import { cn } from '@/lib/utils';

interface PasswordFormProps {
  isEditing: boolean;
  initialData?: {
    id?: string;
    website: string;
    username: string;
    password: string;
    notes?: string;
  };
  onSave: (data: {
    id?: string;
    website: string;
    username: string;
    password: string;
    notes?: string;
  }) => void;
  onCancel: () => void;
}

const PasswordForm: React.FC<PasswordFormProps> = ({
  isEditing,
  initialData,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    id: initialData?.id || '',
    website: initialData?.website || '',
    username: initialData?.username || '',
    password: initialData?.password || '',
    notes: initialData?.notes || '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [autoSave, setAutoSave] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    message: '',
    color: 'text-destructive',
  });
  const [autoSaveTimeout, setAutoSaveTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isBreached, setIsBreached] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || '',
        website: initialData.website || '',
        username: initialData.username || '',
        password: initialData.password || '',
        notes: initialData.notes || '',
      });
      checkPasswordStrength(initialData.password);
    }
  }, [initialData]);

  useEffect(() => {
    // Load auto-save preference
    const savedAutoSave = localStorage.getItem('subhpass_autosave');
    if (savedAutoSave) {
      setAutoSave(savedAutoSave === 'true');
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'password') {
      checkPasswordStrength(value);
    }

    // Auto-save after 2 seconds of inactivity if enabled
    if (autoSave) {
      if (autoSaveTimeout) {
        clearTimeout(autoSaveTimeout);
      }
      
      const newTimeout = setTimeout(() => {
        if (formData.website && formData.username && formData.password) {
          handleSubmit(new Event('autoSave') as unknown as React.FormEvent);
          toast({
            title: "Auto-saved",
            description: "Your changes have been automatically saved.",
            duration: 2000,
          });
        }
      }, 2000);
      
      setAutoSaveTimeout(newTimeout);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    
    // Save auto-save preference
    localStorage.setItem('subhpass_autosave', autoSave.toString());
  };

  const toggleAutoSave = () => {
    setAutoSave(!autoSave);
    localStorage.setItem('subhpass_autosave', (!autoSave).toString());
    
    toast({
      title: !autoSave ? "Auto-save enabled" : "Auto-save disabled",
      description: !autoSave 
        ? "Changes will be saved automatically"
        : "Changes will only be saved when you click Save",
      duration: 3000,
    });
  };
  
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  
  // Password strength checker
  const checkPasswordStrength = (password: string) => {
    if (!password) {
      setPasswordStrength({
        score: 0,
        message: '',
        color: 'text-destructive',
      });
      setIsBreached(false);
      return;
    }
    
    // Common passwords check for breach simulation
    const commonPasswords = ['password', '123456', 'qwerty', 'admin', 'welcome', 'password123'];
    const isCommonPassword = commonPasswords.includes(password.toLowerCase());
    setIsBreached(isCommonPassword);
    
    // Length check
    const lengthScore = Math.min(password.length / 2, 2);
    
    // Complexity checks
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumbers = /[0-9]/.test(password);
    const hasSpecialChars = /[^A-Za-z0-9]/.test(password);
    
    const complexityScore = 
      (hasUppercase ? 1 : 0) + 
      (hasLowercase ? 1 : 0) + 
      (hasNumbers ? 1 : 0) + 
      (hasSpecialChars ? 2 : 0);
    
    const totalScore = Math.min(lengthScore + complexityScore, 5);
    
    let message = '';
    let color = '';
    
    if (totalScore < 2) {
      message = 'Very Weak';
      color = 'text-destructive';
    } else if (totalScore < 3) {
      message = 'Weak';
      color = 'text-destructive';
    } else if (totalScore < 4) {
      message = 'Moderate';
      color = 'text-amber-500';
    } else if (totalScore < 5) {
      message = 'Strong';
      color = 'text-green-500';
    } else {
      message = 'Very Strong';
      color = 'text-cyber-purple';
    }
    
    setPasswordStrength({
      score: totalScore,
      message,
      color,
    });
  };

  return (
    <div className="cyber-box w-full max-w-md mx-auto p-5 animate-fade-in">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-future text-cyber-purple-light">
          {isEditing ? 'Edit Password' : 'Add New Password'}
        </h2>
        <button 
          onClick={onCancel}
          className="text-cyber-pink hover:text-cyber-pink/80 p-1 rounded-full hover:bg-white/5 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="website" className="block text-sm text-muted-foreground mb-1">
            Website / App
          </label>
          <input
            type="text"
            id="website"
            name="website"
            value={formData.website}
            onChange={handleChange}
            required
            className="cyber-input w-full"
            placeholder="example.com"
          />
        </div>

        <div>
          <label htmlFor="username" className="block text-sm text-muted-foreground mb-1">
            Username / Email
          </label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            className="cyber-input w-full"
            placeholder="user@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm text-muted-foreground mb-1">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="cyber-input w-full pr-10"
              placeholder="••••••••"
            />
            <button 
              type="button" 
              onClick={toggleShowPassword}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-white"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          
          {formData.password && (
            <div className="mt-2">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-xs font-medium ${passwordStrength.color}`}>
                  {passwordStrength.message}
                </span>
                <span className="text-xs text-muted-foreground">
                  {passwordStrength.score}/5
                </span>
              </div>
              <div className="w-full bg-cyber-black/50 h-1 rounded overflow-hidden">
                <div 
                  className={cn(
                    "h-full", 
                    passwordStrength.score < 2 ? "bg-destructive" : 
                    passwordStrength.score < 3 ? "bg-destructive/80" : 
                    passwordStrength.score < 4 ? "bg-amber-500" : 
                    passwordStrength.score < 5 ? "bg-green-500" : 
                    "bg-gradient-to-r from-cyber-purple to-cyber-blue animate-pulse"
                  )}
                  style={{ width: `${passwordStrength.score * 20}%` }}
                ></div>
              </div>
            </div>
          )}

          {isBreached && (
            <div className="mt-2 flex items-start text-destructive gap-2 bg-destructive/10 p-2 rounded text-xs animate-pulse">
              <AlertTriangle size={14} className="mt-0.5" />
              <div>
                <p className="font-semibold">Security Warning!</p>
                <p>This password appears in data breaches. Consider using a stronger, unique password.</p>
              </div>
            </div>
          )}

          {passwordStrength.score >= 4 && (
            <div className="mt-2 flex items-start text-green-500 gap-2 bg-green-500/10 p-2 rounded text-xs">
              <Shield size={14} className="mt-0.5" />
              <p>Great choice! This password is strong and secure.</p>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm text-muted-foreground mb-1">
            Notes (Optional)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows={3}
            className="cyber-input w-full resize-none"
            placeholder="Additional information..."
          ></textarea>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center space-x-2">
            <Switch id="autoSave" checked={autoSave} onCheckedChange={toggleAutoSave} />
            <label htmlFor="autoSave" className="text-sm cursor-pointer select-none">
              Auto-save changes
            </label>
          </div>
          
          <div className="flex space-x-3">
            <CustomButton type="button" variant="secondary" onClick={onCancel}>
              Cancel
            </CustomButton>
            <CustomButton type="submit" className="gap-2">
              {autoSave ? (
                <Check size={16} className="animate-pulse" />
              ) : (
                <Save size={16} />
              )}
              {isEditing ? 'Update' : 'Save'}
            </CustomButton>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PasswordForm;
