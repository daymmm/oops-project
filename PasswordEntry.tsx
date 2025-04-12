
import React, { useState } from 'react';
import { Copy, EyeIcon, EyeOffIcon, Trash, Edit } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import CustomButton from './ui/CustomButton';

export interface PasswordEntryProps {
  id: string;
  website: string;
  username: string;
  password: string;
  notes?: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const PasswordEntry: React.FC<PasswordEntryProps> = ({
  id,
  website,
  username,
  password,
  notes,
  onEdit,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: `${type} copied successfully.`,
      duration: 2000,
    });
  };

  return (
    <div className="cyber-box mb-4 transition-all duration-300 hover:shadow-[0_0_8px_rgba(155,135,245,0.3)]">
      <div className="flex items-center justify-between">
        <div 
          className="flex-1 cursor-pointer flex items-center gap-2"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h3 className="text-cyber-purple-light font-future text-lg truncate">{website}</h3>
          <span className="text-sm text-muted-foreground truncate">{username}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="text-cyber-blue hover:text-cyber-blue/80 p-1 rounded-full hover:bg-white/5 transition-colors"
            onClick={() => onEdit(id)}
            aria-label="Edit password"
          >
            <Edit size={18} />
          </button>
          <button
            className="text-cyber-pink hover:text-cyber-pink/80 p-1 rounded-full hover:bg-white/5 transition-colors"
            onClick={() => onDelete(id)}
            aria-label="Delete password"
          >
            <Trash size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-cyber-purple/20 animate-fade-in">
          <div className="grid gap-2">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Username:</span>
              <div className="flex items-center gap-2">
                <span className="text-white">{username}</span>
                <button
                  onClick={() => copyToClipboard(username, "Username")}
                  className="text-cyber-blue hover:text-cyber-blue/80 p-1 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Copy username"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Password:</span>
              <div className="flex items-center gap-2">
                <span className="text-white">
                  {showPassword ? password : '•'.repeat(password.length)}
                </span>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-cyber-blue hover:text-cyber-blue/80 p-1 rounded-full hover:bg-white/5 transition-colors"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOffIcon size={14} /> : <EyeIcon size={14} />}
                </button>
                <button
                  onClick={() => copyToClipboard(password, "Password")}
                  className="text-cyber-blue hover:text-cyber-blue/80 p-1 rounded-full hover:bg-white/5 transition-colors"
                  aria-label="Copy password"
                >
                  <Copy size={14} />
                </button>
              </div>
            </div>
            {notes && (
              <div>
                <span className="text-muted-foreground">Notes:</span>
                <p className="text-white text-sm mt-1 bg-cyber-black/40 p-2 rounded border border-cyber-purple/10">
                  {notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordEntry;
