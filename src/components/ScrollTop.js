import React from "react";

export default function ScrollTop() {
    // Set the top cordinate to 0
    // make scrolling smooth
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };
    return (
        <>
            <button className="scroll-top scroll-to-target" data-target="html" onClick={scrollToTop}>
                <i style={{margin: '0 auto'}} className="fas fa-angle-up" />
            </button>
        </>
    );
}
