export default function calculateLayout(width: number, height: number): number {
  const itemWidth = 180;
  const itemHeight = 213;

  let padding = 0;
  if (width < 425) {
    padding = 0;
  } else if (width >= 425 && width < 980) {
    padding = 10;
  } else if (width >= 980 && width < 1080) {
    padding = 50;
  } else if (width >= 1080 && width < 1280) {
    padding = 75;
  } else {
    padding = 150;
  }

  let itemsInRow;
  let itemsInColumn;
  if (width < 425) {
    itemsInRow = 2;
    itemsInColumn = Math.floor((height - 86) / ((width - 40) / 2 + 42));
  } else {
    itemsInRow = Math.floor((width - (padding * 2 + 10)) / itemWidth);
    itemsInColumn = Math.floor((height - 86) / itemHeight);
  }

  return itemsInRow * (itemsInColumn + 1);
}
