import React from 'react';
import { Badge } from '@/components/ui/badge';
import { REGISTRATION_STATUS } from '@/lib/businessSchema';

const StatusBadge = ({ status }) => {
    let colorClass = "bg-gray-100 text-gray-800 hover:bg-gray-200";

    switch (status) {
        case REGISTRATION_STATUS.ACTIVE:
            colorClass = "bg-green-100 text-green-800 hover:bg-green-200 border-green-200";
            break;
        case REGISTRATION_STATUS.PENDING_KYB:
            colorClass = "bg-yellow-100 text-yellow-800 hover:bg-yellow-200 border-yellow-200";
            break;
        case REGISTRATION_STATUS.REJECTED:
        case REGISTRATION_STATUS.SUSPENDED:
            colorClass = "bg-red-100 text-red-800 hover:bg-red-200 border-red-200";
            break;
        case REGISTRATION_STATUS.INCOMPLETE:
            colorClass = "bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200";
            break;
        default:
            break;
    }

    return (
        <Badge variant="outline" className={`${colorClass} px-2.5 py-0.5 rounded-full font-medium border`}>
            {status?.replace(/_/g, " ") || "UNKNOWN"}
        </Badge>
    );
};

export default StatusBadge;