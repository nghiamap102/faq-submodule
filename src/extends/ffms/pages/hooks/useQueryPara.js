import { useLocation } from 'react-router-dom';

export const useQueryPara = () =>
{
    return new URLSearchParams(useLocation().search);
};
