// This page exists for Netlify form detection
// Making it visible to ensure it's included in the build

export default function FormsPage() {
  return (
    <div>
      <h1>Form Detection Page</h1>
      <p>This page exists for Netlify form detection.</p>
      
      {/* The actual form for Netlify to detect */}
      <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field" data-netlify-recaptcha="true">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
        <input type="text" name="bot-field" />
        <div data-netlify-recaptcha="true"></div>
      </form>
    </div>
  );
} 