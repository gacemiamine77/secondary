"use client";

import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { ResourceCard, resourceTitle, subjectName } from "@/components/resource-card";
import { VideoModal } from "@/components/video-modal";
import { PdfAnnotatorModal } from "@/components/pdf/pdf-annotator-modal";
import { useI18n } from "@/components/providers";
import type { ResourceDTO } from "@/lib/constants";

export function LatestSection({ resources }: { resources: ResourceDTO[] }) {
  const { t, locale } = useI18n();
  const [currentVideo, setCurrentVideo] = useState<ResourceDTO | null>(null);
  const [annotatingDoc, setAnnotatingDoc] = useState<ResourceDTO | null>(null);

  if (resources.length === 0) return null;

  return (
    <section className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          label={t("section.latest.label")}
          title={t("section.latest.title")}
          subtitle={t("section.latest.subtitle")}
          action={{ href: "/bibliotheque", label: t("common.explore") }}
        />

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {resources.map((resource, i) => (
            <Reveal key={resource.id} delay={(i % 3) * 0.07} className="h-full">
              <ResourceCard
                resource={resource}
                onWatch={setCurrentVideo}
                onAnnotate={setAnnotatingDoc}
              />
            </Reveal>
          ))}
        </div>
      </div>

      <VideoModal video={currentVideo} onClose={() => setCurrentVideo(null)} />

      {annotatingDoc && (
        <PdfAnnotatorModal
          isOpen={true}
          documentId={annotatingDoc.id}
          documentTitle={resourceTitle(annotatingDoc, locale)}
          documentSubject={subjectName(annotatingDoc, locale)}
          pdfUrl={annotatingDoc.fileUrl}
          onClose={() => setAnnotatingDoc(null)}
        />
      )}
    </section>
  );
}

