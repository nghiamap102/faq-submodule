import FileSaver from 'file-saver';
import moment from 'moment';

export class FileHelper
{
    static saveExportFileAs = (name, response, fileExtension = '.xlsx') =>
    {
        return response.blob().then((res) =>
        {
            if (res.size > 0)
            {
                const dateTime = moment().format('YYYY_MM_DD_HHmmss').replace(/\//g, '-');
                const fileType = res.type || 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
                const blob = new Blob([res], { type: fileType });

                // Download the file
                FileSaver.saveAs(blob, `${name}_${dateTime}` + fileExtension);
            }
        }).catch(error =>
        {
            console.log(error);
        });
    };

    // objectUrl: URL.createObjectUrl(<file>)
    // dataUrl: fileReader.onload(e => e.target.result)
    static urlToFile = (url, filename, mimeType) =>
    {
        return (fetch(url)
            .then(function (res)
            {
                return res.arrayBuffer();
            })
            .then(function (buf)
            {
                return new File([buf], filename, { type: mimeType });
            })
        );
    };
}
