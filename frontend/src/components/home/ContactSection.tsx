import { FormEvent, useState } from 'react';
import { Mail, MessageCircle, Send } from 'lucide-react';

import { sendInquiry } from '../../api/inquiries';
import type { InquiryPayload } from '../../api/inquiries';

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

const initialForm: InquiryPayload = {
  name: '',
  company: '',
  email: '',
  phone: '',
  country: '',
  customerType: 'Hotel / Resort',
  productInterest: 'Pergola',
  projectSize: '',
  message: '',
};

export function ContactSection() {
  const [form, setForm] = useState<InquiryPayload>(initialForm);
  const [submitState, setSubmitState] = useState<SubmitState>('idle');

  function updateField(field: keyof InquiryPayload, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitState('submitting');

    try {
      await sendInquiry(form);
      setSubmitState('success');
      setForm(initialForm);
    } catch {
      setSubmitState('error');
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="wrap contact-grid">
        <div>
          <div className="eyebrow">Begin a Project</div>
          <h2>Tell us what you want to build outdoors.</h2>
          <p>
            Share your project type, size, country and preferred product line. Henlixo will recommend
            the right configuration for quotation.
          </p>
          <div className="contact-actions">
            <a className="btn btn-brass" href="https://api.whatsapp.com/send?phone=8615925638060" target="_blank" rel="noreferrer">
              <MessageCircle size={17} /> WhatsApp Direct
            </a>
            <a className="btn btn-outline-light" href="mailto:info@your-domain.com">
              <Mail size={17} /> Email
            </a>
          </div>
        </div>

        <form className="inquiry-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" required value={form.name} onChange={(event) => updateField('name', event.target.value)} />
          <input name="company" placeholder="Company" value={form.company} onChange={(event) => updateField('company', event.target.value)} />
          <input name="email" type="email" placeholder="Email" required value={form.email} onChange={(event) => updateField('email', event.target.value)} />
          <input name="phone" placeholder="WhatsApp / Phone" value={form.phone} onChange={(event) => updateField('phone', event.target.value)} />
          <input name="country" placeholder="Country / Region" value={form.country} onChange={(event) => updateField('country', event.target.value)} />
          <select name="customerType" value={form.customerType} onChange={(event) => updateField('customerType', event.target.value)}>
            <option>Hotel / Resort</option>
            <option>Dealer / Distributor</option>
            <option>Contractor</option>
            <option>Villa Owner</option>
            <option>Designer / Architect</option>
            <option>Other</option>
          </select>
          <select name="productInterest" value={form.productInterest} onChange={(event) => updateField('productInterest', event.target.value)}>
            <option>Pergola</option>
            <option>Sunroom</option>
            <option>Railing</option>
            <option>Accessories</option>
            <option>Complete Outdoor Solution</option>
          </select>
          <input name="projectSize" placeholder="Project Size / Quantity" value={form.projectSize} onChange={(event) => updateField('projectSize', event.target.value)} />
          <textarea name="message" placeholder="Project size, quantity, timeline..." required value={form.message} onChange={(event) => updateField('message', event.target.value)} />
          <button className="btn btn-primary" type="submit" disabled={submitState === 'submitting'}>
            {submitState === 'submitting' ? 'Sending...' : 'Request Quote'} <Send size={16} />
          </button>
          <div className="form-status" aria-live="polite">
            {submitState === 'success' && 'Thanks. Our project team will contact you within 24 hours.'}
            {submitState === 'error' && 'Submission failed. Please contact us via WhatsApp or email.'}
          </div>
        </form>
      </div>
    </section>
  );
}
