import { BrowserRouter, Routes, Route } from "react-router-dom"
import PowerOn from "./Pages/PowerOn"
import LoadingPage from "./Pages/LoadingPage"
import Desktop from "./Pages/Desktop"
import Restart from "./Pages/Restart"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PowerOn />} />
        <Route path="/loading" element={<LoadingPage />} />
        <Route path="/desktop" element={<Desktop />} />
        <Route path="/restart" element={<Restart />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App