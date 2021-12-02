import Header from "./components/header";
import Footer from "./components/footer";
import Videos from "./components/videos";
import "./App.css";
import React from "react";

function App() {
    return (
        <React.Fragment>
        <Header />
        <Videos />
        <Footer />
        </React.Fragment>
    );
}

export default App;
