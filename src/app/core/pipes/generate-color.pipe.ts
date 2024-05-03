// generate-color.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'generateColor'
})
export class GenerateColorPipe implements PipeTransform {

    transform(value: string): string {
        // Generate hue from the text
        let hue = this.hashCode(value) % 360; // Limit to 360 degrees
    
        // Convert hue to HSL color
        let color = `hsl(${hue}, 70%, 70%)`; // Saturation and Lightness set to 70%
    
        return color;
    }
    
    // Hashing function
        private hashCode(str: string): number {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        return hash;
    }
}