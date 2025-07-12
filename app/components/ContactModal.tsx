'use client';

import { useState, useEffect, useRef } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const formRef = useRef<HTMLFormElement>(null);

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setSubmitStatus('idle');
      setIsSubmitting(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    // Don't prevent default - let the form submit naturally
    setIsSubmitting(true);
    setSubmitStatus('success');
    
    // Close modal after a short delay
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-8 rounded-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">Contact Us</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form 
          ref={formRef}
          onSubmit={handleSubmit} 
          className="space-y-4" 
          name="contact"
          method="POST"
          action="/"
          data-netlify="true"
        >
          <input type="hidden" name="form-name" value="contact" />

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              required
              disabled={isSubmitting}
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-1">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {submitStatus === 'success' && (
            <div className="text-green-400 text-sm">
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-400 text-sm">
              ✗ Failed to send message. Please try again.
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
} 