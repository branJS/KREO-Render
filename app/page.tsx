/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import dynamic from "next/dynamic";

const WorldScene = dynamic(() => import("./WorldScene"), { ssr: false });

const SECTIONS = ["home","projects","about","contact","blog","shop","downloads"] as const;
type SectionId = typeof SECTIONS[number];

const clamp = (n:number,a:number,b:number)=>Math.max(a,Math.min(b,n));

/* ---------------- Mouse tracking ---------------- */
function useRootMouseVars(){
  useEffect(()=>{
    const r = document.documentElement;
    const onMove=(e:MouseEvent)=>{
      r.style.setProperty("--mx", e.clientX + "px");
      r.style.setProperty("--my", e.clientY + "px");
      r.style.setProperty("--mxp", (e.clientX / innerWidth).toFixed(4));
      r.style.setProperty("--myp", (e.clientY / innerHeight).toFixed(4));
    };
    window.addEventListener("mousemove", onMove);
    return ()=>window.removeEventListener("mousemove", onMove);
  },[]);
}

/* ---------------- Sound hooks ---------------- */
function useSound(){
  const [muted,setMuted] = useState(false);
  useEffect(()=>{
    const bg = document.getElementById("bg-music") as HTMLAudioElement | null;
    if(!bg) return;
    bg.volume = 0.18;
    const start=()=>bg.play().catch(()=>{});
    document.addEventListener("click",start,{once:true});
    start();
  },[]);
  useEffect(()=>{
    ["bg-music","hover-sfx","click-sfx"].forEach(id=>{
      const a=document.getElementById(id) as HTMLAudioElement | null;
      if(a) a.muted=muted;
    });
  },[muted]);
  return {muted,setMuted};
}

/* ---------------- Magnetic motion ---------------- */
function useMagnetic(){
  useEffect(()=>{
    const els=Array.from(document.querySelectorAll<HTMLElement>("[data-magnetic]"));
    let raf=0,mx=0,my=0;
    const onMove=(e:MouseEvent)=>{mx=e.clientX;my=e.clientY;if(!raf)raf=requestAnimationFrame(apply);};
    const apply=()=>{
      els.forEach(el=>{
        const r=el.getBoundingClientRect();
        const dx=mx-(r.left+r.width/2);
        const dy=my-(r.top+r.height/2);
        const pull=Math.max(0,1-Math.hypot(dx,dy)/240);
        const ease=0.24;
        const tx=dx*0.12*pull,ty=dy*0.12*pull;
        const prev=el.style.transform.match(/translate\(([-0-9.]+)px,\s*([-0-9.]+)px\)/);
        const px=prev?parseFloat(prev[1]):0;const py=prev?parseFloat(prev[2]):0;
        el.style.transform=`translate(${px+(tx-px)*ease}px, ${py+(ty-py)*ease}px)`;
      });
      raf=0;
    };
    window.addEventListener("mousemove",onMove);
    const clear=()=>els.forEach(el=>el.style.transform="translate(0,0)");
    window.addEventListener("mouseout",clear);
    return ()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseout",clear);};
  },[]);
}

/* ---------------- HUD ---------------- */
function HUD({muted,setMuted}:{muted:boolean;setMuted:(v:boolean)=>void}){
  const time = new Date().toLocaleTimeString([], {hour:"2-digit",minute:"2-digit"});
  return (
    <div className="hud">
      <div className="hud-left">
        <span className="tag bold">Brandon Allen</span>
      </div>
      <div className="hud-center">
        <nav className="hud-nav">
          {["home","projects","about","contact","blog","shop","downloads"].map(s=>(
            <a key={s} href={`#${s}`} className="hud-link"
               onClick={(e)=>{
                 e.preventDefault();
                 // move 3D camera
                 window.dispatchEvent(new CustomEvent("kreo:navigate",{detail:{section:s}}));
                 // also scroll the HTML section into view
                 const target=document.getElementById(s);
                 if(target) target.scrollIntoView({behavior:"smooth",block:"start"});
               }}>
              {s.toUpperCase()}
            </a>
          ))}
        </nav>
      </div>
      <div className="hud-right">
        <button className="hud-btn sound" onClick={()=>setMuted(!muted)}>
          {muted?"🔇 SOUND":"🔊 SOUND"}
        </button>
        <span className="hud-time">{time}</span>
      </div>
    </div>
  );
}

/* ---------------- Page ---------------- */
export default function Page(){
  useRootMouseVars();
  useMagnetic();
  const {muted,setMuted}=useSound();

  return (
    <main className="kreo">
      <WorldScene sections={["home","projects","about","contact","blog","shop","downloads"]}/>
      <HUD muted={muted} setMuted={setMuted}/>

      {/* HERO */}
      <section id="home" className="section hero visible">
        <div className="panel hero-panel center">
          <div className="hero-content">
            <h1 className="title">BRANDON</h1>
            <p className="subtitle">BRANDON ALLEN — VISUALS, MOTION & INTERACTION (PLYMOUTH, UK)</p>
            <div className="chip-row nav-chips">
              <a href="#home" className="chip c-yellow" title="Home">Y</a>
              <a href="#projects" className="chip c-teal" title="Projects">T</a>
              <a href="#about" className="chip c-green" title="About">G</a>
              <a href="#blog" className="chip c-blue" title="Blog">B</a>
              <a href="#shop" className="chip c-red" title="Shop">R</a>
              <a href="#downloads" className="chip c-pink" title="Downloads">P</a>
            </div>
            <div className="cta-row">
              <a href="#projects" className="btn b-yellow" data-magnetic>Explore Projects</a>
              <a href="#contact" className="btn b-blue outline" data-magnetic>Get in Touch</a>
            </div>
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Projects</h2>
          </div>
          <p>Content placeholder for projects…</p>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">About</h2>
          </div>
          <p><b>BRANDON</b> designs interfaces like systems: modular, colorful, legible. We mix motion, code, and type into playful environments.</p>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Contact</h2>
          </div>
          <form className="form" onSubmit={(e)=>e.preventDefault()}>
            <input placeholder="Name" required/>
            <input placeholder="Email" type="email" required/>
            <textarea rows={4} placeholder="Your message" required/>
            <div className="row">
              <button className="btn b-teal" data-magnetic type="submit">Send</button>
              <a href="#downloads" className="btn outline b-black" data-magnetic>Downloads</a>
            </div>
          </form>
        </div>
      </section>

      {/* BLOG */}
      <section id="blog" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Blog</h2>
          </div>
          <div className="list">
            {["Designing with Systems","Motion That Serves Meaning","Why Brutalism Works"].map((t,i)=>(
              <div className="list-item" key={i}>
                <span className="bullet c-red"/>
                <div className="li-body">
                  <h3>{t}</h3>
                  <p>Coming soon…</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SHOP */}
      <section id="shop" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Shop</h2>
          </div>
          <div className="grid small">
            {Array.from({length:6}).map((_,i)=><div className="tile" key={i}>Soon</div>)}
          </div>
        </div>
      </section>

      {/* DOWNLOADS */}
      <section id="downloads" className="section">
        <div className="panel">
          <div className="panel-head">
            <h2 className="section-title">Downloads</h2>
          </div>
          <div className="downloads-flex">
            <a href="#" className="link b-yellow">Brand Pack</a>
            <a href="#" className="link b-blue">Press Kit</a>
            <a href="#" className="link b-green">Case PDFs</a>
          </div>
        </div>
      </section>

      <audio id="bg-music" src="/sounds/background.mp3" loop/>
      <audio id="hover-sfx" src="/sounds/hover.mp3"/>
      <audio id="click-sfx" src="/sounds/click.mp3"/>
    </main>
  );
}
