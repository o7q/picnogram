function image_quantize(pix) {
    let preset = [];

    let count0 = 0;
    let count255 = 0;

    let quantizedImage = [];

    for (let i = 0; i < pix.length; i += 4) {
        let average = (
            pix[i] +
            pix[i + 1] +
            pix[i + 2]
        ) / 3;

        let quantizedPixel = quantize(average, [0, 255]);

        if (quantizedPixel === 0) {
            count0++;
        }
        else {
            count255++;
        }

        quantizedImage.push(quantizedPixel);
    }

    for (let i = 0; i < pix.length; i += 4) {
        let j = i / 4;

        let outputPixel = quantizedImage[j];
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