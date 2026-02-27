import { useState } from 'react'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Tracker from './pages/Tracker'
import Readiness from './pages/Readiness'
import Prevention from './pages/Prevention'
import Forum from './pages/Forum'
import MyPlan from './pages/MyPlan'
import WellnessScore from './pages/WellnessScore'
import './index.css'

type Lang = 'en' | 'et'

function App() {
  const [page, setPage] = useState('dashboard')
  const [lang, setLang] = useState<Lang>('en')

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard lang={lang} />
      case 'tracker': return <Tracker lang={lang} />
      case 'readiness': return <Readiness lang={lang} />
      case 'prevention': return <Prevention lang={lang} />
      case 'forum': return <Forum lang={lang} />
      case 'plan': return <MyPlan lang={lang} />
      case 'wellness': return <WellnessScore lang={lang} />
      default: return <Dashboard lang={lang} />
    }
  }

  return (
    <Layout
      activePage={page}
      onNavigate={setPage}
      lang={lang}
      onLangToggle={() => setLang(l => l === 'en' ? 'et' : 'en')}
    >
      {renderPage()}
    </Layout>
  )
}

export default App
