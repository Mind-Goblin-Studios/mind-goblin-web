// This page exists solely for Netlify form detection
// It won't be visible to users but ensures Netlify can detect our forms

export default function FormsPage() {
  return (
    <div style={{ display: 'none' }}>
      <form name="contact" data-netlify="true" data-netlify-honeypot="bot-field">
        <input type="text" name="name" />
        <input type="email" name="email" />
        <textarea name="message"></textarea>
        <input type="text" name="bot-field" />
        <div data-netlify-recaptcha="true"></div>
      </form>
    </div>
  );
} 