import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface Project {
  id: string
  title: string
  tags: string[]
  description: string
}

const PROJECT_IMAGES: Record<string, string> = {
  'jungle-gather': '/images/jungle-gather-1.png',
  'sportech': '/images/sportech-1.png',
}

export default function ProjectCard({ project, index }: { project: Project; index: number }) {
  const [expanded, setExpanded] = useState(false)
  const img = PROJECT_IMAGES[project.id]

  return (
    <div className="flex-shrink-0 w-[340px] sm:w-[420px] border border-white/[0.08] rounded-2xl overflow-hidden bg-white/[0.02] backdrop-blur-sm hover:border-primary/30 transition-all duration-300 group">
      {/* Image / placeholder */}
      <div className="h-52 bg-gradient-to-br from-primary/10 to-accent/5 relative overflow-hidden">
        {img ? (
          <img
            src={img}
            alt={project.title}
            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="font-display text-5xl font-bold text-white/10">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        )}
        <div className="absolute top-4 left-4">
          <span className="font-display text-xs text-muted border border-white/10 rounded-full px-3 py-1 bg-bg/60 backdrop-blur-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="font-display font-bold text-xl text-white mb-3">{project.title}</h3>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs font-body px-2.5 py-1 rounded-full bg-primary/15 text-primary border border-primary/20"
            >
              {tag}
            </span>
          ))}
        </div>

        <p className={`font-body text-muted text-sm leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
          {project.description}
        </p>

        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex items-center gap-1 text-xs text-accent hover:text-white transition-colors"
        >
          {expanded ? (
            <><ChevronUp size={14} /> Voir moins</>
          ) : (
            <><ChevronDown size={14} /> Voir plus</>
          )}
        </button>
      </div>
    </div>
  )
}
