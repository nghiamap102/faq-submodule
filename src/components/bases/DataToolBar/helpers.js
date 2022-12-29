export const getOperators = (dataType) =>
{
    if (dataType)
    {
        let operators = [];

        switch (dataType)
        {
            case 2:
            case 4:
            case 5:
                operators = [
                    { id: '=', label: '=' },
                    { id: '>', label: '>' },
                    { id: '<', label: '<' },
                    { id: '>=', label: '>=' },
                    { id: '<=', label: '<=' },
                    { id: 'between', label: 'Giữa' }
                ];
                break;
            case 3:
            case 6:
            case 8:
                operators = [
                    { id: '=', label: 'Bằng' },
                    { id: 'like', label: 'Giống' },
                    { id: 'is null', label: 'Rỗng' },
                    { id: 'is not null', label: 'Không rỗng' }
                ];
                break;
            case 1:
            case 10:
                operators = [
                    { id: '=', label: 'Bằng' },
                    { id: 'like', label: 'Giống' }
                ];
                break;
        }
        return operators;
    }

    return [];
};
