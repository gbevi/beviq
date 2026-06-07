import { Hero } from "@/components/sections/hero";
import { SelectedWork } from "@/components/sections/selected-work";
import { Capabilities } from "@/components/sections/capabilities";
import { Manifesto } from "@/components/sections/manifesto";
import { Contact } from "@/components/sections/contact";

export default function Page() {
  return (
    <>
      <Hero />
      <SelectedWork />
      <Capabilities />
      <Manifesto />
      <Contact />
    </>
  );
}
