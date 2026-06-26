"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useGSAP } from "@gsap/react";
import { ArrowRight, Code2, ExternalLink, Mail, Rocket } from "lucide-react";
import { GitHubIcon, LinkedInIcon, TwitterIcon } from "@/components/icons/SocialIcons";
import { gsap, prefersReducedMotion, registerGsapPlugins } from "@/lib/animations/gsap-config";
import type { HeroBadge, HeroBadgePosition, Profile } from "@/types/portfolio";

const BADGE_POSITION_CLASSES: Record<HeroBadgePosition, string> = {
  "top-left": "-left-4 top-8 max-w-[180px] sm:-left-8",
  "top-right": "-right-4 top-8 max-w-[180px] sm:-right-8",
  "middle-left": "-left-2 top-1/3 max-w-[200px] sm:-left-6",
  "middle-right": "-right-2 top-1/3 max-w-[200px] sm:-right-6",
  "bottom-left": "-bottom-2 left-4 max-w-[220px] sm:left-8",
  "bottom-right": "-bottom-2 right-4 max-w-[220px] sm:right-8",
};

const DEFAULT_BADGE_POSITIONS: HeroBadgePosition[] = [
  "top-left",
  "middle-right",
  "bottom-left",
];

function BadgeIcon({ icon }: { icon?: HeroBadge["icon"] }) {
  if (icon === "rocket") return <Rocket className="h-4 w-4 text-indigo-600" />;
  if (icon === "code") return <Code2 className="h-4 w-4 text-indigo-600" />;
  return null;
}

function badgePositionClass(badge: HeroBadge, index: number) {
  const position = badge.position ?? DEFAULT_BADGE_POSITIONS[index % DEFAULT_BADGE_POSITIONS.length];
  return BADGE_POSITION_CLASSES[position];
}

export default function Hero({ profile }: { profile: Profile }) {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const highlight = profile.positionHighlight;
  const rest = profile.position.replace(highlight, "").trim();

  useGSAP(
    () => {
      registerGsapPlugins();
      const section = sectionRef.current;
      const imageWrap = imageWrapRef.current;
      if (!section || prefersReducedMotion()) return;

      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.from(".hero-greeting", { y: 24, opacity: 0, duration: 0.7 })
        .from(
          ".hero-name",
          { clipPath: "inset(100% 0 0 0)", opacity: 0, duration: 1.1 },
          "-=0.35",
        )
        .from(
          ".hero-position",
          { clipPath: "inset(100% 0 0 0)", opacity: 0, duration: 0.95 },
          "-=0.65",
        )
        .from(".hero-headline", { y: 32, opacity: 0, duration: 0.85 }, "-=0.55")
        .from(".hero-actions", { y: 24, opacity: 0, duration: 0.75 }, "-=0.45")
        .from(".hero-social", { y: 16, opacity: 0, duration: 0.6 }, "-=0.4")
        .from(
          ".hero-image",
          { scale: 1.08, opacity: 0, duration: 1.2, ease: "power3.out" },
          "-=1",
        )
        .from(
          ".hero-badge",
          { y: 20, opacity: 0, scale: 0.92, duration: 0.65, stagger: 0.12 },
          "-=0.7",
        );

      if (imageWrap) {
        gsap.fromTo(
          imageWrap,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top bottom",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      }
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      id="home"
      className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24"
    >
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div>
          <p className="hero-greeting mb-2 text-sm font-semibold text-indigo-600">{profile.greeting}</p>
          <h1 className="hero-name text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            {profile.name}
          </h1>
          <h2 className="hero-position mt-3 text-3xl font-bold sm:text-4xl">
            <span className="text-indigo-600">{highlight}</span>{" "}
            <span className="text-slate-900">{rest}</span>
          </h2>
          <p className="hero-headline mt-6 max-w-lg text-lg leading-relaxed text-slate-600">
            {profile.headline}
          </p>

          <div className="hero-actions mt-8 flex flex-wrap gap-4">
            <Link
              href="#projects"
              className="magnetic-btn inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-700"
            >
              View My Works
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="#contact"
              className="magnetic-btn inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition hover:border-slate-300"
            >
              <Mail className="h-4 w-4" />
              Get In Touch
            </Link>
          </div>

          <div className="hero-social mt-8 flex items-center gap-4">
            <a href={profile.social.github} target="_blank" rel="noopener noreferrer" className="text-slate-500 transition hover:text-indigo-600">
              <GitHubIcon className="h-5 w-5" />
            </a>
            <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-slate-500 transition hover:text-indigo-600">
              <LinkedInIcon className="h-5 w-5" />
            </a>
            <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer" className="text-slate-500 transition hover:text-indigo-600">
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a href={profile.social.email} className="text-slate-500 transition hover:text-indigo-600">
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>

        <div className="relative mx-auto w-full  max-w-md lg:max-w-none">
          <div
            ref={imageWrapRef}
            className="hero-image relative aspect-[4/5] overflow-hidden rounded-full bg-gradient-to-br from-indigo-100 to-slate-100"
          >
            <Image
              src={profile.profileImage}
              alt={profile.name}
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>

          {profile.heroBadges.map((badge, i) => (
            <div
              key={`${badge.text}-${i}`}
              className={`hero-badge absolute flex items-center gap-2 rounded-xl border border-slate-100 bg-white px-4 py-3 text-xs font-medium text-slate-700 shadow-lg sm:text-sm ${badgePositionClass(badge, i)}`}
            >
              <BadgeIcon icon={badge.icon} />
              {badge.text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
