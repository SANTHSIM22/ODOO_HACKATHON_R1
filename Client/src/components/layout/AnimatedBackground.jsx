import React, { useEffect, useRef } from 'react';

const GridBackground = () => {
    const canvasRef = useRef(null);

    const colors = {
        medium: "#E06B80",
        light: "#FFC69D"
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Set canvas dimensions to match window
        const resizeCanvas = () => {
            canvas.width = canvas.clientWidth * 2; // Retina display support
            canvas.height = canvas.clientHeight * 2;
            ctx.scale(2, 2); // Scale for retina
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Grid configuration
        const gridSpacing = 120; // Spacing between diagonal lines
        const lineWidth = 1.2;
        const animationSpeed = 0.0002;

        // Animation variables
        let time = 0;
        let animationId;

        // Draw function
        const draw = () => {
            const width = canvas.width / 2;
            const height = canvas.height / 2;

            // Clear with white background
            ctx.clearRect(0, 0, width, height);
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, width, height);

            // Calculate subtle animation values
            const phase = Math.sin(time * Math.PI * animationSpeed) * 0.5 + 0.5;
            const opacity = 0.15 + (phase * 0.1); // Subtle opacity variation
            const spacingVariation = Math.sin(time * 0.0005) * 10; // Subtle spacing variation

            // Set line style
            ctx.strokeStyle = colors.medium;
            ctx.lineWidth = lineWidth;
            ctx.globalAlpha = opacity;

            // Draw diagonal lines from top-left to bottom-right
            ctx.beginPath();
            for (let d = -height; d < width + height; d += gridSpacing + spacingVariation) {
                ctx.moveTo(d, 0);
                ctx.lineTo(d + height, height);
            }
            ctx.stroke();

            // Draw diagonal lines from top-right to bottom-left
            ctx.beginPath();
            for (let d = 0; d < width + height; d += gridSpacing - spacingVariation) {
                ctx.moveTo(d, 0);
                ctx.lineTo(d - height, height);
            }
            ctx.stroke();

            // Add subtle intersection points
            ctx.globalAlpha = opacity * 0.7;
            ctx.fillStyle = colors.light;

            // Calculate intersection points between the two sets of lines
            const effectiveSpacing = gridSpacing + spacingVariation;

            for (let x = -height; x < width + height; x += effectiveSpacing * 2) {
                for (let y = 0; y < height; y += effectiveSpacing * 0.5) {
                    // Only draw points that are within canvas bounds
                    if (x + y < width && x + y > -width) {
                        const size = 2 + Math.sin(time * 0.001 + x * 0.005 + y * 0.005) * 1;
                        ctx.beginPath();
                        ctx.arc(x + y, y, size, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }
            }

            time++;
            animationId = requestAnimationFrame(draw);
        };

        // Start animation
        draw();

        // Cleanup
        return () => {
            window.removeEventListener('resize', resizeCanvas);
            cancelAnimationFrame(animationId);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
            style={{
                backgroundColor: '#FFFFFF'
            }}
        />
    );
};

export default GridBackground;