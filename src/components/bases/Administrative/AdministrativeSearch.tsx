import React, { useContext, useEffect, useState } from 'react';
import { FormControlLabel } from 'components/bases/Form';
import { AdvanceSelect } from 'components/bases/AdvanceSelect';
import { AdministrativeMapContext } from './AdministrativeMapContext';
import { useMergeState } from 'hooks/useMergeState';
import { Bounds } from './Administrative';

type AdministrativeSearchProps = {
    administrativeSvc: any,
    onSelectionChange?: Function,
    label?: string,
    direction?: 'column' | 'row' ,
}

const AdministrativeSearch: React.FC<AdministrativeSearchProps> = (props) =>
{
    const {
        administrativeSvc,
        onSelectionChange,
        label = '',
        direction = 'column' ,
    } = props;
    const {
        map,
        location,
    } = useContext<any>(AdministrativeMapContext);
    const [state, setState] = useMergeState<any>({
        locations: [],
        location: {},
        options: [],
        value: '',
    });

    useEffect(()=>
    {
        setLocation(location);
    }, [location]);

    const setLocation = (location: any) =>
    {
        if (location)
        {
            if (!location.id)
            {
                location.id = location.latitude + ',' + location.longitude;
            }

            const initLabel = [location.name, location.address].filter((x) => x).join(', ');
            const options = [{ id: location.id, label: initLabel, provider: location.provider }];

            setState({ location, options, value: location.id });
        }
        else
        {
            setState({ location: {}, options: [], value: '' });
        }
    };

    const getBounds = (): Bounds =>
    {
        if (map)
        {
            const bounds = map.getBounds();
            return {
                north: bounds.getNorth(),
                east: bounds.getEast(),
                south: bounds.getSouth(),
                west: bounds.getWest(),
            };
        }
        return {};
    };

    const [textChangeDelay, setTextChangeDelay] = useState<any>(null);
    const handleTextChange = (searchKey: string) =>
    {
        if (textChangeDelay)
        {
            clearTimeout(textChangeDelay);
            setTextChangeDelay(null);
        }
        if (searchKey)
        {
            setTextChangeDelay(
                setTimeout(() =>
                {
                    if (searchKey)
                    {
                        administrativeSvc.search(searchKey, getBounds()).then((res: any) =>
                        {
                            if (res.docs && res.docs.length > 0)
                            {
                                const newOptions = res.docs.map((doc: any) =>
                                {
                                    if (!doc.id)
                                    {
                                        doc.id = doc.longitude + '-' + doc.latitude;
                                    }

                                    return {
                                        id: doc.id,
                                        provider: doc.provider,
                                        label: [doc.name || '', doc.address].concat(doc.provider ? [` (${doc.provider})`] : []).filter((item) => item).join(', '),
                                    };
                                });
                                setState({ locations: res.docs, options: newOptions });
                            }
                        });
                    }
                }, 500),
            );
        }
    };

    const handleSelectionChange = (value: any) =>
    {
        if (!value || value === -1 || value === 'non-select')
        {
            return;
        }

        const { locations, options } = state;

        const refreshOptions = options.filter((option: any) => option.id === value);

        // check locations in init
        let loc = locations.length === 0 ? location : locations.find((loc: any) => loc.id === value);

        loc = {
            longitude: loc?.longitude || location.longitude || '',
            latitude: loc?.latitude || location.latitude || '',
            name: loc?.name || '',
            address: loc?.address || '',
            city: loc?.province || '',
            country: loc?.country || '',
        };
        if (typeof onSelectionChange === 'function')
        {
            onSelectionChange(loc);
        }
        !refreshOptions.length && refreshOptions.push(loc);
        setState({ options: refreshOptions, value: value });
    };

    return (
        <FormControlLabel
            label={label}
            direction={direction}
            control={(
                <AdvanceSelect
                    options={state.options}
                    value={state.value}
                    searchMode='remote'
                    searchable
                    onRemoteFetch={handleTextChange}
                    onChange={handleSelectionChange}
                />
            )}
        />
    );
};

export { AdministrativeSearch };

