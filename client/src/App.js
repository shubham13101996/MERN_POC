import { Route, Routes } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound";
import Policy from "./pages/Policy";
import Contact from "./pages/Contact";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import About from "./pages/About";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import Home from "./pages/Home";
import ArticlesPlan from "./pages/ArticlesPlan";
import Articles from "./pages/Articles";

function  App(){
  return(
    <>
    <Routes>
       <Route path="/" element={<Home />} />
   
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        {/* <Route path="/articles" element={<ProtectedRoute />}> */}
          <Route path="/articles" element={<Articles />} />
        {/* </Route> */}
        {/* <Route path="/article-plans" element={<ProtectedRoute />}> */}
          <Route path="/article-plans" element={<ArticlesPlan />} />
        {/* </Route> */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/forgot-password" element={<ForgotPassword/>} />
        <Route path="*" element={<PageNotFound />} />
    </Routes>
    
    </>
  )
}

export default App;