function image_quantize(pix) {
    let preset = [];

    for (let i = 0; i < pix.length; i += 4) {
        let average = (
            pix[i] +
            pix[i + 1] +
            pix[i + 2]
        ) / 3;

        let quantized_value = quantize(average, [0, 255]);

        for (let j = 0; j < 3; j++) {
            pix[i + j] = quantized_value;
        }

        preset.push(quantized_value);
    }

    return preset;
}