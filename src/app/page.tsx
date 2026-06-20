import { getPortfolioData } from "@/lib/data";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Technologies from "@/components/Technologies";
import Projects from "@/components/Projects";
import Stats from "@/components/Stats";
import AboutSkillsExperience from "@/components/AboutSkillsExperience";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const data = await getPortfolioData();

  return (
    <>
      <Header profile={data.profile} />
      <main>
        <Hero profile={data.profile} />
        <Technologies technologies={data.technologies} />
        <Projects projects={data.projects} />
        <Stats stats={data.stats} />
        <AboutSkillsExperience
          profile={data.profile}
          skills={data.skills}
          experience={data.experience}
        />
        <CTA profile={data.profile} />
      </main>
      <div className="flex items-center justify-center">
        <Footer name={data.profile.name} />
      </div>    </>
  );
}
