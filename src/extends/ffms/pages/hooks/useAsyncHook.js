import { useEffect, useState } from 'react';

const useAsyncHook = (serviceAPI) =>
{
    const [result, setResult] = useState([]);
    const [loading, setLoading] = useState(false);
  
    useEffect(() =>
    {
        async function fetchData()
        {
            try
            {
                setLoading(true);
                const json = await serviceAPI;
                setResult(json);
                setLoading(false);
            }
            catch (error)
            {
                setLoading(false);
            }
        }
  
        if (serviceAPI !== '')
        {
            fetchData();
        }
    }, []);
  
    return [result, loading];
};

export default useAsyncHook;
