
export const translateStateToSpanish = (status) => {
    switch (status) {
        case 'Operational':
            return 'Operacional';
        case 'Closed':
            return 'Dormida';
        case 'Printing':
            return 'Imprimiendo';
        case 'Paused':
            return 'Pausada';
        default:
            return 'Apagada';
    }
}
