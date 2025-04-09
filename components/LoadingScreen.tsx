import { Cloud, Brain } from "lucide-react"
import { useState, useEffect } from "react"

const quotes = [
  'Les données sont le carburant du XXIe siècle, et l\'IA en est le moteur.',
  'Le sport, c\'est de l\'énergie en mouvement ; le business, c\'est de l\'énergie stratégique ; la data est ce qui les aligne.',
  'La seule limite de l\'IA est l\'imagination humaine.',
  'L\'IA ne remplacera pas les gens mais améliorera ceux qui savent l\'utiliser.',
  'Data is the new playbook; AI is the new coach.',
  'Un bon business utilise les données ; un business innovant les comprend.',
  'Quand l\'IA et le sport se rencontrent, chaque statistique devient une opportunité.',
  'Data is the new oil.',
  'Data is like garbage. You\'d better know what you are going to do with it before you collect it.',
  'In the world of business, the people who are most successful are those who are doing what they love.',
  'If we have data, let\'s look at data. If all we have are opinions, let\'s go with mine.',
  'Intelligence is the ability to adapt to change, and artificial intelligence is the ability to anticipate it.'
]

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [randomQuotes, setRandomQuotes] = useState<{ text: string; top: number; left: number }[]>([])
  const [progress, setProgress] = useState(0)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Sélectionner 3 citations aléatoires avec des positions
    const selectedQuotes = Array.from({ length: 3 }, () => ({
      text: quotes[Math.floor(Math.random() * quotes.length)],
      top: Math.random() * 70 + 15, // Entre 15% et 85%
      left: Math.random() * 70 + 15 // Entre 15% et 85%
    }))
    
    setRandomQuotes(selectedQuotes)
    
    // Afficher le contenu après un court délai
    const contentTimer = setTimeout(() => {
      setShowContent(true)
    }, 300)

    // Animation de la barre de progression
    const duration = 3500
    const interval = 50
    const steps = duration / interval
    let currentStep = 0

    const progressInterval = setInterval(() => {
      currentStep++
      setProgress((currentStep / steps) * 100)
      
      if (currentStep >= steps) {
        clearInterval(progressInterval)
        onComplete()
      }
    }, interval)

    return () => {
      clearInterval(progressInterval)
      clearTimeout(contentTimer)
    }
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-[#e8e8e0] to-[#d8d8d0] dark:from-[#1a2639] dark:to-[#0f172a] transition-all duration-700">
      <div className="relative w-full h-full overflow-hidden">
        {/* Citations aléatoires avec animation */}
        {showContent && randomQuotes.map((quote, index) => (
          <div
            key={index}
            className="absolute text-sm md:text-base opacity-0 animate-fadeIn italic"
            style={{
              top: `${quote.top}%`,
              left: `${quote.left}%`,
              maxWidth: '300px',
              transform: 'translate(-50%, -50%)',
              animationDelay: `${index * 0.4}s`,
              animationDuration: '1.2s'
            }}
          >
            &ldquo;{quote.text}&rdquo;
          </div>
        ))}
        
        {/* Logo animé avec barre de progression */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Cercles concentriques animés */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div 
                className="absolute w-40 h-40 rounded-full border-2 border-black/10 dark:border-white/10"
                style={{
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: '0s'
                }}
              />
              <div 
                className="absolute w-36 h-36 rounded-full border-2 border-black/10 dark:border-white/10"
                style={{
                  animation: 'pulse 2s ease-in-out infinite',
                  animationDelay: '0.3s'
                }}
              />
            </div>
            
            {/* Barre de progression circulaire */}
            <svg className="w-32 h-32 -rotate-90 transform">
              <circle
                className="text-black/10 dark:text-white/10"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-black dark:text-white transition-all duration-300 ease-out"
                strokeWidth="3"
                strokeDasharray={`${2 * Math.PI * 58}`}
                strokeDashoffset={`${2 * Math.PI * 58 * (1 - progress / 100)}`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                r="58"
                cx="64"
                cy="64"
              />
            </svg>
            
            {/* Logo avec animation */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
              <div className="relative animate-float" style={{ animationDuration: '3s' }}>
                <div className="relative">
                  {/* Nuages supplémentaires pour plus de détails */}
                  <Cloud className="w-8 h-8 absolute -top-2 -left-4 text-[#1a2639] dark:text-[#e8e8e0] opacity-50 transition-colors duration-700" />
                  <Cloud className="w-8 h-8 absolute -top-1 -right-3 text-[#1a2639] dark:text-[#e8e8e0] opacity-50 transition-colors duration-700" />
                  <Cloud className="w-8 h-8 absolute -bottom-2 -left-3 text-[#1a2639] dark:text-[#e8e8e0] opacity-50 transition-colors duration-700" />
                  {/* Nuage principal */}
                  <Cloud className="w-24 h-24 text-[#1a2639] dark:text-[#e8e8e0] transition-colors duration-700" />
                  {/* Cerveau centré */}
                  <Brain 
                    className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black dark:text-white transition-colors duration-700"
                    style={{
                      opacity: progress / 100,
                      transform: `translate(-50%, -50%) scale(${0.8 + (progress / 100) * 0.2})`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 