import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard'

gsap.registerPlugin(ScrollTrigger)

interface Project {
  id: string
  title: string
  tags: string[]
  description: string
}

export default function Projects() {
  const { t } = useTranslation()
  const sectionRef = useRef<HTMLElement>(null)
  const flexRef = useRef<HTMLDivElement>(null)

  const projects = t('projects.items', { returnObjects: true }) as Project[]

  useGSAP(() => {
    if (!sectionRef.current || !flexRef.current) return

    const totalWidth = flexRef.current.scrollWidth
    const viewportWidth = sectionRef.current.getBoundingClientRect().width
    const translateX = totalWidth - viewportWidth + 64

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: `+=${translateX}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
      },
    })

    tl.to(flexRef.current, { x: -translateX, ease: 'none' })

    return () => {
      tl.kill()
      ScrollTrigger.getAll().forEach((st) => st.kill())
    }
  }, { scope: sectionRef, dependencies: [projects] })

  return (
    <section
      id="projects"
      ref={sectionRef}
      className="relative overflow-hidden"
      style={{ zIndex: 10 }}
    >
      <div className="max-w-7xl mx-auto px-8 pt-24 pb-8">
        <h2 className="font-display font-bold text-4xl text-white mb-2">
          {t('projects.title')}
        </h2>
        <div className="h-px w-24 bg-gradient-to-r from-primary to-accent mb-10" />
      </div>

      <div
        ref={flexRef}
        className="flex gap-6 px-8 pb-16"
        style={{ width: 'max-content' }}
      >
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={i} />
        ))}
      </div>
    </section>
  )
}
