// color generator section

        // Utility functions
        function randomColor() {
            return '#' + Math.floor(Math.random()*16777215).toString(16).padStart(6, '0');
        }

        function hslToHex(h, s, l) {
            l /= 100;
            const a = s * Math.min(l, 1 - l) / 100;
            const f = n => {
                const k = (n + h / 30) % 12;
                const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
                return Math.round(255 * color).toString(16).padStart(2, '0');
            };
            return `#${f(0)}${f(8)}${f(4)}`;
        }

        function adjustHue(hue) {
            return (hue + 360) % 360;
        }

        function hexToHSL(hex) {
            let r = parseInt(hex.slice(1, 3), 16) / 255;
            let g = parseInt(hex.slice(3, 5), 16) / 255;
            let b = parseInt(hex.slice(5, 7), 16) / 255;

            let max = Math.max(r, g, b), min = Math.min(r, g, b);
            let h, s, l = (max + min) / 2;

            if (max === min) {
                h = s = 0; // achromatic
            } else {
                let d = max - min;
                s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
                switch (max) {
                    case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                    case g: h = (b - r) / d + 2; break;
                    case b: h = (r - g) / d + 4; break;
                }
                h /= 6;
            }

            return { h: h * 360, s: s * 100, l: l * 100 };
        }

        // Color scheme generation functions
        function generateMonochromatic(baseColor) {
            const hsl = hexToHSL(baseColor);
            return [
                hslToHex(hsl.h, hsl.s, 20),
                hslToHex(hsl.h, hsl.s, 40),
                hslToHex(hsl.h, hsl.s, 60),
                hslToHex(hsl.h, hsl.s, 80),
                hslToHex(hsl.h, hsl.s, 100)
            ];
        }

        function generateComplementary(baseColor) {
            const hsl = hexToHSL(baseColor);
            return [
                baseColor,
                hslToHex(adjustHue(hsl.h + 180), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 30), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 210), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 60), hsl.s, hsl.l)
            ];
        }

        function generateTriadic(baseColor) {
            const hsl = hexToHSL(baseColor);
            return [
                baseColor,
                hslToHex(adjustHue(hsl.h + 120), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 240), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 60), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 300), hsl.s, hsl.l)
            ];
        }

        function generateAnalogous(baseColor) {
            const hsl = hexToHSL(baseColor);
            return [
                hslToHex(adjustHue(hsl.h - 30), hsl.s, hsl.l),
                baseColor,
                hslToHex(adjustHue(hsl.h + 30), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h + 60), hsl.s, hsl.l),
                hslToHex(adjustHue(hsl.h - 60), hsl.s, hsl.l)
            ];
        }

        // Main function to generate colors
        function generateColors(scheme) {
            let baseColor = randomColor();
            switch (scheme) {
                case 'monochromatic':
                    return generateMonochromatic(baseColor);
                case 'complementary':
                    return generateComplementary(baseColor);
                case 'triadic':
                    return generateTriadic(baseColor);
                case 'analogous':
                    return generateAnalogous(baseColor);
                default:
                    return Array(5).fill().map(() => randomColor());
            }
        }

        function showCustomTextBox(message) {
            const customTextBox = document.createElement('div');
            customTextBox.textContent = message;
            customTextBox.style.position = 'fixed';
            customTextBox.style.top = '20px';
            customTextBox.style.left = '50%';
            customTextBox.style.transform = 'translateX(-50%)';
            customTextBox.style.backgroundColor = '#4CAF50';
            customTextBox.style.color = 'white';
            customTextBox.style.padding = '1rem';
            customTextBox.style.borderRadius = '4px';
            customTextBox.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
            customTextBox.style.zIndex = '1000';
            document.body.appendChild(customTextBox);

            setTimeout(() => {
                customTextBox.style.opacity = '0';
                customTextBox.style.transition = 'opacity 0.5s';
            }, 2000);

            setTimeout(() => {
                document.body.removeChild(customTextBox);
            }, 2500);
        }

        // Function to update the UI
        function updateColorBoxes(colors) {
            const container = document.getElementById('colors-container');
            container.innerHTML = ''; // Clear existing color boxes

            colors.forEach(color => {
                const colorBox = document.createElement('div');
                colorBox.className = 'color-box';
                colorBox.innerHTML = `
                    <div class="color-display" style="background-color: ${color};">
                        <button class="copy-button" title="Copy Color">
                            <i class="fas fa-copy"></i>
                        </button>
                    </div>
                    <div class="color-info">
                        <span class="color-code">${color}</span>
                    </div>
                `;
                container.appendChild(colorBox);
            });

            document.querySelectorAll('.copy-button').forEach(button => {
            button.addEventListener('click', function(e) {
                e.stopPropagation(); // Prevent event from bubbling up
                const colorCode = this.closest('.color-box').querySelector('.color-code').textContent;

                // Copy the color code to the clipboard
                navigator.clipboard.writeText(colorCode).then(() => {
                    // Show a success message
                    showCustomTextBox('Color code copied to clipboard!');

                    // Change the icon to a check icon
                    const originalIcon = this.innerHTML; // Store the original icon
                    this.innerHTML = '<i class="fa fa-check"></i>'; // Change to check icon

                    // Revert back to the original icon after 2 seconds
                    setTimeout(() => {
                        this.innerHTML = originalIcon; // Restore original icon
                    }, 2000);
                });
            });
        });
    }
        

        // Function to copy the entire palette
        function copyPalette() {
            const colorCodes = Array.from(document.querySelectorAll('.color-code'))
                .map(span => span.textContent)
                .join(', ');
            
            navigator.clipboard.writeText(colorCodes).then(() => {
                showCustomTextBox('Entire palette copied to clipboard!');
            });
        }

        // Event listener for the generate button
        document.getElementById('generate-palette').addEventListener('click', function() {
            const scheme = document.getElementById('color-scheme').value;
            const colors = generateColors(scheme);
            updateColorBoxes(colors);
        });

        // Event listener for the copy palette button
        document.getElementById('copy-palette').addEventListener('click', copyPalette);

        // Initial generation
        updateColorBoxes(generateColors('random'));