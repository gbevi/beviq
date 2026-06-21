import {
  ContactLink,
  MonoLabel,
  Section,
  SectionHeading,
} from "@/components/sections/primitives";

export function Contact() {
  return (
    <Section id="contato" py="md:py-32" className="relative overflow-hidden">
      <SectionHeading className="mb-16 md:mb-20">contato</SectionHeading>

      <div className="space-y-12 md:space-y-16">
        <div>
          <MonoLabel className="mb-3 md:text-sm">email</MonoLabel>
          <ContactLink href="mailto:ola@beviq.com.br" text="ola@beviq.com.br" />
        </div>

        <div>
          <MonoLabel className="mb-3 md:text-sm">whatsapp</MonoLabel>
          <ContactLink
            href="https://wa.me/5561992790309"
            text="+55 61 99279 0309"
            target="_blank"
            rel="noopener noreferrer"
          />
        </div>
      </div>

      <MonoLabel as="footer" className="mt-32 md:mt-40 md:text-sm">
        brasília · © 2026
      </MonoLabel>
    </Section>
  );
}
