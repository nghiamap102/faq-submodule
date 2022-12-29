import React from 'react';
import './Callout.scss';
interface CalloutProps {
    severity: 'error' | 'warning' | 'info' | 'success';
    title?: string;
    onClose?: () => void;
}
declare const Callout: React.FC<CalloutProps>;
export { Callout };
//# sourceMappingURL=Callout.d.ts.map