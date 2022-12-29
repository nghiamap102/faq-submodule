import { useEffect, useState } from 'react';

interface IUseConvertCoordinatesToOLC {
    latitude: string
    longitude: string
    Tang: string
}
const useConvertCoordinatesToOLC = (params: IUseConvertCoordinatesToOLC) =>
{
    const { latitude, longitude, Tang } = params;
    const [postalCode, setPostalCode] = useState('');
    const CODE_PRECISION = 12;
    const MAX_DIGIT_COUNT = 15;
    const PAIR_CODE_LENGTH = 10;
    const CODE_ALPHABET = '23456789CFGHJMPQRVWX';
    const ENCODING_BASE = CODE_ALPHABET.length;
    const GRID_ROWS = 5;
    const GRID_COLUMNS = 4;
    const LATITUDE_MAX = 90;
    const LONGITUDE_MAX = 180;
    const PAIR_PRECISION = Math.pow(ENCODING_BASE, 3);
    const FINAL_LAT_PRECISION = PAIR_PRECISION * Math.pow(GRID_ROWS, (MAX_DIGIT_COUNT - PAIR_CODE_LENGTH));
    const FINAL_LNG_PRECISION = PAIR_PRECISION * Math.pow(GRID_COLUMNS, (MAX_DIGIT_COUNT - PAIR_CODE_LENGTH));
    const SEPARATOR = '+';
    const SEPARATOR_POSITION = 8;
    const GRID_CODE_LENGTH = MAX_DIGIT_COUNT - PAIR_CODE_LENGTH;

    useEffect(() =>
    {
        const OLCode = encode(latitude, longitude);
        setPostalCode(OLCode);
    }, [latitude, longitude, Tang]);

    const encode = (latitude: string, longitude: string, codeLength = CODE_PRECISION) =>
    {
        let lat = parseFloat(latitude);
        let lng = parseFloat(longitude);
        if (codeLength < 2 ||
          (codeLength < PAIR_CODE_LENGTH && codeLength % 2 === 1))
        {
            throw new Error('IllegalArgumentException: Invalid Open Location Code length');
        }
        // Ensure that latitude and longitude are valid.
        lat = clipLatitude(lat);
        lng = normalizeLongitude(lng);
        // Latitude 90 needs to be adjusted to be just less, so the returned code
        // can also be decoded.
        if (lat === 90)
        {
            lat = lat - computeLatitudePrecision(codeLength);
        }
        let code = '';

        // Compute the code.
        // This approach converts each value to an integer after multiplying it by
        // the final precision. This allows us to use only integer operations, so
        // avoiding any accumulation of floating point representation errors.

        // Multiply values by their precision and convert to positive.
        // Force to integers so the division operations will have integer results.
        // Note: JavaScript requires rounding before truncating to ensure precision!
        let latVal = Math.floor(Math.round((lat + LATITUDE_MAX) * FINAL_LAT_PRECISION * 1e6) / 1e6);
        let lngVal = Math.floor(Math.round((lng + LONGITUDE_MAX) * FINAL_LNG_PRECISION * 1e6) / 1e6);

        // Compute the grid part of the code if necessary.
        if (codeLength > PAIR_CODE_LENGTH)
        {
            for (let i = 0; i < MAX_DIGIT_COUNT - PAIR_CODE_LENGTH; i++)
            {
                const latDigit = latVal % GRID_ROWS;
                const lngDigit = lngVal % GRID_COLUMNS;
                const ndx = latDigit * GRID_COLUMNS + lngDigit;
                code = CODE_ALPHABET.charAt(ndx) + code;
                // Note! Integer division.
                latVal = Math.floor(latVal / GRID_ROWS);
                lngVal = Math.floor(lngVal / GRID_COLUMNS);
            }
        }
        else
        {
            latVal = Math.floor(latVal / Math.pow(GRID_ROWS, GRID_CODE_LENGTH));
            lngVal = Math.floor(lngVal / Math.pow(GRID_COLUMNS, GRID_CODE_LENGTH));
        }
        // Compute the pair section of the code.
        for (let i = 0; i < PAIR_CODE_LENGTH / 2; i++)
        {
            code = CODE_ALPHABET.charAt(lngVal % ENCODING_BASE) + code;
            code = CODE_ALPHABET.charAt(latVal % ENCODING_BASE) + code;
            latVal = Math.floor(latVal / ENCODING_BASE);
            lngVal = Math.floor(lngVal / ENCODING_BASE);
        }

        // Pad and return the code.
        code = Tang && Tang !== '0'
            ? code.substring(0, SEPARATOR_POSITION) + SEPARATOR + code.substring(SEPARATOR_POSITION, CODE_PRECISION - Tang.toString().length - 1) + Tang
            : code.substring(0, SEPARATOR_POSITION) + SEPARATOR + code.substring(SEPARATOR_POSITION, CODE_PRECISION - 1);

        return code.substring(0, CODE_PRECISION);
    };

    const clipLatitude = (lat: number) =>
    {
        return Math.min(90, Math.max(-90, lat));
    };

    const computeLatitudePrecision = (codeLength: number) =>
    {
        if (codeLength <= 10)
        {
            return Math.pow(ENCODING_BASE, Math.floor(codeLength / -2 + 2));
        }
        return Math.pow(ENCODING_BASE, -3) / Math.pow(GRID_ROWS, codeLength - 10);
    };

    const normalizeLongitude = (lng: number) =>
    {
        while (lng < -180)
        {
            lng = lng + 360;
        }
        while (lng >= 180)
        {
            lng = lng - 360;
        }
        return lng;
    };

    return ({
        postalCode,
    });
};

export default useConvertCoordinatesToOLC;
