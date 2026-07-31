import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs, services } from "./data";

export function Services() {
  return (
    <section id="services" className="section-pad">
      <div className="container-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
            Services
          </p>
          <h2 className="heading-section mt-3 text-3xl text-fg md:text-4xl text-balance">
            What we build with you
          </h2>
          <p className="mt-4 text-muted leading-relaxed">
            Modular engagements that stack—from a sharp prototype to a full
            production program.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="surface-card group rounded-xl p-6 transition-[border-color,background-color] duration-200 hover:border-border-strong"
              >
                <div className="mb-4 grid h-10 w-10 place-items-center rounded-lg border border-border bg-bg-subtle text-fg">
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <h3 className="text-lg font-medium tracking-tight text-fg">
                  {service.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {service.description}
                </p>
              </article>
            );
          })}
        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-accent">
              FAQ
            </p>
            <h3 className="heading-section mt-3 text-2xl text-fg md:text-3xl">
              Common questions
            </h3>
          </div>
          <div className="lg:col-span-8 surface-card rounded-xl px-5 md:px-6">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, i) => (
                <AccordionItem key={item.q} value={`faq-${i}`}>
                  <AccordionTrigger>{item.q}</AccordionTrigger>
                  <AccordionContent>{item.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </section>
  );
}
