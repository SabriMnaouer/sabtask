import { Header } from "./components/layout/Header"
import { Sidebar } from "./components/layout/Sidebar"

function App() {

  return (
    <div className="flex h-screen bg-background dark:bg-dark-bg overflow-hidden text-slate-900 dark:text-slate-100 selection:bg-primary-500/30">
      <Sidebar />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        <Header />
      </main>
    </div>)
}

export default App
