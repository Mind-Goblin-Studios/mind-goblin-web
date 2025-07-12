'use client';

import { useState, useEffect, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    honeypot: '', // Hidden field for bot detection
    mathAnswer: '' // Math challenge answer
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [formOpenTime, setFormOpenTime] = useState<number>(0);
  const [mathChallenge, setMathChallenge] = useState({ question: '', answer: 0 });
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const recaptchaRef = useRef<ReCAPTCHA>(null);

  // reCAPTCHA site key - you'll need to get this from Google reCAPTCHA admin
  const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '6LdDKoArAAAAAHxkZ8-s2mF-VJSBhcPxr3fJLaX';

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
        honeypot: '',
        mathAnswer: ''
      });
      setRecaptchaToken(null);
      setSubmitStatus('idle');
      // Reset reCAPTCHA when modal opens
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
    }
  }, [isOpen]);

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    // Anti-bot checks
    const submissionTime = Date.now();
    const timeTaken = submissionTime - formOpenTime;

    // Check if honeypot field is filled (bot detection)
    if (formData.honeypot) {
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
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    // Check reCAPTCHA
    if (!recaptchaToken) {
      setSubmitStatus('error');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
          'g-recaptcha-response': recaptchaToken
        }).toString()
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', email: '', message: '', honeypot: '', mathAnswer: '' });
        setRecaptchaToken(null);
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setTimeout(() => {
          onClose();
          setSubmitStatus('idle');
        }, 2000);
      } else {
        setSubmitStatus('error');
        // Reset reCAPTCHA on error
        if (recaptchaRef.current) {
          recaptchaRef.current.reset();
        }
        setRecaptchaToken(null);
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      // Reset reCAPTCHA on error
      if (recaptchaRef.current) {
        recaptchaRef.current.reset();
      }
      setRecaptchaToken(null);
    } finally {
      setIsSubmitting(false);
    }
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

        {/* Hidden form for Netlify */}
        <form
          name="contact"
          method="POST"
          data-netlify="true"
          data-netlify-honeypot="bot-field"
          data-netlify-recaptcha="true"
          hidden
        >
          <input type="text" name="name" />
          <input type="email" name="email" />
          <textarea name="message"></textarea>
          <div data-netlify-recaptcha="true"></div>
        </form>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="hidden" name="form-name" value="contact" />
          
          {/* Honeypot field - hidden from users but visible to bots */}
          <div style={{ display: 'none' }}>
            <label htmlFor="honeypot">Don't fill this out if you're human:</label>
            <input
              type="text"
              id="honeypot"
              name="honeypot"
              value={formData.honeypot}
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

          {/* Google reCAPTCHA */}
          <div className="flex justify-center">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={RECAPTCHA_SITE_KEY}
              onChange={handleRecaptchaChange}
              theme="dark"
            />
          </div>
          
          {submitStatus === 'success' && (
            <div className="text-green-400 text-sm">
              ✓ Message sent successfully! We'll get back to you soon.
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="text-red-400 text-sm">
              ✗ Failed to send message. Please complete all security checks and try again, or email us directly at info@mindgoblin.gg
            </div>
          )}

          <button
            type="submit"
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isSubmitting || !recaptchaToken}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
} 