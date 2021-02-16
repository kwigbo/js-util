// Method used to convert RGB values to Hex string
//
// - r: The red value to convert
// - g: The green value to convert
// - b: The blue value to convert
// - Returns: The converted Hex string
function RGBToHex(r, g, b) {
  r = r.toString(16);
  g = g.toString(16);
  b = b.toString(16);

  if (r.length == 1)
    r = "0" + r;
  if (g.length == 1)
    g = "0" + g;
  if (b.length == 1)
    b = "0" + b;

    return "#" + r + g + b;
}

// Method used to scale a size to fit a max width
//
// - width: The width to scale
// - height: The height to scale
// - maxWidth: The width to constrain the size to
function scaleSizeToFitWidth(width, height, maxWidth) {
  var newWidth = width;
  var newHeight = height;

  let factor = newWidth / maxWidth
  newWidth = maxWidth
  newHeight = newHeight / factor

  return [newWidth, newHeight];
}

// Draw the loaded image into the preview canvas with a given scale factor

function renderPixelImage(image, fromCanvas, toCanvas, maxWidth) {
	fromCanvas.width = image.width;
	fromCanvas.height = image.height;

	fromDataContext = fromCanvas.getContext("2d");
	toImageContext = toCanvas.getContext("2d");

	fromDataContext.drawImage(
		image, 0, 0, image.width, image.height);

	var imageWidth = image.width;
	var imageHeight = image.height;
	
	let realSize = scaleSizeToFitWidth(imageWidth, imageHeight, maxWidth);
	imageWidth = realSize[0];
	imageHeight = realSize[1];

	toCanvas.width = imageWidth;
	toCanvas.height = imageHeight;

	let scaleFactor = imageWidth/image.width;

	var colors = [];

	for (var x = 0; x < imageWidth; x++) {
		for (var y = 0; y < imageHeight; y++) {
			let pixelData = toImageContext.getImageData(x, y, 1, 1);
			let red = pixelData.data[0];
			let green = pixelData.data[1];
			let blue = pixelData.data[2];
			let alpha = pixelData.data[3];

			let colorString = RGBToHex(red, green, blue, true);
			if (!colors.includes(colorString) && alpha > 0) {
				colors.push(colorString);
			}
			
			let xPos = x*scaleFactor
			let yPos = y*scaleFactor
			let width = scaleFactor

			if (alpha === 0) {
				toImageContext.clearRect(xPos, yPos, width, width);
			} else {
				toImageContext.fillStyle = RGBToHex(red, green, blue);
				toImageContext.fillRect(xPos, yPos, width, width);
			}
		}
	}
}
