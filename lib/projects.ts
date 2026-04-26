export interface Section {
  title: string
  body: string
}

export interface Project {
  slug: string
  number: string
  title: string
  category: string
  year: string
  description: string
  role: string
  tools: string[]
  heroColor: string
  sections: Section[]
  images?: string[]
}

export const projects: Project[] = [
  {
    slug: 'ibm-ai-automation',
    number: '01',
    title: 'IBM — AI & Automation',
    category: 'Product Management',
    year: '2025–Present',
    description:
      'Developing strategic solutions for storage management teams (GTH area) at IBM, helping reduce product launch cycles through automation and more efficient processes.',
    role: 'AI & Automation Product Manager',
    tools: ['Python', 'AI/ML', 'MCP Servers', 'Agile', 'Scrum'],
    heroColor: '#080808',
    images: ['ibm-network.svg', 'ibm-pipeline.svg', 'ibm-mcp.svg'],
    sections: [
      {
        title: 'The Challenge',
        body: 'Storage product teams at IBM faced long development cycle times that slowed product launches and cross-functional alignment.',
      },
      {
        title: 'What I Built',
        body: 'Identified and implemented automated workflows using Python and AI technologies, including MCP server development, resulting in significant reduction in internal work cycle times. Facilitated communication across engineering teams to integrate AI-driven solutions and supported multiple product launches.',
      },
      {
        title: 'Impact',
        body: 'Significant reduction in work cycle times. Streamlined deployment processes across diverse Storage teams. Ensured alignment with global quality standards in the GTH area.',
      },
    ],
  },
  {
    slug: 'freelance-web-dev',
    number: '02',
    title: 'Freelance Web Development',
    category: 'Web Development',
    year: '2023–Present',
    description:
      'Designed and developed custom responsive websites for clients in the restaurant industry, optimizing UX/UI for mobile devices.',
    role: 'Full-Stack Developer',
    tools: ['HTML', 'CSS', 'JavaScript', 'PHP', 'SEO', 'UX/UI'],
    heroColor: '#080808',
    images: ['freelance-browser.svg', 'freelance-seo.svg', 'freelance-devices.svg'],
    sections: [
      {
        title: 'The Work',
        body: 'Built custom responsive websites for restaurant industry clients, with focus on mobile UX/UI optimization.',
      },
      {
        title: 'Solutions',
        body: 'Implemented online ordering platforms and reservation systems, increasing digital customer conversion. Managed SEO strategies to improve search engine visibility and client brand positioning.',
      },
      {
        title: 'Stack',
        body: 'Full-stack development using HTML, CSS, JavaScript, and PHP. Integrated payment gateways and database connections for secure transactions and user data management.',
      },
    ],
  },
  {
    slug: 'software-engineering',
    number: '03',
    title: 'Software Engineering Projects',
    category: 'Academic & Engineering',
    year: '2023–Present',
    description:
      'Academic and collaborative software engineering projects at Universidad de Guadalajara (CUCEI), designing systems and deploying real-world applications.',
    role: 'Software Engineer',
    tools: ['Python', 'Git', 'Agile', 'System Architecture', 'Databases'],
    heroColor: '#080808',
    images: ['software-architecture.svg', 'software-uml.svg', 'software-gitflow.svg'],
    sections: [
      {
        title: 'Academic Work',
        body: 'Designed software architecture diagrams and documentation for system development lifecycles at Universidad de Guadalajara CUCEI.',
      },
      {
        title: 'Collaboration',
        body: 'Collaborated in agile teams to prototype and deploy applications solving real-world constraints.',
      },
      {
        title: 'Stack',
        body: 'Python, Git & GitHub, system architecture design, database management, agile/scrum methodologies.',
      },
    ],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug)
}

export function getAdjacentProject(slug: string): Project | null {
  const idx = projects.findIndex((p) => p.slug === slug)
  if (idx === -1) return null
  return projects[(idx + 1) % projects.length]
}
