import React from "react";
import { useState } from 'react';
import { Sapper } from "./components/sapper/Sapper";
import "./style.css";

export default function App() {

  return (
      <div className="games">
        <Sapper/>
      </div>
  );
}
