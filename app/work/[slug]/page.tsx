export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import { projects, getProjectBySlug, getAdjacentProject } from '@/lib/projects'
import ProjectHero from '@/components/ProjectHero'
import ProjectContent from '@/components/ProjectContent'
import ProjectNav from '@/components/ProjectNav'

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }))
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project  = getProjectBySlug(slug)
  if (!project) notFound()

  const nextProject = getAdjacentProject(slug)

  return (
    <main style={{ background: 'revert', paddingBottom: '64px' }}>
      <ProjectHero project={project} />
      <ProjectContent project={project} />
      <ProjectNav currentProject={project} nextProject={nextProject} />
    </main>
  )
}
