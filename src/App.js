import Header from "./components/header";
import Footer from "./components/footer";
import Videos from "./components/videos";
import Modal from "./components/modal";
import "./App.css";
import React from "react";

function App() {
    return (
        <React.Fragment>
        <Header />
        <Videos />
        <Modal />
        <Footer />
        </React.Fragment>
    );
}

export default App;
