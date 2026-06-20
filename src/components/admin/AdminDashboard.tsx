"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Briefcase,
  Cpu,
  ExternalLink,
  Layers,
  LogOut,
  Plus,
  Save,
  Trash2,
  User,
} from "lucide-react";
import { defaultTechnologyIcon } from "@/lib/technologies";
import type { Experience, HeroBadge, HeroBadgePosition, PortfolioData, Project, Skill, Technology } from "@/types/portfolio";

type Tab = "profile" | "projects" | "technologies" | "skills" | "experience";

const emptyProject: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: "/images/projects/placeholder.svg",
  tags: [],
  demoUrl: "",
  githubUrl: "",
};

const emptySkill: Omit<Skill, "id"> = {
  category: "",
  items: [],
};

const emptyExperience: Omit<Experience, "id"> = {
  period: "",
  title: "",
  description: "",
};

const emptyTechnology: Omit<Technology, "id"> = {
  name: "",
  icon: "/images/tech/default.svg",
};

export default function AdminDashboard() {
  const [data, setData] = useState<PortfolioData | null>(null);
  const [tab, setTab] = useState<Tab>("profile");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const loadData = useCallback(async () => {
    const res = await fetch("/api/admin/portfolio");
    if (res.status === 401) {
      router.push("/admin");
      return;
    }
    const json = await res.json();
    setData(json);
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin");
    router.refresh();
  }

  async function saveProfile() {
    if (!data) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/admin/portfolio", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setSaving(false);
    setMessage(res.ok ? "Profile saved!" : "Failed to save");
  }

  async function uploadFile(file: File, folder: string, onUrl: (url: string) => void) {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    if (res.ok) {
      const { url } = await res.json();
      onUrl(url);
    }
  }

  async function saveProject(project: Project, isNew: boolean) {
    setSaving(true);
    const res = await fetch("/api/admin/projects", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(project),
    });
    setSaving(false);
    if (res.ok) {
      setMessage(isNew ? "Project created!" : "Project updated!");
      await loadData();
    }
  }

  async function deleteProject(id: string) {
    if (!confirm("Delete this project?")) return;
    await fetch("/api/admin/projects", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadData();
  }

  async function saveSkill(skill: Skill, isNew: boolean) {
    setSaving(true);
    const res = await fetch("/api/admin/skills", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(skill),
    });
    setSaving(false);
    if (res.ok) {
      setMessage(isNew ? "Skill created!" : "Skill updated!");
      await loadData();
    }
  }

  async function deleteSkill(id: string) {
    if (!confirm("Delete this skill category?")) return;
    await fetch("/api/admin/skills", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadData();
  }

  async function saveExperience(exp: Experience, isNew: boolean) {
    setSaving(true);
    const res = await fetch("/api/admin/experience", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(exp),
    });
    setSaving(false);
    if (res.ok) {
      setMessage(isNew ? "Experience created!" : "Experience updated!");
      await loadData();
    }
  }

  async function deleteExperience(id: string) {
    if (!confirm("Delete this experience entry?")) return;
    await fetch("/api/admin/experience", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadData();
  }

  async function saveTechnology(technology: Technology, isNew: boolean) {
    setSaving(true);
    const res = await fetch("/api/admin/technologies", {
      method: isNew ? "POST" : "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(technology),
    });
    setSaving(false);
    if (res.ok) {
      setMessage(isNew ? "Technology added!" : "Technology updated!");
      await loadData();
    }
  }

  async function deleteTechnology(id: string) {
    if (!confirm("Delete this technology?")) return;
    await fetch("/api/admin/technologies", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    await loadData();
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const tabs: { id: Tab; label: string; icon: typeof User }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "projects", label: "Projects", icon: Layers },
    { id: "technologies", label: "Technologies", icon: Cpu },
    { id: "skills", label: "Skills", icon: Briefcase },
    { id: "experience", label: "Experience", icon: Briefcase },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">Portfolio Admin</h1>
            <p className="text-sm text-slate-500">Manage your site content</p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="inline-flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700"
            >
              View Site
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <div className="mb-6 flex flex-wrap gap-2">
          {tabs.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => {
                setTab(id);
                setMessage("");
              }}
              className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${tab === id
                ? "bg-indigo-600 text-white"
                : "bg-white text-slate-600 ring-1 ring-slate-200 hover:bg-slate-50"
                }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>

        {message && (
          <div className="mb-4 rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">{message}</div>
        )}

        {tab === "profile" && (
          <ProfileEditor
            data={data}
            setData={setData}
            onSave={saveProfile}
            onUpload={uploadFile}
            saving={saving}
          />
        )}

        {tab === "projects" && (
          <ProjectsEditor
            projects={data.projects}
            onSave={saveProject}
            onDelete={deleteProject}
            onUpload={uploadFile}
            saving={saving}
          />
        )}

        {tab === "technologies" && (
          <TechnologiesEditor
            technologies={data.technologies}
            onSave={saveTechnology}
            onDelete={deleteTechnology}
            onUpload={uploadFile}
            saving={saving}
          />
        )}

        {tab === "skills" && (
          <SkillsEditor
            skills={data.skills}
            onSave={saveSkill}
            onDelete={deleteSkill}
            saving={saving}
          />
        )}

        {tab === "experience" && (
          <ExperienceEditor
            experience={data.experience}
            onSave={saveExperience}
            onDelete={deleteExperience}
            saving={saving}
          />
        )}
      </div>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">{label}</label>
      {children}
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100";

const HERO_BADGE_POSITIONS: { value: HeroBadgePosition; label: string }[] = [
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "middle-left", label: "Middle Left" },
  { value: "middle-right", label: "Middle Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

const emptyHeroBadge: HeroBadge = {
  text: "",
  icon: "none",
  position: "top-left",
};

function ProfileEditor({
  data,
  setData,
  onSave,
  onUpload,
  saving,
}: {
  data: PortfolioData;
  setData: (d: PortfolioData) => void;
  onSave: () => void;
  onUpload: (file: File, folder: string, onUrl: (url: string) => void) => void;
  saving: boolean;
}) {
  const p = data.profile;

  function updateProfile(field: keyof typeof p, value: string) {
    setData({ ...data, profile: { ...p, [field]: value } });
  }

  function updateSocial(field: keyof typeof p.social, value: string) {
    setData({ ...data, profile: { ...p, social: { ...p.social, [field]: value } } });
  }

  function updateHeroBadges(badges: HeroBadge[]) {
    setData({ ...data, profile: { ...p, heroBadges: badges } });
  }

  function updateHeroBadge(index: number, field: keyof HeroBadge, value: string) {
    const badges = p.heroBadges.map((badge, i) =>
      i === index ? { ...badge, [field]: value } : badge,
    );
    updateHeroBadges(badges);
  }

  function addHeroBadge() {
    updateHeroBadges([...p.heroBadges, { ...emptyHeroBadge }]);
  }

  function removeHeroBadge(index: number) {
    updateHeroBadges(p.heroBadges.filter((_, i) => i !== index));
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6">
      <h2 className="mb-6 text-lg font-bold text-slate-900">Profile Settings</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input className={inputClass} value={p.name} onChange={(e) => updateProfile("name", e.target.value)} />
        </Field>
        <Field label="Position">
          <input className={inputClass} value={p.position} onChange={(e) => updateProfile("position", e.target.value)} />
        </Field>
        <Field label="Position Highlight (colored part)">
          <input
            className={inputClass}
            value={p.positionHighlight}
            onChange={(e) => updateProfile("positionHighlight", e.target.value)}
          />
        </Field>
        <Field label="Greeting">
          <input className={inputClass} value={p.greeting} onChange={(e) => updateProfile("greeting", e.target.value)} />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Headline">
            <textarea
              className={inputClass}
              rows={3}
              value={p.headline}
              onChange={(e) => updateProfile("headline", e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="About Me Header">
            <input
              className={inputClass}
              value={p.aboutMeHeader}
              onChange={(e) => updateProfile("aboutMeHeader", e.target.value)}
            />
          </Field>
        </div>
        <div className="sm:col-span-2">
          <Field label="About Me Content (separate paragraphs with blank line)">
            <textarea
              className={inputClass}
              rows={6}
              value={p.aboutMeContent}
              onChange={(e) => updateProfile("aboutMeContent", e.target.value)}
            />
          </Field>
        </div>
        <Field label="CV File URL">
          <input className={inputClass} value={p.cvFileUrl} onChange={(e) => updateProfile("cvFileUrl", e.target.value)} />
        </Field>
        <Field label="Upload CV">
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            className="text-sm bg-gray-400 p-3 rounded-md hover:bg-gray-500 cursor-pointer transition-colors duration-200"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file, "cv", (url) => updateProfile("cvFileUrl", url));
            }}
          />
        </Field>
        <Field label="Profile Image URL">
          <input
            className={inputClass}
            value={p.profileImage}
            onChange={(e) => updateProfile("profileImage", e.target.value)}
          />
        </Field>
        <Field label="Upload Profile Image">
          <input
            type="file"
            accept="image/*"
            className="text-sm bg-gray-400 p-3 rounded-md hover:bg-gray-500 cursor-pointer transition-colors duration-200" onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUpload(file, "images", (url) => updateProfile("profileImage", url));
            }}
          />
        </Field>
        <Field label="GitHub URL">
          <input className={inputClass} value={p.social.github} onChange={(e) => updateSocial("github", e.target.value)} />
        </Field>
        <Field label="LinkedIn URL">
          <input className={inputClass} value={p.social.linkedin} onChange={(e) => updateSocial("linkedin", e.target.value)} />
        </Field>
        <Field label="Twitter URL">
          <input className={inputClass} value={p.social.twitter} onChange={(e) => updateSocial("twitter", e.target.value)} />
        </Field>
        <Field label="Email (mailto:...)">
          <input className={inputClass} value={p.social.email} onChange={(e) => updateSocial("email", e.target.value)} />
        </Field>
      </div>

      <div className="mt-8 border-t border-slate-200 pt-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-slate-900">Hero Image Badges</h3>
            <p className="text-sm text-slate-500">Floating cards overlaid on your profile photo</p>
          </div>
          <button
            type="button"
            onClick={addHeroBadge}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium text-slate-600 hover:bg-slate-50"
          >
            <Plus className="h-4 w-4" />
            Add Badge
          </button>
        </div>

        <div className="space-y-4">
          {p.heroBadges.map((badge, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-700">Badge {index + 1}</p>
                <button
                  type="button"
                  onClick={() => removeHeroBadge(index)}
                  className="rounded-lg border border-red-200 p-1.5 text-red-600 hover:bg-red-50"
                  aria-label={`Remove badge ${index + 1}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                <Field label="Text">
                  <input
                    className={inputClass}
                    value={badge.text}
                    onChange={(e) => updateHeroBadge(index, "text", e.target.value)}
                  />
                </Field>
                <Field label="Icon">
                  <select
                    className={inputClass}
                    value={badge.icon ?? "none"}
                    onChange={(e) => updateHeroBadge(index, "icon", e.target.value)}
                  >
                    <option value="none">None</option>
                    <option value="rocket">Rocket</option>
                    <option value="code">Code</option>
                  </select>
                </Field>
                <Field label="Position">
                  <select
                    className={inputClass}
                    value={badge.position ?? HERO_BADGE_POSITIONS[index % HERO_BADGE_POSITIONS.length].value}
                    onChange={(e) => updateHeroBadge(index, "position", e.target.value)}
                  >
                    {HERO_BADGE_POSITIONS.map(({ value, label }) => (
                      <option key={value} value={value}>
                        {label}
                      </option>
                    ))}
                  </select>
                </Field>
              </div>
            </div>
          ))}

          {p.heroBadges.length === 0 && (
            <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-500">
              No badges yet. Add one to show floating cards on your hero image.
            </p>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={onSave}
        disabled={saving}
        className="mt-6 inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
      >
        <Save className="h-4 w-4" />
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}

function ProjectsEditor({
  projects,
  onSave,
  onDelete,
  onUpload,
  saving,
}: {
  projects: Project[];
  onSave: (p: Project, isNew: boolean) => void;
  onDelete: (id: string) => void;
  onUpload: (file: File, folder: string, onUrl: (url: string) => void) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState<Project | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyProject);
  const isNew = !editing?.id || !projects.find((p) => p.id === editing.id);

  function startNew() {
    setEditing({ ...emptyProject, id: "" });
    setForm(emptyProject);
  }

  function startEdit(project: Project) {
    setEditing(project);
    setForm({ ...project });
  }

  function handleSave() {
    const project: Project = {
      ...form,
      id: editing?.id || "",
      tags: form.tags.length ? form.tags : [],
    };
    onSave(project, isNew);
    setEditing(null);
    setForm(emptyProject);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Projects</h2>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Project
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-900">{isNew ? "New Project" : "Edit Project"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <Field label="Title">
                <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
              </Field>
            </div>
            <div className="sm:col-span-2">
              <Field label="Description">
                <textarea
                  className={inputClass}
                  rows={3}
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </Field>
            </div>
            <Field label="Image URL">
              <input className={inputClass} value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
            </Field>
            <Field label="Upload Image">
              <input
                type="file"
                accept="image/*"
                className="text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file, "images/projects", (url) => setForm({ ...form, image: url }));
                }}
              />
            </Field>
            <Field label="Tags (comma-separated)">
              <input
                className={inputClass}
                value={form.tags.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="Demo URL">
              <input className={inputClass} value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} />
            </Field>
            <Field label="GitHub URL">
              <input className={inputClass} value={form.githubUrl} onChange={(e) => setForm({ ...form, githubUrl: e.target.value })} />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-semibold text-slate-900">{project.title}</p>
              <p className="text-sm text-slate-500 line-clamp-1">{project.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(project)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(project.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SkillsEditor({
  skills,
  onSave,
  onDelete,
  saving,
}: {
  skills: Skill[];
  onSave: (s: Skill, isNew: boolean) => void;
  onDelete: (id: string) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState<Skill | null>(null);
  const [form, setForm] = useState<Omit<Skill, "id">>(emptySkill);
  const isNew = !editing?.id || !skills.find((s) => s.id === editing.id);

  function startNew() {
    setEditing({ ...emptySkill, id: "" });
    setForm(emptySkill);
  }

  function startEdit(skill: Skill) {
    setEditing(skill);
    setForm({ category: skill.category, items: [...skill.items] });
  }

  function handleSave() {
    const skill: Skill = {
      ...form,
      id: editing?.id || "",
      items: form.items.length ? form.items : [],
    };
    onSave(skill, isNew);
    setEditing(null);
    setForm(emptySkill);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Skills</h2>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Category
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-900">{isNew ? "New Skill Category" : "Edit Skill Category"}</h3>
          <div className="grid gap-4">
            <Field label="Category Name">
              <input
                className={inputClass}
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </Field>
            <Field label="Skills (comma-separated)">
              <input
                className={inputClass}
                value={form.items.join(", ")}
                onChange={(e) =>
                  setForm({
                    ...form,
                    items: e.target.value.split(",").map((t) => t.trim()).filter(Boolean),
                  })
                }
              />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {skills.map((skill) => (
          <div
            key={skill.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="font-semibold text-slate-900">{skill.category}</p>
              <p className="text-sm text-slate-500">{skill.items.join(", ")}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(skill)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(skill.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ExperienceEditor({
  experience,
  onSave,
  onDelete,
  saving,
}: {
  experience: Experience[];
  onSave: (e: Experience, isNew: boolean) => void;
  onDelete: (id: string) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState<Experience | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(emptyExperience);
  const isNew = !editing?.id || !experience.find((e) => e.id === editing.id);

  function startNew() {
    setEditing({ ...emptyExperience, id: "" });
    setForm(emptyExperience);
  }

  function startEdit(exp: Experience) {
    setEditing(exp);
    setForm({ period: exp.period, title: exp.title, description: exp.description });
  }

  function handleSave() {
    const exp: Experience = {
      ...form,
      id: editing?.id || "",
    };
    onSave(exp, isNew);
    setEditing(null);
    setForm(emptyExperience);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Experience</h2>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Experience
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-900">{isNew ? "New Experience" : "Edit Experience"}</h3>
          <div className="grid gap-4">
            <Field label="Period (e.g. 2023 - Present)">
              <input className={inputClass} value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} />
            </Field>
            <Field label="Title">
              <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
            </Field>
            <Field label="Description">
              <textarea
                className={inputClass}
                rows={3}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setEditing(null)} className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600">
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {experience.map((exp) => (
          <div
            key={exp.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div>
              <p className="text-xs font-semibold text-indigo-600">{exp.period}</p>
              <p className="font-semibold text-slate-900">{exp.title}</p>
              <p className="text-sm text-slate-500 line-clamp-1">{exp.description}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(exp)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(exp.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TechnologiesEditor({
  technologies,
  onSave,
  onDelete,
  onUpload,
  saving,
}: {
  technologies: Technology[];
  onSave: (technology: Technology, isNew: boolean) => void;
  onDelete: (id: string) => void;
  onUpload: (file: File, folder: string, onUrl: (url: string) => void) => void;
  saving: boolean;
}) {
  const [editing, setEditing] = useState<Technology | null>(null);
  const [form, setForm] = useState<Omit<Technology, "id">>(emptyTechnology);
  const isNew = !editing?.id || !technologies.find((item) => item.id === editing.id);

  function startNew() {
    setEditing({ ...emptyTechnology, id: "" });
    setForm(emptyTechnology);
  }

  function startEdit(technology: Technology) {
    setEditing(technology);
    setForm({ name: technology.name, icon: technology.icon });
  }

  function handleSave() {
    const technology: Technology = {
      ...form,
      id: editing?.id || "",
      icon: form.icon || defaultTechnologyIcon(form.name),
    };
    onSave(technology, isNew);
    setEditing(null);
    setForm(emptyTechnology);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-900">Technologies</h2>
        <button
          type="button"
          onClick={startNew}
          className="inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4" />
          Add Technology
        </button>
      </div>

      {editing && (
        <div className="rounded-2xl border border-indigo-200 bg-white p-6">
          <h3 className="mb-4 font-semibold text-slate-900">
            {isNew ? "New Technology" : "Edit Technology"}
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    icon: form.icon === emptyTechnology.icon ? defaultTechnologyIcon(e.target.value) : form.icon,
                  })
                }
              />
            </Field>
            <Field label="Icon URL">
              <input
                className={inputClass}
                value={form.icon}
                onChange={(e) => setForm({ ...form, icon: e.target.value })}
              />
            </Field>
            <Field label="Upload Icon">
              <input
                type="file"
                accept="image/*,.svg"
                className="text-sm"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUpload(file, "images/tech", (url) => setForm({ ...form, icon: url }));
                }}
              />
            </Field>
            <Field label="Preview">
              <div className="flex h-12 items-center gap-3 rounded-lg border border-slate-200 px-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={form.icon || defaultTechnologyIcon(form.name)}
                  alt=""
                  className="h-6 w-6 object-contain"
                />
                <span className="text-sm text-slate-600">{form.name || "Technology name"}</span>
              </div>
            </Field>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save"}
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {technologies.map((technology) => (
          <div
            key={technology.id}
            className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={technology.icon || defaultTechnologyIcon(technology.name)}
                alt=""
                className="h-8 w-8 object-contain"
              />
              <p className="font-semibold text-slate-900">{technology.name}</p>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => startEdit(technology)}
                className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50"
              >
                Edit
              </button>
              <button
                type="button"
                onClick={() => onDelete(technology.id)}
                className="rounded-lg border border-red-200 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
