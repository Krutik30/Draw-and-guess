"use client"

import { ChromePicker } from 'react-color'
import { io } from 'socket.io-client'

import React, { useEffect, useState } from 'react'
import { drawLine } from '../../utils/drawLine'
import { useDraw } from '../../hooks/useDraw'
import { socket, socketPort } from '../../utils/config'
import './style.css';

type DrawLineProps = {
    prevPoint: Point | null
    currentPoint: Point
    color: string
}

export default function Page() {


    const [color, setColor] = useState<string>('#000')
    const { canvasRef, onMouseDown, clear } = useDraw(createLine)

    const teamId = typeof window !== 'undefined' ? localStorage.getItem('teamId') : null;

    useEffect(() => {
        const ctx = canvasRef.current?.getContext('2d')
        
        socket.emit('client-ready', teamId)

        // socket.emit('team-check', teamId);

        // socket.on('team-check-from-server', () => {
        //     console.log('team check received')
        // });

        socket.on('get-canvas-state',() => {
            if (!canvasRef.current?.toDataURL()) return
            console.log('sending canvas state')
            socket.emit('canvas-state', canvasRef.current.toDataURL(), teamId)
        })

        socket.on('canvas-state-from-server', (state: string) => {
            console.log('I received the state')
            const img = new Image()
            img.src = state
            img.onload = () => {
                ctx?.drawImage(img, 0, 0)
            }
        })

        socket.on('draw-line', ({ prevPoint, currentPoint, color }: DrawLineProps) => {
            if (!ctx) return console.log('no ctx here')
            drawLine({ prevPoint, currentPoint, ctx, color })
        })

        socket.on('clear', clear)
    
        return () => {
            socket.off('draw-line')
            socket.off('team-check-from-server')
            socket.off('get-canvas-state')
            socket.off('canvas-state-from-server')
            socket.off('clear')
        }
    }, [canvasRef, clear, teamId])

    function createLine({ prevPoint, currentPoint, ctx }: Draw) {
        socket.emit('draw-line', { prevPoint, currentPoint, color }, teamId)
        drawLine({ prevPoint, currentPoint, ctx, color })
    }


    return (
        <div className='outer-container'>
            {/* Left container */}
            <div className='left-container'>
                <h2 className='choose-color'>Choose Color</h2>
                <ChromePicker
                    color={color}
                    onChange={(e) => setColor(e.hex)}
                />
                <button
                    type='button'
                    className='mt-4 p-2 rounded-md border border-black'
                    onClick={() => socket.emit('clear', teamId)}
                >
                    Clear Canvas
                </button>
            </div>

            {/* Right container */}
            <div className='right-container'>
                <canvas
                    ref={canvasRef}
                    onMouseDown={onMouseDown}
                    width={750}
                    height={750}
                    className='canvas'
                />
            </div>
        </div>
    )
}
