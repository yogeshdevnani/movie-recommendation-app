import React from "react";
import Navbar from "../components/Navbar/Navbar";

const AboutPage = () => {
  const aboutStyles = {
    container: {
      background: "#1e1e1e",
      padding: "3rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      minHeight: "calc(100vh - 60px)", // Adjust based on navbar height
    },
    content: {
      maxWidth: "700px",
      width: "100%",
    },
    title: {
      color: "#ffffff",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "1.5rem",
      position: "relative",
      paddingBottom: "0.5rem",
    },
    titleUnderline: {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "60px",
      height: "3px",
      background: "#ff5252",
    },
    paragraph: {
      color: "#cccccc",
      fontSize: "18px",
      lineHeight: "1.7",
      marginBottom: "1.5rem",
    },
    signature: {
      marginTop: "2rem",
      color: "#ffffff",
      fontWeight: "500",
    },
  };

  return (
    <>
      <Navbar />
      <main style={aboutStyles.container}>
        <div style={aboutStyles.content}>
          <h1 style={aboutStyles.title}>
            About
            <div style={aboutStyles.titleUnderline}></div>
          </h1>

          <p style={aboutStyles.paragraph}>
            This app was an idea I had been sitting on for a while, and with AI
            tools I finally put it together in very little time while still
            enjoying the weekend. Deploying it to Azure took some trial and
            error, but that turned into the best part of the learning. It shows
            that with strong fundamentals, curiosity, and the right tools, I can
            build and ship prototypes quickly.
          </p>

          <div style={aboutStyles.signature}>
            Best,
            <br />
            Yogesh
          </div>
        </div>
      </main>
    </>
  );
};

export default AboutPage;
