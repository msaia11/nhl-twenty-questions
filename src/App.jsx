import styles from './App.module.css'
import { Footer } from './components/Footer/Footer'
import { Game } from './components/Game/Game'
import { Header } from './components/Header/Header'

function App() {
  return (
    <div className={styles.App}>
      <Header/>
      <Game />
      <Footer />
    </div>
  )
}

export default App
