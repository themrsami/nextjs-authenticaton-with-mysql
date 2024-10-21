'use client';
import React, { useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';

const Signup = () => {
  const [isTermsAccepted, setIsTermsAccepted] = useState(false);
  const [loading, setLoading] = useState(false); // Loading state added
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const formRef = useRef(); // Create a reference for the form

  // Handle checkbox change for terms and conditions
  const handleTermsChange = (checked) => {
    setIsTermsAccepted(checked);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(formRef.current); // Use formRef to get form data

    setLoading(true); // Start loading when form is submitted
    setError(null); // Reset previous errors
    setSuccess(null); // Reset previous success messages

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData)), // Convert FormData to JSON
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle specific server errors
        if (result.error === 'Email already exists.') {
          setError([{ message: 'Email already exists. Please use a different email.' }]);
        } else {
          setError(result.errors || [{ message: 'Unknown error occurred.' }]);
        }
      } else {
        setSuccess(result.message); // Show success message
        formRef.current.reset(); // Reset the form fields
      }
    } catch (err) {
      console.error('Error submitting the form:', err);
      setError([{ message: 'Failed to submit. Please try again later.' }]);
    } finally {
      setLoading(false); // End loading after API response
    }
  };

  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Signup</CardTitle>
          <CardDescription>
            Signup to create an account and start using our services.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit} ref={formRef}> {/* Attach the ref here */}
            <div className="space-y-1">
              <Label htmlFor="name">Full Name</Label>
              <Input name="fullname" id="name" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input name="email" id="email" type="email" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmemail">Confirm Email</Label>
              <Input name="confirmemail" id="confirmemail" type="email" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <Input name="password" id="password" type="password" required />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirmpassword">Confirm Password</Label>
              <Input name="confirmpassword" id="confirmpassword" type="password" required />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="terms"
                checked={isTermsAccepted}
                onCheckedChange={handleTermsChange}
              />
              <Label htmlFor="terms">Accept terms and conditions</Label>
            </div>
            <Button type="submit" disabled={!isTermsAccepted || loading}>
              {loading ? 'Signing Up...' : 'Sign Up'} {/* Loading indicator in button */}
            </Button>
            {error && (
              <div className="text-red-500">
                {error.map((err, idx) => (
                  <p key={idx}>{err.message}</p>
                ))}
              </div>
            )}
            {success && <p className="text-green-500">{success}</p>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Signup;
