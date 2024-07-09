function image_dither(pix) {
    let preset = [];

    let averageImage = [];

    for (let i = 0; i < pix.length; i += 4) {
        let originalPixel = (
            pix[i] +
            pix[i + 1] +
            pix[i + 2]
        ) / 3;

        averageImage.push(originalPixel);
    }

    let count0 = 0;
    let count255 = 0;

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            let oldPixel = averageImage[get1DIndex(x, y, width)];
            let newPixel = quantize(oldPixel, [0, 255]);

            if (newPixel === 0) {
                count0++;
            }
            else {
                count255++;
            }

            let error = oldPixel - newPixel;

            averageImage[get1DIndex(x, y, width)] = newPixel;

            averageImage[get1DIndex(x + 1, y, width)] = averageImage[get1DIndex(x + 1, y, width)] + error * 7.0 / 16.0;
            averageImage[get1DIndex(x - 1, y + 1, width)] = averageImage[get1DIndex(x - 1, y + 1, width)] + error * 3.0 / 16.0;
            averageImage[get1DIndex(x, y + 1, width)] = averageImage[get1DIndex(x, y + 1, width)] + error * 5.0 / 16.0;
            averageImage[get1DIndex(x + 1, y + 1, width)] = averageImage[get1DIndex(x + 1, y + 1, width)] + error * 1.0 / 16.0;
        }
    }

    for (let i = 0; i < pix.length; i += 4) {
        let j = i / 4;

        let outputPixel = averageImage[j];
        if (count0 > count255) {
            outputPixel = outputPixel == 0 ? 255 : 0;
        }

        pix[i] = outputPixel;
        pix[i + 1] = outputPixel;
        pix[i + 2] = outputPixel;

        preset.push(outputPixel);
    }

    return preset;
}