import EXIF from 'exif-js';

export const ImageReader = () =>
{
    const read = (file) => new Promise((resolve, reject) =>
    {
        // Get Image base64 - Always run before array buffer
        const base64Reader = new FileReader();
        base64Reader.readAsDataURL(file);
        base64Reader.onload = (e) =>
        {
            const image = e.target.result;

            // get Image width and height
            const img = new Image();
            img.src = e.target.result;
            img.onload = function ()
            {
                const height = this.height;
                const width = this.width;

                // get Image Orientation
                const bufferReader = new FileReader();
                bufferReader.readAsArrayBuffer(file);
                bufferReader.onload = (e) =>
                {
                    const exif = EXIF.readFromBinaryFile(e.target.result);
                    const orientation = Number(exif?.Orientation) || 1;

                    resolve({ image, width, height, orientation });
                };
            };
        };
    });

    return {
        read,
    };
};
