import { ScrambleAnchor } from "@/components/scramble-anchor";

export function Contact() {
  return (
    <section
      id="contato"
      className="relative overflow-hidden bg-fundo px-4 py-24 text-linha md:px-10 md:py-32"
    >
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-16 font-display text-[clamp(2.5rem,8vw,5.5rem)] font-black uppercase leading-[0.9] tracking-[-0.03em] md:mb-20">
          contato
        </h2>

        <div className="space-y-12 md:space-y-16">
          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-poeira md:text-sm">
              email
            </p>
            <ScrambleAnchor
              href="mailto:ola@beviq.com.br"
              text="ola@beviq.com.br"
              className="block font-display text-[clamp(2rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-fosforo transition-opacity hover:opacity-80"
            />
          </div>

          <div>
            <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-poeira md:text-sm">
              whatsapp
            </p>
            <ScrambleAnchor
              href="https://wa.me/5561992790309"
              text="+55 61 99279 0309"
              target="_blank"
              rel="noopener noreferrer"
              className="block font-display text-[clamp(2rem,7vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.03em] text-fosforo transition-opacity hover:opacity-80"
            />
          </div>
        </div>

        <footer className="mt-32 font-mono text-xs uppercase tracking-[0.2em] text-poeira md:mt-40 md:text-sm">
          brasília · © 2026
        </footer>
      </div>
    </section>
  );
}
