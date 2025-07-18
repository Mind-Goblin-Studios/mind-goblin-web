'use client';

import { useState, useEffect, useRef } from 'react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    'bot-field': '', // Hidden field for bot detection
    mathAnswer: '' // Math challenge answer
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formOpenTime, setFormOpenTime] = useState<number>(0);
  const [mathChallenge, setMathChallenge] = useState({ question: '', answer: 0 });
  const formRef = useRef<HTMLFormElement>(null);

  // Generate a simple math challenge
  const generateMathChallenge = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let answer = 0;
    let question = '';
    
    switch (operation) {
      case '+':
        answer = num1 + num2;
        question = `${num1} + ${num2}`;
        break;
      case '-':
        // Ensure positive result
        const [larger, smaller] = num1 >= num2 ? [num1, num2] : [num2, num1];
        answer = larger - smaller;
        question = `${larger} - ${smaller}`;
        break;
      case '*':
        answer = num1 * num2;
        question = `${num1} × ${num2}`;
        break;
    }
  
    setMathChallenge({ question, answer });
  };

  // Initialize form when modal opens
  useEffect(() => {
    if (isOpen) {
      setFormOpenTime(Date.now());
      generateMathChallenge();
      setFormData({
        name: '',
        email: '',
        message: '',
        'bot-field': '',
        mathAnswer: ''
      });
      setSubmitStatus('idle');
      setIsSubmitting(false);
      if (formRef.current) {
        formRef.current.reset();
      }
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Anti-bot checks
    const submissionTime = Date.now();
    const timeTaken = submissionTime - formOpenTime;

    // Check if honeypot field is filled (bot detection)
    if (formData['bot-field']) {
      console.log('Bot detected: honeypot field filled');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Check if form was submitted too quickly (likely a bot)
    if (timeTaken < 3000) { // Less than 3 seconds
      console.log('Bot detected: form submitted too quickly');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Check math challenge
    if (parseInt(formData.mathAnswer) !== mathChallenge.answer) {
      console.log('Math challenge failed');
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // If all validations pass, submit the form naturally
    console.log('All validations passed, submitting to Netlify...');
    
    // Show success message briefly, then submit
    setSubmitStatus('success');
    
    // Wait a moment to show success message, then submit the form
    setTimeout(() => {
      // Submit the form naturally - this will redirect to thank you page
      const form = e.target as HTMLFormElement;
      form.submit();
    }, 1000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
          data-netlify-honeypot="bot-field"
        >
          <input type="hidden" name="form-name" value="contact" />
          
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ display: 'none' }}>
            <label htmlFor="bot-field">Don't fill this out if you're human:</label>
            <input
              type="text"
              id="bot-field"
              name="bot-field"
              value={formData['bot-field']}
              onChange={handleChange}
              tabIndex={-1}
              autoComplete="off"
            />
          </div>

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
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
              value={formData.email}
              onChange={handleChange}
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
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              required
              disabled={isSubmitting}
            />
          </div>
          
          {/* Math challenge */}
          <div>
            <label htmlFor="mathAnswer" className="block text-sm font-medium text-gray-300 mb-1">
              Security Question: What is {mathChallenge.question}?
            </label>
            <input
              type="number"
              id="mathAnswer"
              name="mathAnswer"
              value={formData.mathAnswer}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none"
              required
              disabled={isSubmitting}
              placeholder="Enter the answer"
            />
          </div>
          
          {submitStatus === 'success' && (
            <div className="text-green-400 text-sm">
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-400 text-sm">
              ✗ Security validation failed. Please complete all security checks correctly, or email us directly at info@mindgoblin.gg
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