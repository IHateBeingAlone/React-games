import React from 'react'
import { Routes, Route } from 'react-router-dom'
import {Sapper} from './sapper/Sapper'
import {Header} from './Header'
import {TwentyFortyEight} from './twentyFortyEight/TwentyFortyEight'
import {MatchThree} from './match-three/MatchThree'

export function Wrapper () {
    return (
        <>
            <Header />
            <div className="wrapper">
                <Routes>
                    <Route path="/sapper" element={<Sapper />} />
                    <Route path="/twentyfortyeight" element={<TwentyFortyEight />} />
                    <Route path="/matchthree" element={<MatchThree />} />
                </Routes>
            </div>
        </>
    );
}