import React, {useMemo} from "react";
import {useState} from 'react';
import {useEffect} from 'react';
import {MineComponent} from "./MineComponent";

const Mine = -1

function createField(size) {
    const field = new Array(size * size).fill(0)

    function inc(x, y) {
        if (x >= 0 && x < size && y >= 0 && y < size) {
            if (field[y * size + x] === Mine) return

            field[y * size + x] += 1
        }
    }

    for (let i = 0; i < size;) {
        const x = Math.floor(Math.random() * size)
        const y = Math.floor(Math.random() * size)

        if (field[y * size + x] === Mine) continue

        field[y * size + x] = Mine

        i += 1

        inc(x + 1, y + 1)
        inc(x + 1, y - 1)
        inc(x - 1, y + 1)
        inc(x - 1, y - 1)
        inc(x, y + 1)
        inc(x, y - 1)
        inc(x + 1, y)
        inc(x - 1, y)
    }

    return field
}

var Mask = new Object()

Mask.Transparent = null
Mask.Fill = <img className="fill" src="/assets/images/fill.png"/>
Mask.Flag = <img className="flag" src="/assets/images/flag.png"/>
Mask.Question = <img className="flag" src="/assets/images/question.png"/>
Mask.Mistake = <img className="mistake" src="/assets/images/mistake.png"/>
Mask.Explosive = <img className="explosive" src="/assets/images/explosive-mine.png"/>
Mask.TemporarilyTransparent = <img className="explosive" src="/assets/images/open.png"/>

var Type = new Object()

Type.Normal = <img className="face" src="/assets/images/normal.png"/>
Type.NormalClicked = <img className="face" src="/assets/images/normal-clicked.png"/>
Type.Win = <img className="face" src="/assets/images/win.png"/>
Type.Lose = <img className="face" src="/assets/images/lose.png"/>
Type.Click = <img className="face" src="/assets/images/click.png"/>

export function Field (props) {
    const dimension = new Array(props.size).fill(null)
    let countFlags = 0
    let countFills = 0
    let startCounter = 0

    const [clicked, setClicked] = useState(null)
    const [faceClicked, setFaceClicked] = useState(false)
    const [timerActive, setTimerActive] = useState(false)
    const [seconds, setSeconds] = useState(0)
    const [flags, setFlags] = useState(props.size)
    const [lose, setLose] = useState(false)
    const [field, setField] = useState(() => createField(props.size))
    const [mask, setMask] = useState(() => new Array(props.size * props.size).fill(Mask.Fill))

    let win = useMemo(() => !field.some((f, i) => flags !== 0 || f === Mine && mask[i] !== Mask.Flag || f !== Mine && mask[i] === Mask.Flag), [field, mask, flags])

    function startWithZeroMinus (x, y) {
        if (y >= 0 && y < props.size && x >= 0 && x < props.size) {
            if (field[y * props.size + x] === Mine) return

            field[y * props.size + x] = field[y * props.size + x] - 1
        }
    }

    function startWithZeroPlus (index) {
        if (index >= 0 && index <= field.length) {
            if (field[index] === Mine) return

            field[index] += 1
        }
    }

    function itemsAround (x, y, array) {
        if (x >= 0 && x < props.size && y >= 0 && y < props.size) {
            array.push([x, y])
        }
    }

    function chooseAround (x, y, array) {
        itemsAround(x + 1, y + 1, array)
        itemsAround(x - 1, y - 1, array)
        itemsAround(x + 1, y - 1, array)
        itemsAround(x - 1, y + 1, array)
        itemsAround(x + 1, y, array)
        itemsAround(x - 1, y, array)
        itemsAround(x, y + 1, array)
        itemsAround(x, y - 1, array)
    }

    function clickHandler (e) {
        field.map((element, index) => {
            if (mask[index] !== Mask.Fill) {
                startCounter++
            }
        })
        if (startCounter === 0) {
            let axisX = Number(e.target.dataset.x)
            let axisY = Number(e.target.dataset.y)
            if (field[axisY * props.size + axisX] !== 0) {
                let minesAroundCounter = 0
                let notMines = []

                function moveMine (index) {
                    field[index] = Mine
                    if (!Number.isInteger((index + 1) / props.size)) {
                        startWithZeroPlus(index + 1)
                        startWithZeroPlus(index - props.size + 1)
                        startWithZeroPlus(index + props.size + 1)
                    }
                    if (!Number.isInteger(index / props.size)) {
                        startWithZeroPlus(index - 1)
                        startWithZeroPlus(index - props.size - 1)
                        startWithZeroPlus(index + props.size - 1)
                    }
                    startWithZeroPlus(index - props.size)
                    startWithZeroPlus(index + props.size)
                }

                function reduceAround (x, y) {
                    startWithZeroMinus(x + 1, y + 1)
                    startWithZeroMinus(x - 1, y - 1)
                    startWithZeroMinus(x + 1, y - 1)
                    startWithZeroMinus(x - 1, y + 1)
                    startWithZeroMinus(x + 1, y)
                    startWithZeroMinus(x - 1, y)
                    startWithZeroMinus(x, y + 1)
                    startWithZeroMinus(x, y - 1)
                }

                function removeMinesAround (x, y, array) {
                    chooseAround(x, y, array)
                    while(array.length) {
                        const [x, y] = array.pop()

                        if (field[y * props.size + x] !== Mine) continue;

                        let newRandomIndex = notMines[Math.floor(Math.random() * notMines.length)]
                        notMines = notMines.filter((n) => {return n !== newRandomIndex})
                        moveMine(newRandomIndex)
                        const aroundMineSecondNumber = []
                        chooseAround(x, y, aroundMineSecondNumber)
                        let minesAroundCounterSecond = 0
                        while(aroundMineSecondNumber.length) {
                            const [x, y] = aroundMineSecondNumber.pop()

                            if (field[y * props.size + x] !== Mine) continue;

                            minesAroundCounterSecond++
                        }
                        field[y * props.size + x] = minesAroundCounterSecond
                        reduceAround(x, y)
                    }
                }

                if (field[axisY * props.size + axisX] === -1) {
                    field.map((element, index) => {
                        if (element !== Mine) {
                            notMines.push(index)
                        }
                    })
                    let randomIndex = notMines[Math.floor(Math.random() * notMines.length)]
                    notMines = notMines.filter((n) => {return n !== randomIndex})
                    moveMine(randomIndex)
                    const aroundNumber = []
                    chooseAround(axisX, axisY, aroundNumber)
                    while(aroundNumber.length) {
                        const [x, y] = aroundNumber.pop()

                        if (field[y * props.size + x] !== Mine) continue;

                        minesAroundCounter++
                    }
                    reduceAround(axisX, axisY)
                    if (minesAroundCounter === 0) {
                        field[axisY * props.size + axisX] = 0
                    } else {
                        field[axisY * props.size + axisX] = minesAroundCounter
                        let aroundMineNumber = []
                        removeMinesAround(axisX, axisY, aroundMineNumber)
                    }
                } else {
                    let aroundNumber = []
                    field.map((element, index) => {
                        if (element !== Mine) {
                            notMines.push(index)
                        }
                    })
                    notMines = notMines.filter((n) => {return n !== (axisY * props.size + axisX)})
                    removeMinesAround(axisX, axisY, aroundNumber)
                }
            }
        }
        if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Transparent) return

        if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Fill) {
            const clearing = []

            function clear (x, y) {
                if (x >= 0 && x < props.size && y >= 0 && y < props.size) {
                    if (mask[y * props.size + x] === Mask.Transparent) return
                    clearing.push([x, y])
                }
            }

            clear(Number(e.target.dataset.x), Number(e.target.dataset.y))

            while(clearing.length) {
                const [x, y] = clearing.pop()

                mask[y * props.size + x] = Mask.Transparent

                if (field[y * props.size + x] !== 0) continue

                clear(x + 1, y + 1)
                clear(x + 1, y - 1)
                clear(x - 1, y + 1)
                clear(x - 1, y - 1)
                clear(x, y + 1)
                clear(x, y - 1)
                clear(x + 1, y)
                clear(x - 1, y)
            }

            if (field[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mine) {

                e.target.dataset.type = 'explosive'

                field.map((number, index) => {
                    if (number !== Mine && mask[index] === Mask.Flag) {
                        mask[index] = Mask.Mistake
                    }
                    if (number === Mine) {
                        mask[index] = Mask.Transparent
                    }
                })

                setLose(true)
            }
        }

        countFills = 0

        field.map((item, index) => {
            if (mask[index] === Mask.Fill) {
                countFills++
            }
        })

        if (countFills === 1) {
            field.map((item, index) => {
                if (mask[index] === Mask.Fill && item === Mine) {
                    mask[index] = Mask.Flag
                }
            })
        }

        countFlags = 0

        mask.map((item, index) => {
            if (mask[index] === Mask.Flag) {
                countFlags++
            }
        })

        if (seconds === 0 && timerActive === false) {
            setTimerActive(true)
        }

        setFlags(props.size - countFlags)

        setMask((prev) => [...prev])
    }

    function rightClick (e) {
        e.preventDefault()
        e.stopPropagation()

        if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Transparent) return

        if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Fill) {
            mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] = Mask.Flag
        } else if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Flag) {
            mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] = Mask.Question
        } else if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Question) {
            mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] = Mask.Fill
        }

        countFlags = 0

        mask.map((item, index) => {
            if (mask[index] === Mask.Flag) {
                countFlags++
            }
        })

        setFlags(props.size - countFlags)

        setMask((prev) => [...prev])
    }

    useEffect(() => {
        if (seconds < 999 && timerActive && !win && !lose) {
            setTimeout(setSeconds, 1000, seconds + 1);
        } else {
            setTimerActive(false);
        }
    }, [ seconds, timerActive ]);

    function restart () {
        countFlags = 0
        countFills = 0

        setClicked(null)
        setFaceClicked(false)
        setTimerActive(false)
        setSeconds(0)
        setFlags(props.size)
        setLose(false)
        setField(() => createField(props.size))
        setMask(() => new Array(props.size * props.size).fill(Mask.Fill))
    }

    const aroundTransparentNumber = []
    let flagsAroundCounter = 0

    function searchMinesAround(x, y, array) {
        chooseAround(x, y, array)
        while(array.length) {
            const [x, y] = array.pop()

            if (mask[y * props.size + x] !== Mask.Flag) continue

            flagsAroundCounter++
        }
    }

    function onMouseDown (e) {

        if (field[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] > 0 && mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Transparent) {
            searchMinesAround(Number(e.target.dataset.x), Number(e.target.dataset.y), aroundTransparentNumber)
            if (Number(e.target.dataset.value) === flagsAroundCounter) {
                chooseAround(Number(e.target.dataset.x), Number(e.target.dataset.y), aroundTransparentNumber)
                while(aroundTransparentNumber.length) {
                    const [x, y] = aroundTransparentNumber.pop()

                    if (mask[y * props.size + x] === Mask.Flag && field[y * props.size + x] !== Mine) {
                        mask[y * props.size + x] = Mask.Mistake
                    } else if (mask[y * props.size + x] !== Mask.Flag && field[y * props.size + x] === Mine) {
                        field.map((number, index) => {
                            if (number === Mine) {
                                mask[index] = Mask.Transparent
                            }
                        })

                        mask[y * props.size + x] = Mask.Explosive

                        setLose(true)
                    } else if (mask[y * props.size + x] !== Mask.Flag && field[y * props.size + x] !== Mine) {
                        mask[y * props.size + x] = Mask.Transparent
                    }
                }
            } else {
                chooseAround(Number(e.target.dataset.x), Number(e.target.dataset.y), aroundTransparentNumber)
                while(aroundTransparentNumber.length) {
                    const [x, y] = aroundTransparentNumber.pop()

                    if (mask[y * props.size + x] === Mask.Flag) continue

                    if (mask[y * props.size + x] === Mask.Fill) {
                        mask[y * props.size + x] = Mask.TemporarilyTransparent
                    }
                }
            }
            setClicked(Type.Click)
        } else if (mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Fill || e.target.dataset.value > 0) {
            setClicked(Type.Click)
        }

        setMask((prev) => [...prev])
    }

    function onMouseUp (e) {
        if (field[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] > 0 && mask[Number(e.target.dataset.y) * props.size + Number(e.target.dataset.x)] === Mask.Transparent) {
            searchMinesAround(Number(e.target.dataset.x), Number(e.target.dataset.y), aroundTransparentNumber)
            if (Number(e.target.dataset.value) !== flagsAroundCounter) {
                chooseAround(Number(e.target.dataset.x), Number(e.target.dataset.y), aroundTransparentNumber)
                while(aroundTransparentNumber.length) {
                    const [x, y] = aroundTransparentNumber.pop()

                    if (mask[y * props.size + x] === Mask.Flag) continue

                    if (mask[y * props.size + x] === Mask.TemporarilyTransparent) {
                        mask[y * props.size + x] = Mask.Fill
                    }
                }
            }
        }
        setClicked(Type.Normal)
    }

    return (
        <>
            <div className="top">
                <div className="top-flags">
                    {
                        flags < 10 ? '0' + '0' + flags : flags >= 10 && flags < 100 ? '0' + flags : flags
                    }
                </div>
                <div
                    className="top-face"
                    onClick={restart}
                    onMouseDown={() => {setFaceClicked(true)}}
                    onMouseUp={() => {setFaceClicked(false)}}
                >
                    {
                        faceClicked === true ? Type.NormalClicked : lose ? Type.Lose : win ? Type.Win : clicked !== null ? clicked : Type.Normal
                    }
                </div>
                <div className="top-time">
                    {
                        seconds < 10 ? '0' + '0' + seconds : seconds >= 10 && seconds < 100 ? '0' + seconds : seconds
                    }
                </div>
            </div>
            <div className="field">
                {dimension.map((_,y) => {
                    return(
                        <div key={y} className="field-row">
                            {dimension.map((_,x) => {
                                return(
                                    <div
                                        data-type={field[y * props.size + x] > -1 ? 'number' : 'mine'}
                                        data-value={field[y * props.size + x]}
                                        data-y={y}
                                        data-x={x}
                                        key={x}
                                        className="field-row-item"
                                        onClick={ lose || win ? () => {} : clickHandler }
                                        onContextMenu={ lose || win ? () => {} : rightClick }
                                        onMouseDown={ onMouseDown }
                                        onMouseUp={ onMouseUp }
                                    >
                                        {
                                            win && !lose && mask[y * props.size + x] !== Mask.Flag && field[y * props.size + x] !== Mine ? mask[y * props.size + x] = Mask.Transparent : mask[y * props.size + x] !== Mask.Transparent ? mask[y * props.size + x] : field[y * props.size + x] === Mine ? <MineComponent /> : ''
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </>
    );
}