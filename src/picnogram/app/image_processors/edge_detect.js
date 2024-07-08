function image_edge_detect(pix) {
    let quantizedImage = [];
    const values = [0, 25, 50, 75, 100, 125, 150, 175, 200, 225, 250, 255];

    for (let i = 0; i < pix.length; i++) {
        let closestIndex = 0;
        let lowestDistance = Number.MAX_SAFE_INTEGER;

        for (let j = 0; j < values.length; j++) {
            const distance = Math.abs(pix[i] - values[j]);

            if (distance < lowestDistance) {
                lowestDistance = distance;
                closestIndex = j;
            }
        }

        quantizedImage.push(values[closestIndex]);
    }

    let edgeDetectedImage = [];

    const kernelWidth = 3;
    const kernelHeight = 3;
    for (let i = 0; i < quantizedImage.length; i += 4) {
        let convolution_r = 0;
        let convolution_g = 0;
        let convolution_b = 0;

        for (let kernel_y = 0; kernel_y < kernelHeight; kernel_y++) {
            for (let kernel_x = 0; kernel_x < kernelWidth; kernel_x++) {

                let index2d = get2DIndex(i / 4, width);

                let yIndex = Math.min(
                    Math.max(index2d.y + kernel_y - Math.floor(kernelHeight / 2), 0),
                    height - 1
                );
                let xIndex = Math.min(
                    Math.max(index2d.x + kernel_x - Math.floor(kernelWidth / 2), 0),
                    width - 1
                );


                let rgbPixel = quantizedImage[get1DIndex(xIndex, yIndex, width) * 4];
                let multiplier = edge_detection_kernel[get1DIndex(kernel_x, kernel_y, kernelWidth)];

                convolution_r += quantizedImage[rgbPixel] * multiplier;
                convolution_g += quantizedImage[rgbPixel + 1] * multiplier;
                convolution_b += quantizedImage[rgbPixel + 2] * multiplier;
            }
        }

        edgeDetectedImage.push(convolution_r);
        edgeDetectedImage.push(convolution_g);
        edgeDetectedImage.push(convolution_b);
        edgeDetectedImage.push(255);
    }

    let preset = [];

    for (let i = 0; i < edgeDetectedImage.length; i += 4) {
        let average = (
            edgeDetectedImage[i] +
            edgeDetectedImage[i + 1] +
            edgeDetectedImage[i + 2]
        ) / 3;

        let average0255 = quantize(average * 255, [0, 255]);

        for (let j = 0; j < 3; j++) {
            pix[i + j] = average0255;
        }

        preset.push(average0255);
    }
    return preset;
}