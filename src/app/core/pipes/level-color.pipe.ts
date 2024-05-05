// level-color.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'levelColor',
})
export class LevelColorPipe implements PipeTransform {
  transform(value: number): string {
    // Define distinct hue values for each level
    const hues = [
      275, // Magenta-Pink
      0, // Red
      200, // Blue
      25, // Orange
      325, // Pink-Red
      50, // Yellow
      225, // Blue-Magenta
      75, // Yellow-Green
      100, // Green
      350, // Reddish-Brown
      125, // Green-Cyan
      175, // Cyan-Blue
      150, // Cyan
      250, // Magenta
      300, // Pink
    ];

    // Calculate hue based on the number of levels
    let hue = hues[value % hues.length];

    // Convert hue to HSL color with adjusted saturation and lightness for darker colors
    let color = `hsl(${hue}, 60%, 45%)`; // Saturation set to 60% and Lightness set to 25%

    return color;
  }
}
