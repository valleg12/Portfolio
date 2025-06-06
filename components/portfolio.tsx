"use client"

import { Moon, Sun, Calendar, Mail, Phone, Github, Linkedin, ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
} from "recharts"
import { LoadingScreen } from "./LoadingScreen"

// Supprimons le type non utilisé et gardons uniquement l'interface
interface TranslationLanguage {
  titles: Record<string, string>;
  competences: {
    title: string;
    items: string[];
  };
  services: {
    title: string;
    items: string[];
  };
  offwork: {
    title: string;
    items: string[];
  };
  education: {
    title: string;
    msc: {
      title: string;
      location: string;
    };
    master: {
      title: string;
      location: string;
    };
  };
  languages: {
    title: string;
    french: string;
    frenchLevel: string;
    english: string;
    englishLevel: string;
    spanish: string;
    spanishLevel: string;
  };
  projects: {
    title: string;
    wttj: {
      title: string;
      description: string;
      features: string;
      featuresList: string[];
      conclusion: string;
    };
    carrefour: {
      title: string;
      description: string;
      features: string;
      featuresList: string[];
      conclusion: string;
    };
    sportech: {
      title: string;
      description: string;
    };
    getStaty: {
      title: string;
      description: string;
      features: string;
      featuresList: string[];
      conclusion: string;
    };
    novarena: {
      title: string;
      description: string;
      features: string;
      featuresList: string[];
      conclusion: string;
    };
  };
  chat: {
    title: string;
    placeholder: string;
    send: string;
    autoReply: string;
  };
  skills: {
    fr: string[];
    en: string[];
  };
}

// Définir les traductions avec le type correct
const translations: Record<'fr' | 'en', TranslationLanguage> = {
  fr: {
    titles: {
      cv: "CV",
      competences: "compétences en IA et business",
      services: "services en IA pour le sport business",
      offwork: "off work",
      education: "formation",
      skills: "compétences",
      languages: "langues",
      projects: "projets"
    },
    competences: {
      title: "compétences en IA et business",
      items: [
        "Développement de modèles prédictifs",
        "Analyse de données et business intelligence",
        "Traitement du langage naturel (NLP) pour l'analyse de texte",
        "Optimisation des processus d'affaires via l'IA",
        "Création de tableaux de bord interactifs",
        "Gestion de projets IA",
        "Analyse de sentiment pour le marketing",
        "Développement d'algorithmes de recommandation",
        "Études de marché basées sur l'IA"
      ]
    },
    services: {
      title: "services en IA pour le sport business",
      items: [
        "Analyse de la performance des athlètes",
        "Optimisation de la gestion des événements sportifs",
        "Engagement des fans et marketing personnalisé",
        "Stratégies de billetterie et pricing dynamique",
        "Scouting et recrutement des talents avec l'IA",
        "Gestion des infrastructures sportives"
      ]
    },
    offwork: {
      title: "off work",
      items: [
        "Échecs",
        "Sports (Football, Skipper, Boxe Anglaise)",
        "Histoire",
        "Cinéma"
      ]
    },
    education: {
      title: "education",
      msc: {
        title: "MSc AI Applied to Business",
        location: "Eugenia School, Paris | 2024-2026"
      },
      master: {
        title: "Master Management Organisations Sportives",
        location: "AMOS, Lille | 2021-2023"
      }
    },
    languages: {
      title: "languages",
      french: "Français",
      frenchLevel: "Natif",
      english: "Anglais",
      englishLevel: "Bilingue",
      spanish: "Espagnol",
      spanishLevel: "Intermédiaire"
    },
    projects: {
      title: "projets",
      wttj: {
        title: "Jungle Gather",
        description: "Application web immersive inspirée de Gather, conçue pour favoriser la dynamique sociale et la gestion du planning dans une entreprise multi-sites. L'interface propose un univers pixel-art, un calendrier interactif, la gestion de la présence (remote/préso), des avatars animaux (mascottes) et des fonctionnalités d'export de listes.",
        features: "Fonctionnalités principales :",
        featuresList: [
          "Calendrier interactif avec vue semaine, mini-calendrier et création d'événements dynamiques",
          "Gestion de la présence avec sélection cyclique remote/préso/aucun",
          "Avatars mascottes représentant chaque utilisateur sur la carte",
          "Export CSV des listes de présence (remote/présentiel)",
          "Interface moderne et responsive inspirée de Notion/Linear/Slack"
        ],
        conclusion: "Cette solution innovante améliore la gestion des espaces de travail et la communication entre équipes dans un contexte multi-sites, tout en apportant une dimension ludique et sociale à l'expérience utilisateur."
      },
      carrefour: {
        title: "Système de Vérification des Marques Carrefour",
        description: "Développement d'un système sophistiqué de vérification de propriété des marques utilisant l'IA pour analyser et valider les relations entre les marques et leurs propriétaires. Ce projet a été réalisé dans le cadre du Geniathon Carrefour.",
        features: "Fonctionnalités principales :",
        featuresList: [
          "Vérification systématique des marques avec calcul de score de confiance",
          "Gestion intelligente des sources et validation des données",
          "Optimisation des performances avec traitement parallèle",
          "Analyse approfondie des relations entre marques",
          "Interface utilisateur informative et intuitive"
        ],
        conclusion: "Cette solution automatisée permet à Carrefour d'optimiser la gestion de ses marques et de réduire les risques liés à la propriété intellectuelle, tout en améliorant l'efficacité opérationnelle."
      },
      sportech: {
        title: "Sportech",
        description: "Sportech est une solution innovante intégrant l'intelligence artificielle pour optimiser la performance sportive, prévenir les blessures et faciliter le recrutement. En analysant et en contextualisant les données de joueurs, elle permet aux clubs de prévoir le potentiel des athlètes, de prendre des décisions éclairées pour la gestion d'équipe et d'optimiser les stratégies de transfert. Avec des tableaux de bord interactifs et des prédictions basées sur la data science, Sportech transforme la prise de décision dans les organisations sportives."
      },
      getStaty: {
        title: "GetStaty (en développement)",
        description: "Ce projet propose une solution dynamique d'analyse de matchs et de joueurs pour les championnats de football, avec une interface permettant à l'utilisateur de sélectionner un championnat et une journée de compétition. Grâce à l'intégration d'API sportives (ex. API-FOOTBALL, Football-Data.org), l'application récupère les matchs et génère des statistiques détaillées sur les performances des joueurs.",
        features: "Fonctionnalités clés :",
        featuresList: [
          "Accès aux matchs sélectionnés : Extraction des données de matchs pour la journée et le championnat choisis, y compris les équipes, horaires, etc.",
          "Analyse des performances des joueurs : Classement des joueurs en fonction de leurs statistiques récentes (notes, buts, passes décisives).",
          "Identification des Top Performers : Classement des cinq joueurs en forme et les meilleurs buteurs et passeurs de chaque équipe.",
          "Rendu des résultats : Présentation sous forme de tableau ou de message, offrant à l'utilisateur un résumé clair des performances."
        ],
        conclusion: "Cette solution apporte une vue d'ensemble rapide et pertinente des meilleurs joueurs et des performances attendues, idéale pour les passionnés, analystes ou parieurs sportifs."
      },
      novarena: {
        title: "Novarena (en développement)",
        description: "Novarena est une suite intégrée de gestion intelligente pour stades modernes, combinant tous les aspects opérationnels, business et expérience utilisateur dans une plateforme unifiée. Cette solution complète intègre des modules de performance & analytics, gestion des spectateurs, gestion des talents et business & sponsoring, le tout dans une architecture cloud-native multi-région.",
        features: "Modules clés :",
        featuresList: [
          "Performance & Analytics : Analyse en temps réel des matchs, métriques tactiques et physiques, tableaux de bord décisionnels, prédictions et insights",
          "Gestion des Spectateurs : Billeterie dynamique, expérience personnalisée, gestion des foules, optimisation des concessions",
          "Gestion des Talents : Suivi des joueurs (Smart Player Routing), scouting et recrutement, gestion des blessures, développement des jeunes",
          "Business & Sponsoring : Gestion des partenariats, ROI et analytics, activation des sponsors, gestion des médias"
        ],
        conclusion: "Cette plateforme vise à révolutionner la gestion des stades modernes en intégrant tous les aspects dans une solution unifiée, data-driven et évolutive, permettant une optimisation complète des opérations et de l'expérience utilisateur."
      }
    },
    chat: {
      title: "Chat",
      placeholder: "Écrivez votre message...",
      send: "Envoyer",
      autoReply: "Merci pour votre message. Je vous répondrai dans les plus brefs délais."
    },
    skills: {
      fr: [
        "Conception et déploiement de modèles d'IA prédictifs",
        "Analyse avancée de données et visualisation interactive",
        "Traitement du langage naturel et analyse de texte",
        "Automatisation intelligente des processus métier",
        "Création de solutions BI sur mesure",
        "Direction de projets d'IA et gestion agile",
        "Analyse comportementale et études de marché",
        "Systèmes de recommandation personnalisés",
        "Intelligence artificielle appliquée au marketing"
      ],
      en: [
        "Design and deployment of predictive AI models",
        "Advanced data analysis and interactive visualization",
        "Natural language processing and text analytics",
        "Intelligent business process automation",
        "Custom BI solution development",
        "AI project leadership and agile management",
        "Behavioral analysis and market research",
        "Personalized recommendation systems",
        "Marketing-focused artificial intelligence"
      ]
    }
  },
  en: {
    titles: {
      cv: "CV",
      competences: "AI and business skills",
      services: "AI services for sports business",
      offwork: "off work",
      education: "education",
      skills: "skills",
      languages: "languages",
      projects: "projects"
    },
    competences: {
      title: "AI and business skills",
      items: [
        "Predictive model development",
        "Data analysis and business intelligence",
        "Natural Language Processing (NLP)",
        "Business process optimization through AI",
        "Interactive dashboard creation",
        "AI project management",
        "Sentiment analysis for marketing",
        "Recommendation algorithm development",
        "AI-based market research"
      ]
    },
    services: {
      title: "AI services for sports business",
      items: [
        "Athlete performance analysis",
        "Sports event management optimization",
        "Fan engagement and personalized marketing",
        "Ticketing strategies and dynamic pricing",
        "Scouting and recruitment of talents with AI",
        "Sports infrastructure management"
      ]
    },
    offwork: {
      title: "off work",
      items: [
        "Chess",
        "Sports (Football, Sailing, Boxing)",
        "History",
        "Cinema"
      ]
    },
    education: {
      title: "education",
      msc: {
        title: "MSc AI Applied to Business",
        location: "Eugenia School, Paris | 2024-2026"
      },
      master: {
        title: "Master in Sports Organizations Management",
        location: "AMOS, Lille | 2021-2023"
      }
    },
    languages: {
      title: "languages",
      french: "French",
      frenchLevel: "Native",
      english: "English",
      englishLevel: "Bilingual",
      spanish: "Spanish",
      spanishLevel: "Intermediate"
    },
    projects: {
      title: "projects",
      wttj: {
        title: "Jungle Gather",
        description: "An immersive web application inspired by Gather, designed to enhance social dynamics and schedule management in a multi-site company. The interface features a pixel-art universe, interactive calendar, presence management (remote/onsite), animal avatars (mascots), and list export functionality.",
        features: "Key features:",
        featuresList: [
          "Interactive calendar with week view, mini-calendar, and dynamic event creation",
          "Presence management with cyclic selection of remote/onsite/none",
          "Mascot avatars representing each user on the map",
          "CSV export of presence lists (remote/onsite)",
          "Modern and responsive interface inspired by Notion/Linear/Slack"
        ],
        conclusion: "This innovative solution improves workspace management and team communication in a multi-site context, while adding a playful and social dimension to the user experience."
      },
      carrefour: {
        title: "Carrefour Brand Verification System",
        description: "Development of a sophisticated brand ownership verification system using AI to analyze and validate relationships between brands and their owners. This project was completed as part of the Carrefour Geniathon.",
        features: "Key features:",
        featuresList: [
          "Systematic brand verification with confidence score calculation",
          "Intelligent source management and data validation",
          "Performance optimization with parallel processing",
          "In-depth analysis of brand relationships",
          "Informative and intuitive user interface"
        ],
        conclusion: "This automated solution enables Carrefour to optimize brand management and reduce intellectual property risks while improving operational efficiency."
      },
      sportech: {
        title: "Sportech",
        description: "Sportech is an innovative solution integrating artificial intelligence to optimize sports performance, prevent injuries, and facilitate recruitment. By analyzing and contextualizing player data, it enables clubs to predict athlete potential, make informed team management decisions, and optimize transfer strategies. With interactive dashboards and data science-based predictions, Sportech transforms decision-making in sports organizations."
      },
      getStaty: {
        title: "GetStaty (in development)",
        description: "This project offers a dynamic match and player analysis solution for football championships, with an interface allowing users to select a championship and match day. Through integration with sports APIs (e.g., API-FOOTBALL, Football-Data.org), the application retrieves matches and generates detailed statistics on player performance.",
        features: "Key features:",
        featuresList: [
          "Match access: Extraction of match data for the selected day and championship, including teams, schedules, etc.",
          "Player performance analysis: Ranking players based on recent statistics (ratings, goals, assists).",
          "Top Performers identification: Ranking of the top five in-form players and the best scorers and assisters from each team.",
          "Results rendering: Presentation in table or message format, providing users with a clear performance summary."
        ],
        conclusion: "This solution provides a quick and relevant overview of the best players and expected performances, ideal for enthusiasts, analysts, or sports bettors."
      },
      novarena: {
        title: "Novarena (in development)",
        description: "Novarena is a comprehensive intelligent management suite for modern stadiums, combining all operational, business, and user experience aspects into a unified platform. This complete solution integrates performance & analytics modules, spectator management, talent management, and business & sponsorship, all within a multi-region cloud-native architecture.",
        features: "Key modules :",
        featuresList: [
          "Performance & Analytics : Real-time match analysis, tactical and physical metrics, decision dashboards, predictions, and insights",
          "Spectator Management : Dynamic ticketing, personalized experience, crowd management, concession optimization",
          "Talent Management : Player tracking (Smart Player Routing), scouting, recruitment, injury management, youth development",
          "Business & Sponsorship : Partnership management, ROI and analytics, sponsor activation, media management"
        ],
        conclusion: "This platform aims to revolutionize modern stadium management by integrating all aspects into a unified, data-driven, and scalable solution, enabling complete optimization of operations and user experience."
      }
    },
    chat: {
      title: "Chat",
      placeholder: "Write your message...",
      send: "Send",
      autoReply: "Thank you for your message. I will reply as soon as possible."
    },
    skills: {
      fr: [
        "Conception et déploiement de modèles d'IA prédictifs",
        "Analyse avancée de données et visualisation interactive",
        "Traitement du langage naturel et analyse de texte",
        "Automatisation intelligente des processus métier",
        "Création de solutions BI sur mesure",
        "Direction de projets d'IA et gestion agile",
        "Analyse comportementale et études de marché",
        "Systèmes de recommandation personnalisés",
        "Intelligence artificielle appliquée au marketing"
      ],
      en: [
        "Design and deployment of predictive AI models",
        "Advanced data analysis and interactive visualization",
        "Natural language processing and text analytics",
        "Intelligent business process automation",
        "Custom BI solution development",
        "AI project leadership and agile management",
        "Behavioral analysis and market research",
        "Personalized recommendation systems",
        "Marketing-focused artificial intelligence"
      ]
    }
  }
};

export function Portfolio() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEnglish, setIsEnglish] = useState(false)
  const [isCVOpen, setIsCVOpen] = useState(false)
  const [isLinksVisible, setIsLinksVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [hideTimeout, setHideTimeout] = useState<NodeJS.Timeout | null>(null)

  const skillsData = [
    { skill: "Python", value: 85 },
    { skill: "SQL", value: 80 },
    { skill: "Power BI", value: 90 },
    { skill: "Hubspot", value: 75 },
    { skill: "Dataiku", value: 70 },
    { skill: "ChatGPT", value: 85 },
    { skill: "Data Analytics", value: 80 },
  ]

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle('dark')
  }

  // Fonction pour gérer l'affichage des liens avec délai
  const handleMouseEnter = () => {
    setIsLinksVisible(true)
    // Annuler tout délai précédent
    if (hideTimeout) {
      clearTimeout(hideTimeout)
      setHideTimeout(null)
    }
  }

  const handleMouseLeave = () => {
    // Créer un délai de 10 secondes avant de cacher les liens
    const timeout = setTimeout(() => {
      setIsLinksVisible(false)
    }, 10000)
    setHideTimeout(timeout)
  }

  // Nettoyer le timeout lors du démontage du composant
  useEffect(() => {
    return () => {
      if (hideTimeout) {
        clearTimeout(hideTimeout)
      }
    }
  }, [hideTimeout])

  // Fonction helper pour obtenir un texte simple
  const getText = (path: string): string => {
    const lang = isEnglish ? 'en' : 'fr';
    const keys = path.split('.');
    let current = translations[lang] as unknown as Record<string, unknown>;
    
    for (const key of keys) {
      if (!current?.[key]) return path;
      current = current[key] as Record<string, unknown>;
    }
    
    return typeof current === 'string' ? current : path;
  };

  // Fonction helper pour obtenir un tableau
  const getArray = (path: string): string[] => {
    const lang = isEnglish ? 'en' : 'fr';
    const keys = path.split('.');
    let current = translations[lang] as unknown as Record<string, unknown>;
    
    for (const key of keys) {
      if (!current?.[key]) return [];
      current = current[key] as Record<string, unknown>;
    }
    
    return Array.isArray(current) ? current : [];
  };

  if (isLoading) {
    return <LoadingScreen onComplete={() => setIsLoading(false)} />
  }

  return (
    <div className={`min-h-screen w-full overflow-x-hidden ${isDarkMode ? 'bg-[#1a2639] text-[#e8e8e0]' : 'bg-[#e8e8e0] text-[#1a2639]'} transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto px-2 sm:px-8 py-6 sm:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr] gap-4 sm:gap-16">
          {/* Left Column (ou bloc 1 sur mobile) */}
          <div className="space-y-6 sm:space-y-8">
            {/* Photo et CV */}
            <div className="space-y-4">
              <div 
                className={`relative w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 border-current cursor-pointer transition-transform duration-300 hover:animate-wiggle focus:outline-none group mx-auto sm:mx-0`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={process.env.NODE_ENV === 'production' ? "/Portfolio/PHOTO.jpg" : "/PHOTO.jpg"}
                  alt="Victorien ALLEG"
                  className="object-cover w-full h-full"
                />
                {/* Curseur animé */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute w-6 h-6 bg-white/20 rounded-full blur-sm animate-cursor-move"></div>
                </div>
              </div>
              {/* Liens sociaux avec animation */}
              <div 
                className={`flex gap-4 items-center justify-center sm:justify-start transition-all duration-300 ${
                  isLinksVisible 
                    ? 'opacity-100 transform translate-y-0' 
                    : 'opacity-0 transform -translate-y-4 pointer-events-none'
                }`}
              >
                <a 
                  href="https://calendly.com/victorienalleg" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity hover:scale-110 transform duration-200"
                >
                  <Calendar className="h-6 w-6" />
                </a>
                <a 
                  href="mailto:victorienalleg@gmail.com"
                  className="hover:opacity-70 transition-opacity hover:scale-110 transform duration-200"
                >
                  <Mail className="h-6 w-6" />
                </a>
                <a 
                  href="tel:+33602035791"
                  className="hover:opacity-70 transition-opacity hover:scale-110 transform duration-200"
                >
                  <Phone className="h-6 w-6" />
                </a>
                <a 
                  href="https://github.com/valleg12/valleg12" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity hover:scale-110 transform duration-200"
                >
                  <Github className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.linkedin.com/in/victorien-alleg-6573b7173/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:opacity-70 transition-opacity hover:scale-110 transform duration-200"
                >
                  <Linkedin className="h-6 w-6" />
                </a>
              </div>
              <Collapsible open={isCVOpen} onOpenChange={setIsCVOpen}>
                <CollapsibleTrigger className="w-full text-left">
                  <div
                    className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                  >
                    CV
                  </div>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-4 space-y-4 text-sm font-light">
                  <div>
                    <h3 className="font-semibold text-lg">Informations Personnelles</h3>
                    <p>victorienalleg@gmail.com</p>
                    <p>06 02 03 57 91</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Formation</h3>
                    <p className="text-lg font-bold mb-2">{getText('education.msc.title')}</p>
                    <p className="text-muted-foreground mb-4">{getText('education.msc.location')}</p>
                    <ul className="list-disc list-inside space-y-1 mb-4">
                      <li>Business analytics</li>
                      <li>Data visualisation</li>
                      <li>CRM</li>
                      <li>Nocode</li>
                      <li>Marketing analytique</li>
                    </ul>
                    <p className="font-semibold mb-2">Langages et outils:</p>
                    <p className="text-muted-foreground">Python, SQL, PowerBI, Hubspot, Dataiku, ChatGPT, Google Analytics, Airtable, Notion, Zapier</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Expérience Professionnelle</h3>
                    <p className="font-semibold">VASPP</p>
                    <p className="text-muted-foreground">Business Intelligence & Growth Analyst</p>
                    <p className="font-semibold mt-2">Le Five Valenciennes / Zone Revolution</p>
                    <p className="text-muted-foreground">Business Analytics & Customer Success Manager</p>
                    <p className="font-semibold mt-2">Saint Amand Football Club</p>
                    <p className="text-muted-foreground">Event Analytics & Operations Manager</p>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            </div>

            <hr className="border-current border-t-2 my-6" />

            {/* Remplacer la section 'work' */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div
                  className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                >
                  {getText('competences.title')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 text-sm font-light">
                <div>
                  <ul className="list-disc list-inside space-y-1">
                    {getArray('skills.fr').map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <hr className="border-current border-t-2 my-6" />

            {/* Remplacer la section 'communication skills' */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div
                  className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                >
                  {getText('services.title')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 text-sm font-light">
                <div>
                  <ul className="list-disc list-inside space-y-1">
                    {getArray('services.items').map((item: string) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <hr className="border-current border-t-2 my-6" />

            {/* Off Work */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div
                  className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                >
                  {getText('offwork.title')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 text-sm font-light">
                <ul className="list-disc list-inside space-y-1">
                  {getArray('offwork.items').map((item: string) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </CollapsibleContent>
            </Collapsible>

            <hr className="border-current border-t-2 my-6" />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Education */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div
                  className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                >
                  {getText('titles.education')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-4 text-sm font-light">
                <div>
                  <p className="text-lg font-bold mb-2">{getText('education.msc.title')}</p>
                  <p className="text-muted-foreground mb-4">{getText('education.msc.location')}</p>
                  <ul className="list-disc list-inside space-y-1 mb-4">
                    <li>Business analytics</li>
                    <li>Data visualisation</li>
                    <li>CRM</li>
                    <li>Nocode</li>
                    <li>Marketing analytique</li>
                  </ul>
                  <p className="font-semibold mb-2">Langages et outils:</p>
                  <p className="text-muted-foreground">Python, SQL, PowerBI, Hubspot, Dataiku, ChatGPT, Google Analytics, Airtable, Notion, Zapier</p>
                </div>
                <div className="mt-6">
                  <p className="text-lg font-bold mb-2">{getText('education.master.title')}</p>
                  <p className="text-muted-foreground">{getText('education.master.location')}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <hr className="border-current border-t-2 my-6" />

            {/* Skills */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div
                  className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                >
                  {getText('titles.skills')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4">
                <Card className={`p-8 ${isDarkMode ? 'bg-[#e8e8e0]' : 'bg-[#1a2639]'}`}>
                  <ResponsiveContainer width="100%" height={400}>
                    <RadarChart data={skillsData} margin={{ top: 30, right: 40, bottom: 30, left: 40 }}>
                      <PolarGrid stroke={isDarkMode ? '#1a2639' : '#e8e8e0'} />
                      <PolarAngleAxis
                        dataKey="skill"
                        tick={{ fill: isDarkMode ? '#1a2639' : '#e8e8e0', fontSize: 14 }}
                      />
                      <PolarRadiusAxis
                        angle={30}
                        domain={[0, 100]}
                        tick={{ fill: isDarkMode ? '#1a2639' : '#e8e8e0', fontSize: 12 }}
                      />
                      <Radar
                        name="Compétences"
                        dataKey="value"
                        stroke={isDarkMode ? '#1a2639' : '#e8e8e0'}
                        fill={isDarkMode ? '#1a2639' : '#e8e8e0'}
                        fillOpacity={0.3}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </Card>
              </CollapsibleContent>
            </Collapsible>

            <hr className="border-current border-t-2 my-6" />

            {/* Languages */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div
                  className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer"
                >
                  {getText('titles.languages')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 grid grid-cols-2 gap-6 text-sm font-light">
                <div>
                  <p className="font-semibold">{getText('languages.french')}</p>
                  <p className="text-muted-foreground">{getText('languages.frenchLevel')}</p>
                </div>
                <div>
                  <p className="font-semibold">{getText('languages.english')}</p>
                  <p className="text-muted-foreground">{getText('languages.englishLevel')}</p>
                </div>
                <div>
                  <p className="font-semibold">{getText('languages.spanish')}</p>
                  <p className="text-muted-foreground">{getText('languages.spanishLevel')}</p>
                </div>
              </CollapsibleContent>
            </Collapsible>

            <hr className="border-current border-t-2 my-6" />

            {/* Projets avec nouveaux logos */}
            <Collapsible>
              <CollapsibleTrigger className="w-full text-left">
                <div className="w-full text-left p-0 text-4xl font-bold hover:underline cursor-pointer">
                  {getText('titles.projects')}
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent className="mt-4 space-y-6 text-sm font-light">
                {/* WTTJ Project */}
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                      {getText('projects.wttj.title')}
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-6 text-sm font-light">
                      <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {getText('projects.wttj.description')}
                          </p>
                          <a 
                            href="https://github.com/valleg12/WTTJ" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors self-end sm:self-auto"
                          >
                            <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                          </a>
                        </div>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base sm:text-lg">
                            {getText('projects.wttj.features')}
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                            {getArray('projects.wttj.featuresList').map((feature: string, index: number) => (
                              <li key={index} className="text-muted-foreground">
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
                            {getText('projects.wttj.conclusion')}
                          </p>
                        </div>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Carrefour Project */}
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                      Carrefour
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-6 text-sm font-light">
                      <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <h3 className="text-xl sm:text-2xl font-bold">
                            {getText('projects.carrefour.title')}
                          </h3>
                          <a 
                            href="https://github.com/valleg12/Carrefour-Project" 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-500 hover:text-blue-600 transition-colors self-end sm:self-auto"
                          >
                            <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                          </a>
                        </div>
                        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                          {getText('projects.carrefour.description')}
                        </p>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base sm:text-lg">
                            {getText('projects.carrefour.features')}
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                            {getArray('projects.carrefour.featuresList').map((feature: string, index: number) => (
                              <li key={index} className="text-muted-foreground">
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
                            {getText('projects.carrefour.conclusion')}
                          </p>
                        </div>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Sportech Project */}
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                      {getText('projects.sportech.title')}
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-6 text-sm font-light">
                      <Card className="p-4 sm:p-6">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                          <p className="text-muted-foreground text-sm sm:text-base">
                            {getText('projects.sportech.description')}
                          </p>
                          <div className="flex gap-2 self-end sm:self-auto">
                            <a 
                              href="https://valleg12.github.io/Scoutech/" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 transition-colors"
                            >
                              <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
                            </a>
                            <a 
                              href="https://github.com/valleg12/Scoutech" 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-500 hover:text-blue-600 transition-colors"
                            >
                              <Github className="h-5 w-5 sm:h-6 sm:w-6" />
                            </a>
                          </div>
                        </div>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* GetStaty Project */}
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                      {getText('projects.getStaty.title')}
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-6 text-sm font-light">
                      <Card className="p-4 sm:p-6">
                        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                          {getText('projects.getStaty.description')}
                        </p>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base sm:text-lg">
                            {getText('projects.getStaty.features')}
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                            {getArray('projects.getStaty.featuresList').map((feature: string, index: number) => (
                              <li key={index} className="text-muted-foreground">
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
                            {getText('projects.getStaty.conclusion')}
                          </p>
                        </div>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Novarena Project */}
                <div className="space-y-4">
                  <Collapsible>
                    <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                      {getText('projects.novarena.title')}
                      <ChevronRight className="h-4 w-4" />
                    </CollapsibleTrigger>
                    <CollapsibleContent className="mt-4 space-y-6 text-sm font-light">
                      <Card className="p-4 sm:p-6">
                        <p className="text-muted-foreground mb-6 text-sm sm:text-base">
                          {getText('projects.novarena.description')}
                        </p>
                        <div className="space-y-4">
                          <h4 className="font-semibold text-base sm:text-lg">
                            {getText('projects.novarena.features')}
                          </h4>
                          <ul className="list-disc list-inside space-y-2 text-sm sm:text-base">
                            {getArray('projects.novarena.featuresList').map((feature: string, index: number) => (
                              <li key={index} className="text-muted-foreground">
                                {feature}
                              </li>
                            ))}
                          </ul>
                          <p className="text-muted-foreground mt-4 text-sm sm:text-base">
                            {getText('projects.novarena.conclusion')}
                          </p>
                        </div>
                      </Card>
                    </CollapsibleContent>
                  </Collapsible>
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>

        {/* Modifier le toggle de langue avec une icône plus grande */}
        <div className="fixed top-4 right-4 flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsEnglish(!isEnglish)}
            className="relative group w-8 h-8"
          >
            <div className="w-8 h-8 relative">
              <div className={`absolute inset-0 transition-opacity duration-300 text-2xl ${isEnglish ? 'opacity-100' : 'opacity-0'}`}>
                🇬🇧
              </div>
              <div className={`absolute inset-0 transition-opacity duration-300 text-2xl ${isEnglish ? 'opacity-0' : 'opacity-100'}`}>
                🇫🇷
              </div>
            </div>
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleDarkMode}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>
      </div>
    </div>
  )
}