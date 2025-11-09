import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      await register(email, password, name);
      navigate('/dashboard', { replace: true });
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4 py-8">
      <div className="w-full max-w-md">
        <Card className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold text-center mb-4 md:mb-6">Create Your Account</h2>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-3 py-2 md:px-4 md:py-3 rounded relative mb-3 md:mb-4 text-sm" role="alert">{error}</div>}
          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
            <Input id="name" label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="email" label="Email Address" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <Input id="password" label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <div>
              <Button type="submit" className="w-full" isLoading={isLoading}>
                Register
              </Button>
            </div>
          </form>
           <p className="mt-3 md:mt-4 text-center text-sm">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-primary-blue hover:underline">
                    Login here
                </Link>
            </p>
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;