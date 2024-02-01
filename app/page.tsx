'use client';
import { useState } from "react";
export default function Home() {

    const [squares, setSquares] = useState(Array(9).fill(""));
    const [startSquare, setStartSquare] = useState(-1);
    const [turn, setTurn] = useState('X');
    const [turnCount, setTurnCount] = useState(0);
    const [win, setWin] = useState(false);


    function handleClick(i: number) {
        const nextSquares = squares.slice();
        if (turnCount < 6) {
            if (turn == 'X') {
                nextSquares[i] = 'X';
            } else {
                nextSquares[i] = 'O';
            }
            setTurn(turn === 'X' ? 'O' : 'X')
            setTurnCount(turnCount + 1)
        } else {
            if (startSquare === -1) {
                setStartSquare(i)
                console.log('from ' + i)
            }
            else if (startSquare !== -1) {
                console.log('to ' + i)
                if (isValidMove(squares, turn, startSquare, i)) {
                    nextSquares[i] = nextSquares[startSquare];
                    nextSquares[startSquare] = '';
                    console.log(turn)
                    setTurn(turn === 'X' ? 'O' : 'X')
                }
                setStartSquare(-1);
            }
        }
        setWin(checkWin(nextSquares, turn));
        setSquares(nextSquares);

    }
    function isValidMove(board: string[], player: string, from: number, to: number): boolean {
        if (board[4] === player) {
            if (from !== 4 && !checkCanWin(board, player, from, to)) {
                console.log('not winning')
                return false
            }
        }
        console.log(board)
        if (board[to] !== '') {
            console.log('not an empty square')
            return false
        }
        if (board[from] !== player) {
            console.log('not a player square')
            return false
        }
        if (!isAdjacent(from, to)) {
            console.log('not adjacent')
            return false
        }
        return true
    }
    function checkCanWin(board: string[], playerSymbol: string, from: number, to: number): boolean {
        var win = false
        board[to] = board[from]
        win = checkWin(board, playerSymbol)
        board[to] = ''
        return win
    }
    function checkWin(board: string[], playerSymbol: string): boolean {
        // Check rows, columns, and diagonals
        return (
            // Check rows
            (board[0] === playerSymbol && board[1] === playerSymbol && board[2] === playerSymbol) ||
            (board[3] === playerSymbol && board[4] === playerSymbol && board[5] === playerSymbol) ||
            (board[6] === playerSymbol && board[7] === playerSymbol && board[8] === playerSymbol) ||
            // Check columns
            (board[0] === playerSymbol && board[3] === playerSymbol && board[6] === playerSymbol) ||
            (board[1] === playerSymbol && board[4] === playerSymbol && board[7] === playerSymbol) ||
            (board[2] === playerSymbol && board[5] === playerSymbol && board[8] === playerSymbol) ||
            // Check diagonals
            (board[0] === playerSymbol && board[4] === playerSymbol && board[8] === playerSymbol) ||
            (board[2] === playerSymbol && board[4] === playerSymbol && board[6] === playerSymbol)
        );
    }
    function isAdjacent(index1: number, index2: number): boolean {
        const positions: { [key: number]: [number, number] } = {
            0: [0, 0], 1: [0, 1], 2: [0, 2],
            3: [1, 0], 4: [1, 1], 5: [1, 2],
            6: [2, 0], 7: [2, 1], 8: [2, 2]
        };


        const [x1, y1] = positions[index1];
        const [x2, y2] = positions[index2];

        const dx = Math.abs(x1 - x2);
        const dy = Math.abs(y1 - y2);

        return (dx === 1 && dy === 0) || (dx === 0 && dy === 1) || (dx === 1 && dy === 1);
    }
    function resetGame() {
        setSquares(Array(9).fill(''))
        setStartSquare(-1)
        setTurnCount(0)
        setTurn('X')
        setWin(false)
    }

    return (
        <>
            {win ?
                <button className='z-1 h-screen w-screen absolute inset-x-0 inset-y-0 text-xl bg-black bg-opacity-50' onClick={() => resetGame()}>
                    {turn == 'X' ? 'O' : 'X'} won! Start Over?
                </button> : <div aria-disabled={win} className='z-0 h-screen w-screen flex flex-col items-center justify-center p-10'>
                    <div aria-disabled={win} className={`flex-none grid gap-x-10 gap-y-4 h-96 w-96 grid-cols-3`}>
                        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((value) =>
                            <Square key={value} value={squares[value]} onSquareClick={() => handleClick(value)} disabled={win} />
                        )}
                    </div>
                </div>
            }
        </>
    );

}

function Square({ value, onSquareClick, disabled }: { value: string, onSquareClick: () => void, disabled: boolean }) {
    return (
        <button aria-disabled={disabled} className='w-32 h-32 flex items-center justify-center border-black border-2 border-solid text-xl box-border' onClick={onSquareClick}>{value}</button>

    );
}
