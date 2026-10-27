import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Hero } from "@/components/home/hero";
import { SubjectsSection } from "@/components/home/subjects-section";
import { TypesSection } from "@/components/home/types-section";
import { TrimestersSection } from "@/components/home/trimesters-section";
import { VideosSection } from "@/components/home/videos-section";
import { LatestSection } from "@/components/home/latest-section";
import { HowSection } from "@/components/home/how-section";
import { CtaSection } from "@/components/home/cta-section";
import {
  EMPTY_META,
  getFeaturedVideos,
  getLatest,
  getMeta,
} from "@/lib/queries";
import type { ResourceDTO } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function Home() {
  const meta = await getMeta().catch(() => EMPTY_META);
  const latest = await getLatest(6).catch(() => [] as ResourceDTO[]);
  const videos = await getFeaturedVideos(8).catch(() => [] as ResourceDTO[]);

  return (
    <main className="relative overflow-x-clip">
      <Navbar />
      <Hero meta={meta} />
      <SubjectsSection meta={meta} />
      <TypesSection meta={meta} />
      <TrimestersSection />
      <VideosSection videos={videos} />
      <LatestSection resources={latest} />
      <HowSection />
      <CtaSection />
      <Footer />
    </main>
  );
}
