import { useState, type FormEvent } from "react";
import { Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { contactInfo } from "./data";

export function Contact() {
  const [submitting, setSubmitting] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    const name = String(data.get("name") ?? "").trim();
    const email = String(data.get("email") ?? "").trim();
    const message = String(data.get("message") ?? "").trim();

    if (!name || !email || !message) {
      toast.error("Please fill in name, email, and message.");
      return;
    }

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      form.reset();
      toast.success("Message sent. We will reply within one business day.");
    }, 600);
  };

  return (
    <section id="contact" className="section-pad border-t border-border">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Contact
          </p>
          <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
            Tell us what you are building
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Share a bit about your product or process. We will respond with
            honest fit, timing, and next steps.
          </p>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-12 lg:gap-12">
          <form
            onSubmit={onSubmit}
            className="surface-card rounded-xl p-6 md:p-8 lg:col-span-7 space-y-5"
            noValidate
          >
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  name="name"
                  autoComplete="name"
                  placeholder="Your name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@company.com"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                name="company"
                autoComplete="organization"
                placeholder="Optional"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                name="message"
                placeholder="What problem are you trying to solve?"
                required
              />
            </div>
            <Button type="submit" size="lg" disabled={submitting} className="w-full sm:w-auto">
              {submitting ? "Sending…" : "Send message"}
            </Button>
          </form>

          <aside className="lg:col-span-5 flex flex-col gap-4">
            <ContactCard
              icon={Mail}
              label="Email"
              value={contactInfo.email}
              href={`mailto:${contactInfo.email}`}
            />
            <ContactCard
              icon={Phone}
              label="Phone"
              value={contactInfo.phone}
              href={`tel:${contactInfo.phone.replace(/\D/g, "")}`}
            />
            <ContactCard
              icon={MapPin}
              label="Office"
              value={contactInfo.address}
            />
          </aside>
        </div>
      </div>
    </section>
  );
}

function ContactCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: typeof Mail;
  label: string;
  value: string;
  href?: string;
}) {
  const content = (
    <>
      <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-border bg-bg-subtle text-fg">
        <Icon className="h-4.5 w-4.5 h-4 w-4" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-muted">
          {label}
        </p>
        <p className="mt-1 text-sm font-medium text-fg">{value}</p>
      </div>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className="surface-card flex items-center gap-4 rounded-xl p-5 transition-[border-color] duration-150 hover:border-border-strong no-underline"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="surface-card flex items-center gap-4 rounded-xl p-5">
      {content}
    </div>
  );
}
