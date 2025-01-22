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

// Fonction pour vérifier si une nouvelle position chevauche les positions existantes
const isOverlapping = (
  newPos: { top: number; left: number },
  existingPositions: { top: number; left: number }[]
) => {
  const margin = 25 // Augmenté de 15 à 25 pour plus d'espace entre les citations
  return existingPositions.some(pos => {
    const xOverlap = Math.abs(newPos.left - pos.left) < margin
    const yOverlap = Math.abs(newPos.top - pos.top) < margin
    return xOverlap && yOverlap
  })
}

// Fonction pour générer une position aléatoire qui évite la zone centrale et les chevauchements
const generateSafePosition = (existingPositions: { top: number; left: number }[]) => {
  const centerZone = { minX: 35, maxX: 65, minY: 35, maxY: 65 } // Zone à éviter (centre)
  let left, top
  let attempts = 0
  const maxAttempts = 100 // Éviter une boucle infinie

  do {
    left = Math.random() * 70 + 15 // Réduit de 80+10 à 70+15 pour éviter les bords
    top = Math.random() * 70 + 15  // Réduit de 80+10 à 70+15 pour éviter les bords
    attempts++
  } while (
    (left > centerZone.minX && 
    left < centerZone.maxX && 
    top > centerZone.minY && 
    top < centerZone.maxY ||
    isOverlapping({ top, left }, existingPositions)) &&
    attempts < maxAttempts
  )

  return { top, left }
}

export function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [randomQuotes, setRandomQuotes] = useState<{ text: string; top: number; left: number }[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Sélectionner 3 citations aléatoires au lieu de 5
    const selectedQuotes: { text: string; top: number; left: number }[] = []
    
    for (let i = 0; i < 3; i++) { // Changé de 5 à 3
      const position = generateSafePosition(selectedQuotes)
      selectedQuotes.push({
        text: quotes[Math.floor(Math.random() * quotes.length)],
        ...position
      })
    }
    
    setRandomQuotes(selectedQuotes)

    // Animation de la barre de progression
    const duration = 3500 // 3.5 secondes au total
    const interval = 50 // Mise à jour toutes les 50ms
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

    return () => clearInterval(progressInterval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#e8e8e0] dark:bg-[#1a2639] transition-opacity duration-500">
      <div className="relative w-full h-full">
        {/* Citations aléatoires */}
        {randomQuotes.map((quote, index) => (
          <div
            key={index}
            className="absolute text-sm md:text-base opacity-0 animate-fadeIn italic"
            style={{
              top: `${quote.top}%`,
              left: `${quote.left}%`,
              maxWidth: '300px',
              transform: 'translate(-50%, -50%)',
              animationDelay: `${index * 0.4}s`
            }}
          >
            "{quote.text}"
          </div>
        ))}
        
        {/* Logo animé avec barre de progression */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            {/* Barre de progression circulaire */}
            <svg className="w-32 h-32 -rotate-90 transform">
              <circle
                className="text-black/10"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                r="58"
                cx="64"
                cy="64"
              />
              <circle
                className="text-black transition-all duration-300"
                strokeWidth="2"
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
            
            {/* Logo */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-float">
              <Cloud className="w-24 h-24 text-[#1a2639]" />
              <Brain 
                className="w-12 h-12 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-black"
                style={{
                  opacity: progress / 100
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 