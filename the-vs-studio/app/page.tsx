import { AppShell } from "@/components/AppShell";
import { SynapseHero } from "@/components/synapse/SynapseHero";

export default function HomePage() {
    return (
      <AppShell title="Home">
         <main className="mx-auto flex min-h-[calc(100vh-5rem)] max-w-7xl px-6 py-6 md:px-10">
           <SynapseHero />
         </main>
      </AppShell>
    );
}
