
import React, { useState, useEffect } from 'react';
import { Plus, LogOut } from 'lucide-react';
import CustomButton from './ui/CustomButton';
import PasswordEntry, { PasswordEntryProps } from './PasswordEntry';
import PasswordForm from './PasswordForm';
import SearchBar from './SearchBar';
import { useToast } from "@/components/ui/use-toast";

interface DashboardProps {
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ onLogout }) => {
  const [passwords, setPasswords] = useState<Omit<PasswordEntryProps, 'onEdit' | 'onDelete'>[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPassword, setEditingPassword] = useState<Omit<PasswordEntryProps, 'onEdit' | 'onDelete'> | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  // Load passwords from localStorage on component mount
  useEffect(() => {
    const storedPasswords = localStorage.getItem('subhpass_passwords');
    if (storedPasswords) {
      try {
        setPasswords(JSON.parse(storedPasswords));
      } catch (error) {
        console.error('Failed to parse stored passwords:', error);
        setPasswords([]);
      }
    }
  }, []);

  // Save passwords to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('subhpass_passwords', JSON.stringify(passwords));
  }, [passwords]);

  const handleAddNew = () => {
    setEditingPassword(null);
    setShowForm(true);
  };

  const handleEdit = (id: string) => {
    const passwordToEdit = passwords.find(p => p.id === id);
    if (passwordToEdit) {
      setEditingPassword(passwordToEdit);
      setShowForm(true);
    }
  };

  const handleDelete = (id: string) => {
    setPasswords(passwords.filter(p => p.id !== id));
    toast({
      title: "Password deleted",
      description: "The password entry has been deleted.",
      duration: 3000,
    });
  };

  const handleSave = (data: {
    id?: string;
    website: string;
    username: string;
    password: string;
    notes?: string;
  }) => {
    if (data.id) {
      // Update existing password
      setPasswords(passwords.map(p => 
        p.id === data.id ? { ...data } as Omit<PasswordEntryProps, 'onEdit' | 'onDelete'> : p
      ));
      toast({
        title: "Password updated",
        description: `Entry for ${data.website} has been updated.`,
        duration: 3000,
      });
    } else {
      // Add new password with a unique id
      const newPassword = {
        ...data,
        id: crypto.randomUUID(),
      } as Omit<PasswordEntryProps, 'onEdit' | 'onDelete'>;
      setPasswords([...passwords, newPassword]);
      toast({
        title: "Password added",
        description: `New entry for ${data.website} has been created.`,
        duration: 3000,
      });
    }
    setShowForm(false);
    setEditingPassword(null);
  };

  // Filter passwords based on search term
  const filteredPasswords = passwords.filter(p => 
    p.website.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-3xl font-future glow-text">SubhPass</h1>
        <CustomButton 
          variant="secondary" 
          onClick={onLogout}
          className="flex items-center gap-2"
        >
          <LogOut size={16} />
          Logout
        </CustomButton>
      </div>

      <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        <div className="flex-1">
          <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        </div>
        <CustomButton onClick={handleAddNew} className="flex items-center gap-2 whitespace-nowrap">
          <Plus size={16} />
          Add Password
        </CustomButton>
      </div>

      {showForm ? (
        <PasswordForm
          isEditing={!!editingPassword}
          initialData={editingPassword || undefined}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingPassword(null);
          }}
        />
      ) : (
        <div className="space-y-2">
          {filteredPasswords.length > 0 ? (
            filteredPasswords.map((password) => (
              <PasswordEntry
                key={password.id}
                {...password}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          ) : (
            <div className="cyber-box text-center py-8">
              <p className="text-muted-foreground mb-2">
                {searchTerm 
                  ? "No passwords match your search criteria." 
                  : "No passwords added yet."}
              </p>
              {!searchTerm && (
                <CustomButton onClick={handleAddNew} className="mt-2 mx-auto flex items-center gap-2">
                  <Plus size={16} />
                  Add Your First Password
                </CustomButton>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
