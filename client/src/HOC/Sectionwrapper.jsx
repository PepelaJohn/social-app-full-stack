import React from "react";

 const Sectionwrapper = (Component, classes) =>
  function HOC() {
    return (
      <section className={`${classes} nav-height pt-5 flex flex-col h-fit items-center`}>
        <Component />
      </section>
    );
  };
export default Sectionwrapper