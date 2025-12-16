// This page exists for Netlify form detection
// Making it visible to ensure it's included in the build

export default function FormsPage() {
  return (
    <div className="hidden">
      <h1>Form Detection Page</h1>
      <p>This page exists for Netlify form detection.</p>
      
      {/* The actual form for Netlify to detect */}
      <form name="contact" method="POST" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="hidden" name="form-name" value="contact" />
        <input type="hidden" name="bot-field" />
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
      </form>
    </div>
  );
} 