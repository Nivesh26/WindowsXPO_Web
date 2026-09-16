import { BrowserRouter, Routes, Route } from "react-router-dom"
import PowerOn from "./Pages/PowerOn"
import LoadingPage from "./Pages/LoadingPage"

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PowerOn />} />
        <Route path="/loading" element={<LoadingPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App