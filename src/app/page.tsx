import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { About } from "@/components/sections/about";
import { Contact } from "@/components/sections/contact";

export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <About />
      <Contact />
    </>
  );
}
