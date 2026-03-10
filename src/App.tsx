import { Suspense, lazy } from 'react'
import { LoadingProvider } from './context/LoadingContext'
import Loading from './components/Loading'
import Navbar from './components/Navbar'
import About from './components/About'
import Hero from './components/Hero'
import Projects from './components/Projects'
import Services from './components/Services'
import OffWork from './components/OffWork'

const Background = lazy(() => import('./components/Background'))

export default function App() {
  return (
    <LoadingProvider>
      <Suspense fallback={null}>
        <Background />
      </Suspense>
      <Loading />
      <Navbar />
      <main style={{ position: 'relative', zIndex: 10 }}>
        <Hero />
        <About />
        <Projects />
        <Services />
        <OffWork />
      </main>
    </LoadingProvider>
  )
}
