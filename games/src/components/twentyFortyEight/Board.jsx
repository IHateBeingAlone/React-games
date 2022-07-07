import React from 'react';
import {useState} from 'react';
import {Cell} from './Cell';
import {Tile} from './Tile';

function createBoard (size) {
    const board = []

    for (let V = 0; V < size; V++) {
        board[V] = []
        for (let Z = 0; Z < size; Z++) {
            board[V][Z] = 0
        }
    }

    for (let i = 0; i < size; i++) {
        const x = Math.floor(Math.random() * size)
        const y = Math.floor(Math.random() * size)
        const value = Math.floor(Math.random() * 99)

        if (board[y][x] > 0) continue

        value >= 85 ? board[y][x] = 4 : board[y][x] = 2
    }

    return board
}

export function Board (props) {
    const [board, setBoard] = useState(() => createBoard(props.size))
    const [point, setPoint] = useState(() => new Array(2).fill(null))

    function addNumber () {
        const notNumbers = []

        board.map((_, y) => {
            board[y].map((element, x) => {
                if (element === 0) {
                    notNumbers.push([[y, x]])
                }
            })
        })

        const randomItem = Math.floor(Math.random() * notNumbers.length)

        const value = Math.floor(Math.random() * 99)

        value >= 85 ?
            board[notNumbers[randomItem][0][0]][notNumbers[randomItem][0][1]] = 4 :
            board[notNumbers[randomItem][0][0]][notNumbers[randomItem][0][1]] = 2
    }

    const swipeRight = () => {
        let newArray = [...board]
        let oldBoard = JSON.parse(JSON.stringify(board))

        for (let i = props.size - 1; i >= 0; i--) {
            let b = newArray[i]
            let slow = b.length - 1
            let fast = slow - 1
            while (slow > 0) {
                if (fast === -1) {
                    fast = slow - 1
                    slow--
                    continue;
                }
                if (b[slow] === 0 && b[fast] === 0) {
                    fast--
                } else if (b[slow] === 0 && b[fast] !== 0) {
                    b[slow] = b[fast]
                    b[fast] = 0
                    fast--
                } else if (b[slow] !== 0 && b[fast] === 0) {
                    fast--
                } else if (b[slow] !== 0 && b[fast] !== 0) {
                    if (b[slow] === b[fast]) {
                        b[slow] = b[slow] + b[fast]
                        b[fast] = 0
                        fast = slow - 1
                        slow--
                    } else {
                        slow--
                        fast = slow - 1
                    }
                }
            }
        }

        if (JSON.stringify(newArray) !== JSON.stringify(oldBoard)) {
            addNumber()
        }

        setBoard(newArray)
    }

    const swipeLeft = () => {
        let newArray = [...board]
        let oldBoard = JSON.parse(JSON.stringify(board))

        for (let i = 0; i < props.size; i++) {
            let b = newArray[i]
            let slow = 0
            let fast = slow + 1
            while (slow < props.size) {
                if (fast === props.size) {
                    fast = slow + 1
                    slow++
                    continue;
                }
                if (b[slow] === 0 && b[fast] === 0) {
                    fast++
                } else if (b[slow] === 0 && b[fast] !== 0) {
                    b[slow] = b[fast]
                    b[fast] = 0
                    fast++
                } else if (b[slow] !== 0 && b[fast] === 0) {
                    fast++
                } else if (b[slow] !== 0 && b[fast] !== 0) {
                    if (b[slow] === b[fast]) {
                        b[slow] = b[slow] + b[fast]
                        b[fast] = 0
                        fast = slow + 1
                        slow++
                    } else {
                        slow++
                        fast = slow + 1
                    }
                }
            }
        }

        if (JSON.stringify(newArray) !== JSON.stringify(oldBoard)) {
            addNumber()
        }

        setBoard(newArray)
    }

    const swipeUp = () => {
        let b = [...board]
        let oldBoard = JSON.parse(JSON.stringify(board))

        for (let i = 0; i < props.size; i++) {
            let slow = 0
            let fast = 1
            while (slow < props.size) {
                if (fast === props.size) {
                    fast = slow + 1
                    slow++
                    continue;
                }
                if (b[slow][i] === 0 && b[fast][i] === 0) {
                    fast++
                } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
                    b[slow][i] = b[fast][i]
                    b[fast][i] = 0
                    fast++
                } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
                    fast++
                } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
                    if (b[slow][i] === b[fast][i]) {
                        b[slow][i] = b[slow][i] + b[fast][i]
                        b[fast][i] = 0
                        fast = slow + 1
                        slow++
                    } else {
                        slow++
                        fast = slow + 1
                    }
                }
            }
        }

        if (JSON.stringify(b) !== JSON.stringify(oldBoard)) {
            addNumber()
        }

        setBoard(b)
    }

    const swipeDown = () => {
        let b = [...board]
        let oldBoard = JSON.parse(JSON.stringify(board))

        for (let i = props.size - 1; i >= 0; i--) {
            let slow = b.length - 1
            let fast = slow - 1
            while (slow > 0) {
                if (fast === -1) {
                    fast = slow - 1
                    slow--
                    continue;
                }
                if (b[slow][i] === 0 && b[fast][i] === 0) {
                    fast--
                } else if (b[slow][i] === 0 && b[fast][i] !== 0) {
                    b[slow][i] = b[fast][i]
                    b[fast][i] = 0
                    fast--
                } else if (b[slow][i] !== 0 && b[fast][i] === 0) {
                    fast--
                } else if (b[slow][i] !== 0 && b[fast][i] !== 0) {
                    if (b[slow][i] === b[fast][i]) {
                        b[slow][i] = b[slow][i] + b[fast][i]
                        b[fast][i] = 0
                        fast = slow - 1
                        slow--
                    } else {
                        slow--
                        fast = slow - 1
                    }
                }
            }
        }

        if (JSON.stringify(b) !== JSON.stringify(oldBoard)) {
            addNumber()
        }

        setBoard(b)
    }

    const onDragStart = (e) => {
        point[0] = e.clientX
        point[1] = e.clientY
    }

    const onDragEnd = () => {
        point[0] = null
        point[1] = null
    }

    const onDrag = (e) => {
        if (point[0] !== null && point[1] !== null) {
            if (e.clientX - point[0] > 55) {
                point[0] = null
                point[1] = null
                swipeRight()
            } else if (point[0] - e.clientX > 55) {
                point[0] = null
                point[1] = null
                swipeLeft()
            } else if (point[1] - e.clientY > 55) {
                point[0] = null
                point[1] = null
                swipeUp()
            } else if (e.clientY - point[1] > 55) {
                point[0] = null
                point[1] = null
                swipeDown()
            }
        }
    }

    return (
        <div className="wrapper-2048" onMouseMove={onDrag}>
            <div className="board" onMouseDown={onDragStart} onMouseUp={onDragEnd}>
                {board.map((_,y) => {
                    return(
                        <div
                            key={y}
                            className="board-row"
                            style={{height: 'calc(((100% + 12px) / '+ props.size +') - 12px)'}}
                        >
                            {board[y].map((_,x) => {
                                return(
                                    <div
                                        key={x}
                                        className="board-row-item"
                                        style={{width: 'calc(((100% + 12px) / '+ props.size +') - 12px)'}}
                                    >
                                        {
                                            board[y][x] > 0 ? <Tile value={board[y][x]} x={x} y={y} /> : <Cell value={board[y][x]} x={x} y={y} />
                                        }
                                    </div>
                                );
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    )
}