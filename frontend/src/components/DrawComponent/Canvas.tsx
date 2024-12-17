import React, { useRef, useEffect, useState } from 'react'


const Canvas = ({ socket }:any) => {

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [lineWidth, setLineWidth] = useState(5);
    const [lineColor, setLineColor] = useState("blue");
    const [lineOpacity, setLineOpacity] = useState(0.1);


    useEffect(() => {
        const canvas: HTMLCanvasElement = canvasRef.current!;
        const ctx: CanvasRenderingContext2D = canvas.getContext('2d')!
        canvas.width = 192;
        canvas.height = 128;
        ctx.fillStyle = '#000'
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height)
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.globalAlpha = lineOpacity;
        ctx.strokeStyle = lineColor;
        ctx.lineWidth = lineWidth;
        ctxRef.current! = ctx;
    }, [lineColor, lineOpacity, lineWidth]);


    // Function for starting the drawing
    const startDrawing = (e:any) => {
        


        const getPosition = (event: any) => {
            if (event.touches) {
                const touch = event.touches[0]; // Erster Touch-Punkt
                const rect = canvasRef.current!.getBoundingClientRect();
                return {
                    x: touch.clientX - rect.left,
                    y: touch.clientY - rect.top,
                };
            }
            return {
                x: event.nativeEvent.offsetX,
                y: event.nativeEvent.offsetY,
            };
        };
    
        if (!ctxRef.current) return;
    
        const pos = getPosition(e);

        ctxRef.current!.beginPath();
        ctxRef.current!.moveTo(
            pos.x,
            pos.y
        );
        setIsDrawing(true);
    };

    // Function for ending the drawing
    const endDrawing = () => {
        ctxRef.current!.closePath();
        setIsDrawing(false);
    };

    const draw = (e:any) => {
        if (!isDrawing) {
            return;
        }
        const getPosition = (event: any) => {
            if (event.touches) {
                const touch = event.touches[0]; // Erster Touch-Punkt
                const rect = canvasRef.current!.getBoundingClientRect();
                return {
                    x: Math.floor(touch.clientX - rect.left),
                    y: Math.floor(touch.clientY - rect.top),
                };
            }
            return {
                x:  Math.floor(event.nativeEvent.offsetX),
                y:  Math.floor(event.nativeEvent.offsetY),
            };
        };
    
        if (!ctxRef.current) return;
    
        const pos = getPosition(e);


        socket.emit("data", {type:"draw", data:pos})
        ctxRef.current!.lineTo(
            pos.x,
            pos.y
        );

        ctxRef.current!.stroke();
    };

    return <canvas ref={canvasRef}
        onMouseDown={startDrawing}
        onTouchStart={startDrawing}
        onMouseUp={endDrawing}
        onTouchEnd={endDrawing}
        onMouseMove={draw}
        onTouchMove={draw}
         />

}
export default Canvas

// canvas.addEventListener("touchstart", this.pressEventHandler);
//     canvas.addEventListener("touchmove", this.dragEventHandler);
//     canvas.addEventListener("touchend", this.releaseEventHandler);
//     canvas.addEventListener("touchcancel", this.cancelEventHandler);
