"use client"

import { Moon, Sun, Calendar, Mail, Phone, Github, Linkedin, ChevronRight } from "lucide-react"
import { useState } from "react"
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
  };
  chat: {
    title: string;
    placeholder: string;
    send: string;
    autoReply: string;
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
        "Analyse de sentiment des fans",
        "Scouting et recrutement des talents avec l'IA",
        "Gestion des infrastructures sportives",
        "Analyse des commandites"
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
        location: "Eugenia School, Paris | 2023-2025"
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
      sportech: {
        title: "Sportech",
        description: "Sportech est une solution innovante intégrant l'intelligence artificielle pour optimiser la performance sportive, prévenir les blessures et faciliter le recrutement. En analysant et en contextualisant les données de joueurs, elle permet aux clubs de prévoir le potentiel des athlètes, de prendre des décisions éclairées pour la gestion d'équipe et d'optimiser les stratégies de transfert. Avec des tableaux de bord interactifs et des prédictions basées sur la data science, Sportech transforme la prise de décision dans les organisations sportives."
      },
      getStaty: {
        title: "GetStaty",
        description: "Ce projet propose une solution dynamique d'analyse de matchs et de joueurs pour les championnats de football, avec une interface permettant à l'utilisateur de sélectionner un championnat et une journée de compétition. Grâce à l'intégration d'API sportives (ex. API-FOOTBALL, Football-Data.org), l'application récupère les matchs et génère des statistiques détaillées sur les performances des joueurs.",
        features: "Fonctionnalités clés :",
        featuresList: [
          "Accès aux matchs sélectionnés : Extraction des données de matchs pour la journée et le championnat choisis, y compris les équipes, horaires, etc.",
          "Analyse des performances des joueurs : Classement des joueurs en fonction de leurs statistiques récentes (notes, buts, passes décisives).",
          "Identification des Top Performers : Classement des cinq joueurs en forme et les meilleurs buteurs et passeurs de chaque équipe.",
          "Rendu des résultats : Présentation sous forme de tableau ou de message, offrant à l'utilisateur un résumé clair des performances."
        ],
        conclusion: "Cette solution apporte une vue d'ensemble rapide et pertinente des meilleurs joueurs et des performances attendues, idéale pour les passionnés, analystes ou parieurs sportifs."
      }
    },
    chat: {
      title: "Chat",
      placeholder: "Écrivez votre message...",
      send: "Envoyer",
      autoReply: "Merci pour votre message. Je vous répondrai dans les plus brefs délais."
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
        "Fan sentiment analysis",
        "AI-powered talent scouting and recruitment",
        "Sports infrastructure management",
        "Sponsorship analysis"
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
        location: "Eugenia School, Paris | 2023-2025"
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
      sportech: {
        title: "Sportech",
        description: "Sportech is an innovative solution integrating artificial intelligence to optimize sports performance, prevent injuries, and facilitate recruitment. By analyzing and contextualizing player data, it enables clubs to predict athlete potential, make informed team management decisions, and optimize transfer strategies. With interactive dashboards and data science-based predictions, Sportech transforms decision-making in sports organizations."
      },
      getStaty: {
        title: "GetStaty",
        description: "This project offers a dynamic match and player analysis solution for football championships, with an interface allowing users to select a championship and match day. Through integration with sports APIs (e.g., API-FOOTBALL, Football-Data.org), the application retrieves matches and generates detailed statistics on player performance.",
        features: "Key features:",
        featuresList: [
          "Match access: Extraction of match data for the selected day and championship, including teams, schedules, etc.",
          "Player performance analysis: Ranking players based on recent statistics (ratings, goals, assists).",
          "Top Performers identification: Ranking of the top five in-form players and the best scorers and assisters from each team.",
          "Results rendering: Presentation in table or message format, providing users with a clear performance summary."
        ],
        conclusion: "This solution provides a quick and relevant overview of the best players and expected performances, ideal for enthusiasts, analysts, or sports bettors."
      }
    },
    chat: {
      title: "Chat",
      placeholder: "Write your message...",
      send: "Send",
      autoReply: "Thank you for your message. I will reply as soon as possible."
    }
  }
};

export function Portfolio() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isEnglish, setIsEnglish] = useState(false)
  const [isCVOpen, setIsCVOpen] = useState(false)
  const [isLinksVisible, setIsLinksVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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
    <div className={`min-h-screen ${isDarkMode ? 'bg-[#1a2639] text-[#e8e8e0]' : 'bg-[#e8e8e0] text-[#1a2639]'} transition-colors duration-300`}>
      <div className="max-w-[1600px] mx-auto px-8 py-12">
        <div className="grid grid-cols-[1fr_1fr] gap-16">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Photo and CV */}
            <div className="space-y-4">
              <div 
                className={`relative w-32 h-32 rounded-full overflow-hidden border-4 border-current cursor-pointer transition-transform duration-300 hover:animate-wiggle focus:outline-none`}
                onClick={() => setIsLinksVisible(!isLinksVisible)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/Portfolio/PHOTO.jpg"
                  alt="Victorien ALLEG"
                  className="object-cover w-full h-full"
                />
              </div>
              
              {/* Liens sociaux avec animation */}
              <div 
                className={`flex gap-4 items-center justify-start transition-all duration-300 ${
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
                    <p>Business Development Manager - Le Five Valenciennes</p>
                    <p>Responsable Event - Saint Amand Football Club</p>
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
                    {getArray('competences.items').map((item: string) => (
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
                {/* Projet Sportech avec nouveau logo */}
                <div className="space-y-4">
                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                        <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                        {getText('projects.sportech.title')}
                      </CollapsibleTrigger>
                      {/* Nouveau logo Sportech complètement repensé */}
                      <div className="w-16 h-16 relative cursor-pointer group"
                           onClick={() => window.open('https://valleg12.github.io/Scoutech/', '_blank')}>
                        {/* Fond principal */}
                        <div className="absolute inset-0 bg-[#1a2639] rounded-lg overflow-hidden">
                          {/* Grille de données animée */}
                          <div className="absolute inset-0 opacity-20">
                            <div className="absolute inset-0 bg-[linear-gradient(0deg,transparent_46%,#4a90e2_47%,#4a90e2_53%,transparent_54%)] bg-[length:100%_10px] animate-scroll"></div>
                            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_46%,#4a90e2_47%,#4a90e2_53%,transparent_54%)] bg-[length:10px_100%] animate-scroll-horizontal"></div>
                          </div>
                        </div>
                        {/* Élément central */}
                        <div className="absolute inset-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-md transform group-hover:scale-110 transition-all duration-500">
                          {/* Ligne de vitesse */}
                          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-white/50 transform -translate-y-1/2"></div>
                          {/* Points de données */}
                          <div className="absolute inset-0 flex items-center justify-around">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-100"></div>
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse delay-200"></div>
                          </div>
                        </div>
                        {/* Overlay avec effet de brillance */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                      </div>
                    </div>
                    <CollapsibleContent className="mt-2 pl-6">
                      <p className="text-sm leading-relaxed">
                        {getText('projects.sportech.description')}
                      </p>
                    </CollapsibleContent>
                  </Collapsible>
                </div>

                {/* Projet GetStaty avec nouveau logo */}
                <div className="space-y-4">
                  <Collapsible>
                    <div className="flex items-center justify-between">
                      <CollapsibleTrigger className="flex items-center gap-2 text-lg font-semibold hover:opacity-70 transition-opacity">
                        <ChevronRight className="w-4 h-4 transition-transform duration-200" />
                        {getText('projects.getStaty.title')}
                      </CollapsibleTrigger>
                      {/* Nouveau logo GetStaty */}
                      <div className="w-16 h-16 relative cursor-pointer group"
                           onClick={() => window.open('#', '_blank')}>
                        {/* Cercle principal */}
                        <div className="absolute inset-0 bg-[#1a2639] rounded-full overflow-hidden">
                          {/* Effet de vague de données */}
                          <div className="absolute inset-0">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 animate-wave"></div>
                          </div>
                        </div>
                        {/* Symbole central */}
                        <div className="absolute inset-3 flex items-center justify-center">
                          <div className="relative w-full h-full">
                            {/* Graphique stylisé */}
                            <div className="absolute inset-0 flex items-end justify-around">
                              <div className="w-1 bg-white/80 h-[30%] transform group-hover:h-[60%] transition-all duration-500"></div>
                              <div className="w-1 bg-white/80 h-[50%] transform group-hover:h-[80%] transition-all duration-500 delay-75"></div>
                              <div className="w-1 bg-white/80 h-[40%] transform group-hover:h-[70%] transition-all duration-500 delay-150"></div>
                              <div className="w-1 bg-white/80 h-[60%] transform group-hover:h-[90%] transition-all duration-500 delay-225"></div>
                            </div>
                          </div>
                        </div>
                        {/* Anneau externe animé */}
                        <div className="absolute inset-0 border-2 border-white/30 rounded-full scale-100 group-hover:scale-110 transition-transform duration-500"></div>
                      </div>
                    </div>
                    <CollapsibleContent className="mt-2 pl-6">
                      <p className="text-sm leading-relaxed">
                        {getText('projects.getStaty.description')}
                      </p>
                      <p className="text-sm leading-relaxed mt-2">
                        {getText('projects.getStaty.features')}
                      </p>
                      <ul className="list-disc list-inside space-y-1 mt-2 text-sm">
                        {getArray('projects.getStaty.featuresList').map((feature: string, index: number) => (
                          <li key={index}>{feature}</li>
                        ))}
                      </ul>
                      <p className="text-sm leading-relaxed mt-2">
                        {getText('projects.getStaty.conclusion')}
                      </p>
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