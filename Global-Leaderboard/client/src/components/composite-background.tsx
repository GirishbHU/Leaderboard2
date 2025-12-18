import React from "react";

export function CompositeBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
      <div className="absolute inset-0 w-[300%] h-[300%] -left-[100%] -top-[100%] grid grid-cols-2 grid-rows-2">
        <div 
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(/blog-images/ai.png)`, opacity: 0.12 }}
        />
        <div 
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(/blog-images/technology.png)`, opacity: 0.12 }}
        />
        <div 
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(/blog-images/leadership.png)`, opacity: 0.12 }}
        />
        <div 
          className="bg-cover bg-center"
          style={{ backgroundImage: `url(/blog-images/business-strategy.png)`, opacity: 0.12 }}
        />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-transparent to-background/60" />
    </div>
  );
}
